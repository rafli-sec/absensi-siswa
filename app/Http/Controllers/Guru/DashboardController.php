<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Guru;
use App\Models\LogWhatsapp;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru?->id_guru;

        if (!$idGuru) {
            return Inertia::render('guru/dashboard', [
                'stats' => [
                    'total_absen_saya' => 0,
                    'wa_terkirim_saya' => 0,
                    'hari_ini' => '-',
                ],
                'recentAbsensi' => [],
            ]);
        }

        // 1. Total absensi yang pernah diinput guru ini (hitung distinct sesi: tanggal+mapel+jam_ke)
        $totalAbsenSaya = Absensi::where('id_guru', $idGuru)
            ->select(DB::raw('COUNT(DISTINCT CONCAT(tanggal, "-", mapel, "-", jam_ke)) as total'))
            ->value('total');

        // 2. Total WA terkirim yang berasal dari absensi guru ini
        $waTerkirimSaya = LogWhatsapp::whereHas('absensi', function ($q) use ($idGuru) {
            $q->where('id_guru', $idGuru);
        })->where('status_kirim', 'terkirim')->count();

        // 3. Agenda hari ini — absensi yang tanggalnya hari ini (join siswa untuk dapat kelas)
        $hariIni = Carbon::now()->toDateString();
        $agendaHariIni = Absensi::where('absensis.id_guru', $idGuru)
            ->whereDate('absensis.tanggal', $hariIni)
            ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
            ->select('absensis.mapel', 'absensis.jam_ke', 'siswas.kelas')
            ->distinct()
            ->get();

        $agendaText = $agendaHariIni->isEmpty()
            ? 'Tidak Ada Jadwal'
            : $agendaHariIni->map(fn($a) => "{$a->mapel} ({$a->kelas})")->implode(', ');

        // 4. Riwayat absensi terakhir (7 sesi terbaru)
        $recentAbsensi = Absensi::where('absensis.id_guru', $idGuru)
            ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
            ->select(
                'absensis.tanggal',
                'absensis.mapel',
                'absensis.jam_ke',
                'siswas.kelas',
                DB::raw('MIN(absensis.waktu_input) as waktu_input'),
                DB::raw('COUNT(*) as jumlah_siswa')
            )
            ->groupBy('absensis.tanggal', 'absensis.mapel', 'absensis.jam_ke', 'siswas.kelas')
            ->orderByDesc('absensis.tanggal')
            ->orderByDesc('absensis.jam_ke')
            ->limit(7)
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal'      => $item->tanggal,
                    'mapel'        => $item->mapel,
                    'jam_ke'       => $item->jam_ke,
                    'kelas'        => $item->kelas,
                    'waktu_input'  => $item->waktu_input,
                    'jumlah_siswa' => $item->jumlah_siswa,
                ];
            });

        return Inertia::render('guru/dashboard', [
            'stats' => [
                'total_absen_saya' => $totalAbsenSaya,
                'wa_terkirim_saya' => $waTerkirimSaya,
                'hari_ini'         => $agendaText,
            ],
            'recentAbsensi' => $recentAbsensi,
        ]);
    }
}
