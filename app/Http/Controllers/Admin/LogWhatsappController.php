<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LogWhatsapp;
use App\Models\Siswa;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LogWhatsappController extends Controller
{
    /**
     * Menampilkan history WhatsApp group by kelas
     */
    public function index(Request $request)
    {
        // Ambil data log WhatsApp dengan relasi ke absensi dan siswa
        // Group by kelas
        $logsByKelas = LogWhatsapp::select(
            'siswas.kelas',
            DB::raw('COUNT(*) as total'),
            DB::raw("SUM(CASE WHEN log_whatsapps.status_kirim = 'berhasil' THEN 1 ELSE 0 END) as berhasil"),
            DB::raw("SUM(CASE WHEN log_whatsapps.status_kirim = 'gagal' THEN 1 ELSE 0 END) as gagal"),
            DB::raw("SUM(CASE WHEN log_whatsapps.status_kirim = 'pending' THEN 1 ELSE 0 END) as pending")
        )
        ->join('absensis', 'log_whatsapps.id_absensi', '=', 'absensis.id_absensi')
        ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
        ->groupBy('siswas.kelas')
        ->orderBy('siswas.kelas')
        ->get();

        return Inertia::render('admin/whatsapp/index', [
            'logsByKelas' => $logsByKelas,
        ]);
    }

    /**
     * Menampilkan detail WhatsApp berdasarkan kelas
     */
    public function showByKelas(Request $request, $kelas)
    {
        $statusFilter = $request->query('status', 'all');

        $query = LogWhatsapp::select(
            'log_whatsapps.*',
            'siswas.nama_siswa',
            'siswas.nis',
            'siswas.kelas',
            'absensis.mapel',
            'absensis.jam_ke',
            'absensis.tanggal',
            'absensis.status_kehadiran'
        )
        ->join('absensis', 'log_whatsapps.id_absensi', '=', 'absensis.id_absensi')
        ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
        ->where('siswas.kelas', $kelas);

        if ($statusFilter !== 'all') {
            $query->where('log_whatsapps.status_kirim', $statusFilter);
        }

        $logs = $query->orderBy('log_whatsapps.created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/whatsapp/show', [
            'logs' => $logs,
            'kelas' => $kelas,
            'statusFilter' => $statusFilter,
        ]);
    }
}
