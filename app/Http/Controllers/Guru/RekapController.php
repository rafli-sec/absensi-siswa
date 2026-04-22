<?php

namespace App\Http\Controllers\Guru; 

use App\Http\Controllers\Controller; 
use App\Models\Absensi;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class RekapController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $idGuru = $user->guru->id_guru ?? null;

        $type = $request->input('type', 'kelas');

        $bulan = $request->input('bulan');
        $tanggal_mulai = $request->input('tanggal_mulai');
        $tanggal_akhir = $request->input('tanggal_akhir');
        $kelas = $request->input('kelas');
        $mapel = $request->input('mapel');
        $jam_ke = $request->input('jam_ke');

        $kelasOptions = DB::table('siswas')->select('kelas')->distinct()->pluck('kelas');

        if (!$idGuru) {
            return Inertia::render('guru/rekap/index', [
                'rekapAbsensi' => [],
                'filters' => $request->all(),
                'kelasOptions' => $kelasOptions,
                'type' => $type
            ]);
        }

        $query = Absensi::with('siswa')->where('id_guru', $idGuru);

        if ($kelas) {
            $query->whereHas('siswa', fn($q) => $q->where('kelas', $kelas));
        }
        if ($mapel) {
            $query->where('mapel', $mapel);
        }

        // =========================
        // MODE 1: KELAS
        // =========================
        if ($type === 'kelas') {
    if ($bulan) $query->whereMonth('tanggal', $bulan);
    if ($jam_ke) $query->where('jam_ke', $jam_ke);

    $allAbsensi = $query->get();

    $rekapAbsensi = $allAbsensi->groupBy(function ($item) {
        return $item->siswa->kelas . '||' . $item->mapel . '||' . $item->jam_ke;
    })->map(function ($group) {
        $first = $group->first();
        $kelas = $first->siswa->kelas;

        // Ambil semua tanggal unik dari group ini
        $tanggalPertemuan = $group->pluck('tanggal')->unique()->sort()->values();

        // Build detail_semua dengan statusByDate
        $daftarSiswa = Siswa::where('kelas', $kelas)->orderBy('nama_siswa')->get();
        $absensiByStudent = $group->groupBy('id_siswa');

        $detail_semua = $daftarSiswa->map(function ($siswa) use ($absensiByStudent) {
            $statusByDate = [];
            $riwayat = $absensiByStudent->get($siswa->id_siswa) ?? collect();
            foreach ($riwayat as $record) {
                $statusByDate[$record->tanggal] = $record->status_kehadiran;
            }
            return [
                'siswa' => $siswa,
                'statusByDate' => $statusByDate,
                'nis' => $siswa->nis ?? '-',
            ];
        });

        return [
            'kelas'            => $kelas,
            'mapel'            => $first->mapel,
            'jam_ke'           => $first->jam_ke,
            'total_siswa'      => Siswa::where('kelas', $kelas)->count(),
            'hadir'            => $group->where('status_kehadiran', 'hadir')->count(),
            'izin'             => $group->where('status_kehadiran', 'izin')->count(),
            'sakit'            => $group->where('status_kehadiran', 'sakit')->count(),
            'alpha'            => $group->where('status_kehadiran', 'alpha')->count(),
            'tanggalPertemuan' => $tanggalPertemuan, // ✅ WAJIB ADA
            'detail_semua'     => $detail_semua,     // ✅ Sudah ada statusByDate
        ];
    })->values();
}

        // =========================
        // MODE 2: MAPEL
        // =========================
        elseif ($type === 'mapel') {
            if ($bulan) $query->whereMonth('tanggal', $bulan);

            $rekapAbsensi = $query->get()->groupBy('mapel')->map(function ($group, $mapel) {
                return [
                    'mapel' => $mapel,
                    'total_pertemuan' => $group->count(),
                    'hadir' => $group->where('status_kehadiran', 'hadir')->count(),
                    'izin' => $group->where('status_kehadiran', 'izin')->count(),
                    'sakit' => $group->where('status_kehadiran', 'sakit')->count(),
                    'alpha' => $group->where('status_kehadiran', 'alpha')->count(),
                    'detail_semua' => $group->values() // ✅ Tambahan Baru
                ];
            })->values();
        }

        // =========================
        // MODE 3: SISWA
        // =========================
        else {
            if ($tanggal_mulai && $tanggal_akhir) {
                $query->whereBetween('tanggal', [$tanggal_mulai, $tanggal_akhir]);
            }

            $rekapAbsensi = $query->get()->groupBy('id_siswa')->map(function ($group) {
                $siswa = $group->first()->siswa;

                return [
                    'nama_siswa' => $siswa->nama_siswa,
                    'kelas' => $siswa->kelas,
                    'hadir' => $group->where('status_kehadiran', 'hadir')->count(),
                    'izin' => $group->where('status_kehadiran', 'izin')->count(),
                    'sakit' => $group->where('status_kehadiran', 'sakit')->count(),
                    'alpha' => $group->where('status_kehadiran', 'alpha')->count(),
                    'total' => $group->count(),
                    'detail_semua' => $group->values() // ✅ Tambahan Baru
                ];
            })->values();
        }

        return Inertia::render('guru/rekap/index', [
            'rekapAbsensi' => $rekapAbsensi,
            'filters' => $request->all(),
            'kelasOptions' => $kelasOptions,
            'type' => $type
        ]);
    }

    public function exportDetailPDF(Request $request)
{
    $kelas = $request->kelas;
    $mapel = $request->mapel;
    // Tangkap parameter bulan dari React
    $bulanFilter = $request->bulan; 
    
    $user = auth()->user();
    if (!$user || !$user->guru) {
        abort(403, 'Akses ditolak: Data Guru tidak ditemukan.');
    }
    $idGuru = $user->guru->id_guru;

    $daftarSiswa = Siswa::where('kelas', $kelas)->orderBy('nama_siswa', 'asc')->get();

    $absensi = Absensi::where('id_guru', $idGuru)
                ->where('mapel', $mapel)
                ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                ->when($bulanFilter, fn($q) => $q->whereMonth('tanggal', $bulanFilter)) // Filter bulan jika ada
                ->get()
                ->groupBy('id_siswa');

    $tanggalPertemuan = Absensi::where('id_guru', $idGuru)
                        ->where('mapel', $mapel)
                        ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                        ->when($bulanFilter, fn($q) => $q->whereMonth('tanggal', $bulanFilter)) // Filter bulan jika ada
                        ->distinct()
                        ->orderBy('tanggal', 'asc')
                        ->pluck('tanggal');

    // --- LOGIKA MENENTUKAN NAMA BULAN ---
    $namaBulan = 'Semua Bulan / Semester';
    if ($bulanFilter) {
        $bulanArray = [
            '01' => 'Januari', '02' => 'Februari', '03' => 'Maret', '04' => 'April', 
            '05' => 'Mei', '06' => 'Juni', '07' => 'Juli', '08' => 'Agustus', 
            '09' => 'September', '10' => 'Oktober', '11' => 'November', '12' => 'Desember'
        ];
        $namaBulan = $bulanArray[$bulanFilter] ?? 'Semua Bulan';
    } elseif ($tanggalPertemuan->isNotEmpty()) {
        // Jika tidak difilter, ambil bulan dari pertemuan pertama
        $namaBulan = \Carbon\Carbon::parse($tanggalPertemuan->first())->translatedFormat('F Y');
    }

    $data = [
        'title' => 'Rekap Absensi Kehadiran Siswa',
        'tahun_ajaran' => '2025/2026', 
        'semester' => 'Genap',
        'kelas' => $kelas,
        'mapel' => $mapel,
        'dosen' => $user->name ?? 'Guru Pengajar',
        'bulan_cetak' => $namaBulan, 
        'daftarSiswa' => $daftarSiswa,
        'absensi' => $absensi,
        'tanggalPertemuan' => $tanggalPertemuan
    ];

    $pdf = Pdf::loadView('pdf.rekap_matriks', $data)->setPaper('a4', 'landscape');
    $filename = "Rekap_Absensi_" . preg_replace('/[^a-zA-Z0-9]/', '_', $kelas . '_' . $mapel) . ".pdf";
    return $pdf->download($filename);
}

