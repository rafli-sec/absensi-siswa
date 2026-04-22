<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class RekapController extends Controller
{
    /**
     * Tampilan utama rekap dengan filter
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru ?? null;

        // Ambil filter dari request
        $type = $request->input('type', 'kelas'); // kelas, mapel, siswa
        $semester = $request->input('semester');
        $kelas = $request->input('kelas');
        $mapel = $request->input('mapel');
        $idSiswa = $request->input('id_siswa');
        $tahunAjaran = $request->input('tahun_ajaran', config('app.tahun_ajaran', '2024/2025'));

        // Data untuk dropdown filter
        $kelasOptions = Siswa::where('status', 'aktif')
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas', 'asc')
            ->pluck('kelas');

        $mapelOptions = $idGuru ? Absensi::where('id_guru', $idGuru)
            ->select('mapel')
            ->distinct()
            ->pluck('mapel') : [];

        $siswaOptions = $kelas ? Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->orderBy('nama_siswa')
            ->get(['id_siswa', 'nis', 'nama_siswa']) : collect();

        // Validasi minimal filter
        if (!$idGuru || !$semester || !$kelas) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [],
                'filters' => $request->all(),
                'kelasOptions' => $kelasOptions,
                'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions,
                'type' => $type,
                'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        // Validasi tambahan untuk type tertentu
        if ($type === 'mapel' && !$mapel) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [],
                'filters' => $request->all(),
                'kelasOptions' => $kelasOptions,
                'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions,
                'type' => $type,
                'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        if ($type === 'siswa' && !$idSiswa) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [],
                'filters' => $request->all(),
                'kelasOptions' => $kelasOptions,
                'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions,
                'type' => $type,
                'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        // Rentang bulan berdasarkan semester
        $rentangBulan = $semester === 'ganjil' 
            ? [7, 8, 9, 10, 11, 12] 
            : [1, 2, 3, 4, 5, 6];

        // Panggil method sesuai type
        $rekapData = match ($type) {
            'mapel' => $this->getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran),
            'siswa' => $this->getRekapPerSiswa($idSiswa, $idGuru, $rentangBulan, $tahunAjaran),
            default => $this->getRekapPerKelas($idGuru, $kelas, $rentangBulan, $tahunAjaran),
        };

        return Inertia::render('guru/rekap/index', [
            'rekapData' => $rekapData,
            'filters' => $request->all(),
            'kelasOptions' => $kelasOptions,
            'mapelOptions' => $mapelOptions,
            'siswaOptions' => $siswaOptions,
            'type' => $type,
            'selectedSiswa' => $idSiswa ? Siswa::find($idSiswa) : null,
            'tahun_ajaran' => $tahunAjaran,
        ]);
    }

    /**
     * REKAP PER KELAS
     * Semua siswa, semua mapel dalam satu kelas
     */
    private function getRekapPerKelas($idGuru, $kelas, $rentangBulan, $tahunAjaran)
    {
        // Ambil semua siswa di kelas
        $daftarSiswa = Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->orderBy('nama_siswa')
            ->get();

        // Ambil semua absensi guru ini di kelas tersebut
        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
            ->get();

        // Ambil daftar mapel unik
        $daftarMapel = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        // Hitung total pertemuan per mapel
        $totalPertemuanPerMapel = [];
        foreach ($daftarMapel as $m) {
            $totalPertemuanPerMapel[$m] = $semuaAbsensi
                ->where('mapel', $m)
                ->groupBy('tanggal')
                ->count();
        }

        // Rekap per siswa (total semua mapel)
        $rekapSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $daftarMapel, $totalPertemuanPerMapel) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            
            $totalHadir = 0;
            $totalSakit = 0;
            $totalIzin = 0;
            $totalAlpha = 0;
            $totalPertemuanSemuaMapel = 0;
            
            $perMapel = [];
            
            foreach ($daftarMapel as $mapel) {
                $absMapel = $absSiswa->where('mapel', $mapel);
                $totalPertemuan = $totalPertemuanPerMapel[$mapel];
                
                $hadir = $absMapel->where('status_kehadiran', 'hadir')->count();
                $sakit = $absMapel->where('status_kehadiran', 'sakit')->count();
                $izin = $absMapel->where('status_kehadiran', 'izin')->count();
                $alpha = $absMapel->where('status_kehadiran', 'alpha')->count();
                
                $totalHadir += $hadir;
                $totalSakit += $sakit;
                $totalIzin += $izin;
                $totalAlpha += $alpha;
                $totalPertemuanSemuaMapel += $totalPertemuan;
                
                $persentase = $totalPertemuan > 0 
                    ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) 
                    : 0;
                
                $perMapel[] = [
                    'mapel' => $mapel,
                    'hadir' => $hadir,
                    'sakit' => $sakit,
                    'izin' => $izin,
                    'alpha' => $alpha,
                    'total_pertemuan' => $totalPertemuan,
                    'persentase' => $persentase,
                ];
            }
            
            $totalKehadiran = $totalHadir + $totalSakit + $totalIzin + $totalAlpha;
            $persentaseTotal = $totalPertemuanSemuaMapel > 0 
                ? round(($totalKehadiran / $totalPertemuanSemuaMapel) * 100) 
                : 0;
            
            return [
                'id_siswa' => $siswa->id_siswa,
                'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa,
                'jenis_kelamin' => $siswa->jenis_kelamin,
                'total_hadir' => $totalHadir,
                'total_sakit' => $totalSakit,
                'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha,
                'persentase' => $persentaseTotal,
                'per_mapel' => $perMapel,
            ];
        });

        // Daftar tanggal pertemuan unik (semua mapel)
        $tanggalPertemuan = $semuaAbsensi->pluck('tanggal')->unique()->sort()->values();
        $totalPertemuan = $tanggalPertemuan->count();

        // Rekap per siswa dengan status per tanggal
        $detailSemua = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $tanggalPertemuan) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            
            $statusByDate = [];
            $totalHadir = 0;
            $totalSakit = 0;
            $totalIzin = 0;
            $totalAlpha = 0;
            
            foreach ($tanggalPertemuan as $tgl) {
                $abs = $absSiswa->firstWhere('tanggal', $tgl);
                $status = $abs ? $abs->status_kehadiran : '-';
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $status;
                
                // Hitung total per status
                if ($status === 'hadir') $totalHadir++;
                elseif ($status === 'sakit') $totalSakit++;
                elseif ($status === 'izin') $totalIzin++;
                elseif ($status === 'alpha') $totalAlpha++;
            }
            
            return [
                'siswa' => [
                    'id_siswa' => $siswa->id_siswa,
                    'nis' => $siswa->nis,
                    'nama_siswa' => $siswa->nama_siswa,
                    'jenis_kelamin' => $siswa->jenis_kelamin,
                ],
                'statusByDate' => $statusByDate,
                'total_hadir' => $totalHadir,
                'total_sakit' => $totalSakit,
                'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha,
                'total_pertemuan' => $tanggalPertemuan->count(),
            ];
        });

        // Statistik kelas
        $totalHadir = $rekapSiswa->sum('total_hadir');
        $totalSakit = $rekapSiswa->sum('total_sakit');
        $totalIzin = $rekapSiswa->sum('total_izin');
        $totalAlpha = $rekapSiswa->sum('total_alpha');

        // Hitung rata-rata kelas
        $rataKelas = $rekapSiswa->avg('persentase');

        // Siswa terbaik (3 teratas)
        $siswaTerbaik = $rekapSiswa->sortByDesc('persentase')->take(3)->values();

        // Siswa bermasalah (< 70%)
        $siswaBermasalah = $rekapSiswa->filter(fn($s) => $s['persentase'] < 70)->values();

        return [
            [
                'type' => 'kelas',
                'kelas' => $kelas,
                'mapel' => 'Semua Mapel',
                'tahun_ajaran' => $tahunAjaran,
                'total_pertemuan' => $totalPertemuan,
                'tanggalPertemuan' => $tanggalPertemuan,
                'detail_semua' => $detailSemua,
                'hadir' => $totalHadir,
                'sakit' => $totalSakit,
                'izin' => $totalIzin,
                'alpha' => $totalAlpha,
                'statistik' => [
                    'total_siswa' => $daftarSiswa->count(),
                    'rata_rata_kelas' => round($rataKelas, 1),
                    'siswa_terbaik' => $siswaTerbaik,
                    'siswa_bermasalah' => $siswaBermasalah,
                ],
            ]
        ];
    }

    /**
     * REKAP PER MAPEL
     * 1 mapel, semua siswa dalam satu kelas
     */
    public function getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran)
    {
        if (!$mapel) {
            return null;
        }

        // Ambil semua siswa di kelas
        $daftarSiswa = Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->orderBy('nama_siswa')
            ->get();

        // Ambil semua absensi untuk mapel ini
        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->where('mapel', $mapel)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
            ->get();

        // Daftar tanggal pertemuan unik
        $tanggalPertemuan = $semuaAbsensi->pluck('tanggal')->unique()->sort()->values();
        $totalPertemuan = $tanggalPertemuan->count();

        // Rekap per siswa
        $rekapSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $totalPertemuan, $tanggalPertemuan) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            
            $hadir = $absSiswa->where('status_kehadiran', 'hadir')->count();
            $sakit = $absSiswa->where('status_kehadiran', 'sakit')->count();
            $izin = $absSiswa->where('status_kehadiran', 'izin')->count();
            $alpha = $absSiswa->where('status_kehadiran', 'alpha')->count();
            
            $persentase = $totalPertemuan > 0 
                ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) 
                : 0;
            
            // Status per tanggal
            $statusByDate = [];
            foreach ($tanggalPertemuan as $tgl) {
                $abs = $absSiswa->firstWhere('tanggal', $tgl);
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $abs ? $abs->status_kehadiran : '-';
            }
            
            return [
                'id_siswa' => $siswa->id_siswa,
                'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa,
                'jenis_kelamin' => $siswa->jenis_kelamin,
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alpha' => $alpha,
                'persentase' => $persentase,
                'status_by_date' => $statusByDate,
            ];
        });

        // Statistik
        $rataKelas = $rekapSiswa->avg('persentase');
        $siswaTerbaik = $rekapSiswa->sortByDesc('persentase')->take(3)->values();
        $siswaBermasalah = $rekapSiswa->filter(fn($s) => $s['persentase'] < 70)->values();

        // Distribusi predikat
        $predikat = [
            'sangat_baik' => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 90)->count(),
            'baik' => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 75 && $s['persentase'] < 90)->count(),
            'cukup' => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 60 && $s['persentase'] < 75)->count(),
            'kurang' => $rekapSiswa->filter(fn($s) => $s['persentase'] < 60)->count(),
        ];

        return [
            'type' => 'mapel',
            'kelas' => $kelas,
            'mapel' => $mapel,
            'tahun_ajaran' => $tahunAjaran,
            'total_pertemuan' => $totalPertemuan,
            'tanggal_pertemuan' => $tanggalPertemuan,
            'rekap_siswa' => $rekapSiswa,
            'statistik' => [
                'rata_rata_kelas' => round($rataKelas, 1),
                'siswa_terbaik' => $siswaTerbaik,
                'siswa_bermasalah' => $siswaBermasalah,
                'predikat' => $predikat,
            ],
        ];
    }

    /**
     * REKAP PER SISWA
     * 1 siswa, semua mapel dalam satu semester
     */
    private function getRekapPerSiswa($idSiswa, $idGuru, $rentangBulan, $tahunAjaran)
    {
        if (!$idSiswa) {
            return null;
        }

        $siswa = Siswa::findOrFail($idSiswa);

        // Ambil semua absensi siswa ini
        $semuaAbsensi = Absensi::where('id_siswa', $idSiswa)
            ->where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->get();

        if ($semuaAbsensi->isEmpty()) {
            return [
                'type' => 'siswa',
                'siswa' => $siswa,
                'tahun_ajaran' => $tahunAjaran,
                'total_hadir' => 0,
                'total_sakit' => 0,
                'total_izin' => 0,
                'total_alpha' => 0,
                'persentase' => 0,
                'predikat' => $this->getPredikat(0),
                'rekap_mapel' => [],
            ];
        }

        // Kelas siswa
        $kelas = $siswa->kelas;

        // Daftar mapel unik
        $daftarMapel = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        // Hitung total pertemuan per mapel
        $totalPertemuanPerMapel = [];
        foreach ($daftarMapel as $mapel) {
            $totalPertemuanPerMapel[$mapel] = Absensi::where('id_guru', $idGuru)
                ->where('mapel', $mapel)
                ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
                ->groupBy('tanggal')
                ->count();
        }

        // Rekap per mapel
        $rekapMapel = [];
        $totalHadirSemua = 0;
        $totalSakitSemua = 0;
        $totalIzinSemua = 0;
        $totalAlphaSemua = 0;
        $totalPertemuanSemua = 0;

        foreach ($daftarMapel as $mapel) {
            $absMapel = $semuaAbsensi->where('mapel', $mapel);
            $totalPertemuan = $totalPertemuanPerMapel[$mapel];
            
            $hadir = $absMapel->where('status_kehadiran', 'hadir')->count();
            $sakit = $absMapel->where('status_kehadiran', 'sakit')->count();
            $izin = $absMapel->where('status_kehadiran', 'izin')->count();
            $alpha = $absMapel->where('status_kehadiran', 'alpha')->count();
            
            $totalHadirSemua += $hadir;
            $totalSakitSemua += $sakit;
            $totalIzinSemua += $izin;
            $totalAlphaSemua += $alpha;
            $totalPertemuanSemua += $totalPertemuan;
            
            $persentase = $totalPertemuan > 0 
                ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) 
                : 0;
            
            // Status per tanggal
            $statusByDate = [];
            $tanggalAbsensi = Absensi::where('id_guru', $idGuru)
                ->where('mapel', $mapel)
                ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
                ->groupBy('tanggal')
                ->orderBy('tanggal')
                ->pluck('tanggal');
                
            foreach ($tanggalAbsensi as $tgl) {
                $abs = $absMapel->firstWhere('tanggal', $tgl);
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $abs ? $abs->status_kehadiran : '-';
            }
            
            $rekapMapel[] = [
                'mapel' => $mapel,
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alpha' => $alpha,
                'persentase' => $persentase,
                'total_pertemuan' => $totalPertemuan,
                'status_by_date' => $statusByDate,
            ];
        }

        // Total keseluruhan
        $totalKehadiran = $totalHadirSemua + $totalSakitSemua + $totalIzinSemua + $totalAlphaSemua;
        $persentaseTotal = $totalPertemuanSemua > 0 
            ? round(($totalKehadiran / $totalPertemuanSemua) * 100) 
            : 0;

        // Predikat
        $predikat = $this->getPredikat($persentaseTotal);

        return [
            'type' => 'siswa',
            'siswa' => [
                'id_siswa' => $siswa->id_siswa,
                'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa,
                'kelas' => $siswa->kelas,
                'jenis_kelamin' => $siswa->jenis_kelamin,
                'no_hp_ortu' => $siswa->no_hp_ortu,
            ],
            'tahun_ajaran' => $tahunAjaran,
            'total_hadir' => $totalHadirSemua,
            'total_sakit' => $totalSakitSemua,
            'total_izin' => $totalIzinSemua,
            'total_alpha' => $totalAlphaSemua,
            'persentase' => $persentaseTotal,
            'predikat' => $predikat,
            'rekap_mapel' => $rekapMapel,
        ];
    }

    /**
     * EXPORT PDF - REKAP PER KELAS
     */
    public function exportKelasPDF(Request $request)
    {
        $kelas = $request->kelas;
        $semester = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');
        
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        
        $rekapData = $this->getRekapPerKelas($idGuru, $kelas, $rentangBulan, $tahunAjaran);
        
        if (!$rekapData) {
            return back()->with('error', 'Data tidak ditemukan');
        }

        $bulanList = $semester === 'ganjil' 
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];

        $pdf = Pdf::loadView('pdf.rekap_kelas', [
            'kelas' => $kelas,
            'semester' => strtoupper($semester),
            'tahun_ajaran' => $tahunAjaran,
            'guru' => $user->name,
            'bulanList' => $bulanList,
            'rekapData' => $rekapData,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("Rekap_Kelas_{$kelas}_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    /**
     * EXPORT PDF - REKAP PER MAPEL
     */
    public function exportMapelPDF(Request $request)
    {
        $kelas = $request->kelas;
        $mapel = $request->mapel;
        $semester = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');
        
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        
        $rekapData = $this->getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran);
        
        if (!$rekapData) {
            return back()->with('error', 'Data tidak ditemukan');
        }

        $bulanList = $semester === 'ganjil' 
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];

        $pdf = Pdf::loadView('pdf.rekap_mapel', [
            'kelas' => $kelas,
            'mapel' => $mapel,
            'semester' => strtoupper($semester),
            'tahun_ajaran' => $tahunAjaran,
            'guru' => $user->name,
            'bulanList' => $bulanList,
            'rekapData' => $rekapData,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("Rekap_Mapel_{$mapel}_{$kelas}_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    /**
     * EXPORT PDF - REKAP PER SISWA
     */
    public function exportSiswaPDF(Request $request)
    {
        $idSiswa = $request->id_siswa;
        $semester = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');
        
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        
        $rekapData = $this->getRekapPerSiswa($idSiswa, $idGuru, $rentangBulan, $tahunAjaran);
        
        if (!$rekapData) {
            return back()->with('error', 'Data tidak ditemukan');
        }

        $bulanList = $semester === 'ganjil' 
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];

        $pdf = Pdf::loadView('pdf.rekap_siswa', [
            'semester' => strtoupper($semester),
            'tahun_ajaran' => $tahunAjaran,
            'guru' => $user->name,
            'bulanList' => $bulanList,
            'rekapData' => $rekapData,
        ])->setPaper('a4', 'landscape');

        $namaSiswa = $rekapData['siswa']['nama_siswa'];
        return $pdf->download("Rekap_Siswa_{$namaSiswa}_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    /**
     * Helper: Dapatkan predikat berdasarkan persentase
     */
    private function getPredikat($persentase)
    {
        if ($persentase >= 90) {
            return ['label' => 'SANGAT BAIK', 'warna' => 'green'];
        } elseif ($persentase >= 75) {
            return ['label' => 'BAIK', 'warna' => 'blue'];
        } elseif ($persentase >= 60) {
            return ['label' => 'CUKUP', 'warna' => 'yellow'];
        } else {
            return ['label' => 'KURANG', 'warna' => 'red'];
        }
    }
}