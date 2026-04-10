<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RekapController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $idGuru = $user->guru->id_guru ?? null;

        // Ambil filter dari request, default tanggal hari ini
        $tanggal = $request->input('tanggal', now()->format('Y-m-d'));
        $kelas = $request->input('kelas');
        $mapel = $request->input('mapel');
        $jam_ke = $request->input('jam_ke');

        if (!$idGuru) {
            return Inertia::render('guru/rekap/index', [
                'rekapAbsensi' => [],
                'filters' => ['tanggal' => $tanggal],
                'kelasOptions' => []
            ]);
        }

        // Query dasar: Join tabel absensis dengan siswas untuk mendapatkan 'kelas'
        $query = DB::table('absensis')
            ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
            ->select(
                'siswas.kelas',
                'absensis.mapel',
                'absensis.jam_ke',
                DB::raw('COUNT(absensis.id_siswa) as total_siswa'),
                DB::raw("SUM(CASE WHEN absensis.status_kehadiran = 'hadir' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN absensis.status_kehadiran = 'izin' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN absensis.status_kehadiran = 'sakit' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN absensis.status_kehadiran = 'alpha' THEN 1 ELSE 0 END) as alpha")
            )
            ->where('absensis.id_guru', $idGuru)
            ->whereDate('absensis.tanggal', $tanggal);

        // Tambahkan kondisi filter jika dipilih
        if ($kelas) {
            $query->where('siswas.kelas', $kelas);
        }
        if ($mapel) {
            $query->where('absensis.mapel', $mapel);
        }
        if ($jam_ke) {
            $query->where('absensis.jam_ke', $jam_ke);
        }

        // Kelompokkan data untuk rekapitulasi
        $rekapAbsensi = $query->groupBy('siswas.kelas', 'absensis.mapel', 'absensis.jam_ke')
            ->orderBy('siswas.kelas', 'asc')
            ->orderBy('absensis.jam_ke', 'asc')
            ->get();

        // Ambil daftar kelas unik untuk opsi dropdown filter
        $kelasOptions = DB::table('siswas')->select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        return Inertia::render('guru/rekap/index', [ // Pastikan path ini sesuai struktur folder pages React Anda
            'rekapAbsensi' => $rekapAbsensi,
            'filters' => [
                'tanggal' => $tanggal,
                'kelas' => $kelas ?? '',
                'mapel' => $mapel ?? '',
                'jam_ke' => $jam_ke ?? '',
            ],
            'kelasOptions' => $kelasOptions
        ]);
    }
}