public function exportMapelPDF(Request $request)
{
    $mapel = $request->mapel;
    $user = auth()->user();
    $idGuru = $user->guru->id_guru;

    $rekap = Absensi::where('id_guru', $idGuru)
        ->where('mapel', $mapel)
        ->with('siswa')
        ->get()
        ->groupBy(fn($item) => $item->siswa->kelas);

    $data = [
        'title' => 'Rekap Kehadiran Per Mata Pelajaran',
        'mapel' => $mapel,
        'guru' => $user->name,
        'rekap' => $rekap,
        'tanggal' => date('d-m-Y')
    ];

    $pdf = Pdf::loadView('pdf.rekap_mapel', $data)->setPaper('a4', 'portrait');
    return $pdf->download("Rekap_Mapel_" . str_replace(' ', '_', $mapel) . ".pdf");
}

public function exportSiswaPDF(Request $request)
{
    $idSiswa = $request->id_siswa;
    $siswa = Siswa::findOrFail($idSiswa);
    $user = auth()->user();

    $riwayat = Absensi::where('id_siswa', $idSiswa)
        ->where('id_guru', $user->guru->id_guru)
        ->orderBy('tanggal', 'desc')
        ->get();

    $data = [
        'title' => 'Laporan Kehadiran Siswa',
        'siswa' => $siswa,
        'guru' => $user->name,
        'riwayat' => $riwayat,
    ];

    $pdf = Pdf::loadView('pdf.rekap_siswa', $data)->setPaper('a4', 'portrait');
    return $pdf->download("Rekap_Siswa_" . str_replace(' ', '_', $siswa->nama_siswa) . ".pdf");
}

