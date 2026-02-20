<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Absensi;
use App\Models\LogWhatsapp;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $hariIni = Carbon::today();

        // 1. Ambil Statistik Utama
        $totalGuru = Guru::count();
        $totalSiswa = Siswa::where('status', 'aktif')->count();
        
        // 2. Statistik WhatsApp Hari Ini
        $waBerhasil = LogWhatsapp::whereDate('created_at', $hariIni)
                        ->where('status_kirim', 'berhasil')->count();
        $waGagal = LogWhatsapp::whereDate('created_at', $hariIni)
                        ->where('status_kirim', 'gagal')->count();
        $waPending = LogWhatsapp::whereDate('created_at', $hariIni)
                        ->where('status_kirim', 'pending')->count();

        // 3. Persentase Kehadiran Hari Ini
        $totalAbsenHariIni = Absensi::whereDate('tanggal', $hariIni)->count();
        $siswaHadir = Absensi::whereDate('tanggal', $hariIni)
                        ->where('status_kehadiran', 'hadir')->count();
        
        $persentaseHadir = $totalAbsenHariIni > 0 
            ? round(($siswaHadir / $totalAbsenHariIni) * 100, 1) 
            : 0;

        // 4. Log WhatsApp Terbaru
        $recentLogs = LogWhatsapp::with('absensi.siswa')
                        ->latest()
                        ->take(5)
                        ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_guru' => $totalGuru,
                'total_siswa' => $totalSiswa,
                'wa_hari_ini' => [
                    'berhasil' => $waBerhasil,
                    'gagal' => $waGagal,
                    'pending' => $waPending,
                ],
                'kehadiran' => $persentaseHadir,
            ],
            'recentLogs' => $recentLogs
        ]);
    }
}