public function detail(Request $request, $type, $identifier)
{
    $user = auth()->user();
    if (!$user || !$user->guru) {
        abort(403, 'Unauthorized');
    }
    $idGuru = $user->guru->id_guru;
    $bulan = $request->input('bulan');

    if ($type === 'kelas') {
        // Parse identifier: "KelasX-MapelY-JamZ"
        $parts = explode('-', $identifier);
        if (count($parts) < 3) abort(400, 'Invalid identifier');
        
        $kelas = $parts[0];
        $mapel = $parts[1];
        $jamKe = $parts[2] ?? null;

        $daftarSiswa = Siswa::where('kelas', $kelas)->orderBy('nama_siswa')->get();
        
        $absensiQuery = Absensi::where('id_guru', $idGuru)
            ->where('mapel', $mapel)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas));
        
        if ($bulan) $absensiQuery->whereMonth('tanggal', $bulan);
        if ($jamKe) $absensiQuery->where('jam_ke', $jamKe);

        $absensi = $absensiQuery->get()->groupBy('id_siswa');
        $tanggalPertemuan = $absensiQuery->distinct()->pluck('tanggal')->sort()->values();

        // Build statusByDate matrix for frontend
        $detail_semua = $daftarSiswa->map(function ($siswa) use ($absensi) {
            $statusByDate = [];
            $riwayat = $absensi->get($siswa->id_siswa) ?? collect();
            
            foreach ($riwayat as $record) {
                $statusByDate[$record->tanggal] = $record->status_kehadiran;
            }
            
            return [
                'siswa' => $siswa,
                'statusByDate' => $statusByDate,
                'status_kehadiran' => $riwayat->first()?->status_kehadiran ?? null,
                'nis' => $siswa->nis ?? '-'
            ];
        });

        // Calculate totals
        $hadir = $absensi->flatten()->where('status_kehadiran', 'hadir')->count();
        $izin = $absensi->flatten()->where('status_kehadiran', 'izin')->count();
        $sakit = $absensi->flatten()->where('status_kehadiran', 'sakit')->count();
        $alpha = $absensi->flatten()->where('status_kehadiran', 'alpha')->count();

        return [
            'kelas' => $kelas,
            'mapel' => $mapel,
            'jam_ke' => $jamKe,
            'bulan' => $bulan,
            'detail_semua' => $detail_semua,
            'tanggalPertemuan' => $tanggalPertemuan,
            'hadir' => $hadir,
            'izin' => $izin,
            'sakit' => $sakit,
            'alpha' => $alpha,
            'total_pertemuan' => $tanggalPertemuan->count()
        ];

    } elseif ($type === 'mapel') {
        $mapel = $identifier;
        $bulan = $request->input('bulan');

        $absensiQuery = Absensi::where('id_guru', $idGuru)->where('mapel', $mapel);
        if ($bulan) $absensiQuery->whereMonth('tanggal', $bulan);
        
        $absensi = $absensiQuery->get();
        
        $hadir = $absensi->where('status_kehadiran', 'hadir')->count();
        $izin = $absensi->where('status_kehadiran', 'izin')->count();
        $sakit = $absensi->where('status_kehadiran', 'sakit')->count();
        $alpha = $absensi->where('status_kehadiran', 'alpha')->count();

        return [
            'mapel' => $mapel,
            'hadir' => $hadir,
            'izin' => $izin,
            'sakit' => $sakit,
            'alpha' => $alpha,
            'total_pertemuan' => $absensi->count()
        ];

    } elseif ($type === 'siswa') {
        $idSiswa = $identifier;
        $bulan = $request->input('bulan');

        $siswa = Siswa::findOrFail($idSiswa);
        $absensiQuery = Absensi::where('id_siswa', $idSiswa)->where('id_guru', $idGuru);
        if ($bulan) $absensiQuery->whereMonth('tanggal', $bulan);
        
        $absensi = $absensiQuery->get();

        $hadir = $absensi->where('status_kehadiran', 'hadir')->count();
        $izin = $absensi->where('status_kehadiran', 'izin')->count();
        $sakit = $absensi->where('status_kehadiran', 'sakit')->count();
        $alpha = $absensi->where('status_kehadiran', 'alpha')->count();

        return [
            'nama_siswa' => $siswa->nama_siswa,
            'kelas' => $siswa->kelas,
            'hadir' => $hadir,
            'izin' => $izin,
            'sakit' => $sakit,
            'alpha' => $alpha,
            'total' => $absensi->count(),
            'riwayat' => $absensi
        ];
    }

    abort(400, 'Invalid type');
}
}
