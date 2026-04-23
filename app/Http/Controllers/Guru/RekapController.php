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

        $type = $request->input('type', 'kelas');
        $semester = $request->input('semester');
        $kelas = $request->input('kelas');
        $mapel = $request->input('mapel');
        $idSiswa = $request->input('id_siswa');
        $tahunAjaran = $request->input('tahun_ajaran', config('app.tahun_ajaran', '2024/2025'));

        $kelasOptions = Siswa::where('status', 'aktif')
            ->select('kelas')->distinct()->orderBy('kelas', 'asc')->pluck('kelas');

        $mapelOptions = $idGuru ? Absensi::where('id_guru', $idGuru)
            ->select('mapel')->distinct()->pluck('mapel') : [];

        $siswaOptions = $kelas ? Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')->orderBy('nama_siswa')
            ->get(['id_siswa', 'nis', 'nama_siswa']) : collect();

        if (!$idGuru || !$semester || !$kelas) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [], 'filters' => $request->all(),
                'kelasOptions' => $kelasOptions, 'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions, 'type' => $type, 'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        if ($type === 'mapel' && !$mapel) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [], 'filters' => $request->all(),
                'kelasOptions' => $kelasOptions, 'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions, 'type' => $type, 'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        if ($type === 'siswa' && !$idSiswa) {
            return Inertia::render('guru/rekap/index', [
                'rekapData' => [], 'filters' => $request->all(),
                'kelasOptions' => $kelasOptions, 'mapelOptions' => $mapelOptions,
                'siswaOptions' => $siswaOptions, 'type' => $type, 'tahun_ajaran' => $tahunAjaran,
            ]);
        }

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];

        $rekapData = match ($type) {
            'mapel' => $this->getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran),
            'siswa' => $this->getRekapPerSiswa($idSiswa, $idGuru, $rentangBulan, $tahunAjaran),
            default => $this->getRekapPerKelas($idGuru, $kelas, $rentangBulan, $tahunAjaran),
        };

        return Inertia::render('guru/rekap/index', [
            'rekapData' => $rekapData, 'filters' => $request->all(),
            'kelasOptions' => $kelasOptions, 'mapelOptions' => $mapelOptions,
            'siswaOptions' => $siswaOptions, 'type' => $type,
            'selectedSiswa' => $idSiswa ? Siswa::find($idSiswa) : null,
            'tahun_ajaran' => $tahunAjaran,
        ]);
    }

    /**
     * REKAP PER KELAS - Semua siswa, semua mapel
     */
    private function getRekapPerKelas($idGuru, $kelas, $rentangBulan, $tahunAjaran)
    {
        $daftarSiswa = Siswa::where('kelas', $kelas)->where('status', 'aktif')
            ->orderBy('nama_siswa')->get();

        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
            ->get();

        $daftarMapel = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        $totalPertemuanPerMapel = [];
        foreach ($daftarMapel as $m) {
            $totalPertemuanPerMapel[$m] = $semuaAbsensi->where('mapel', $m)->groupBy('tanggal')->count();
        }

        $rekapSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $daftarMapel, $totalPertemuanPerMapel) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            $totalHadir = $totalSakit = $totalIzin = $totalAlpha = $totalPertemuanSemuaMapel = 0;
            $perMapel = [];

            foreach ($daftarMapel as $mapel) {
                $absMapel = $absSiswa->where('mapel', $mapel);
                $totalPertemuan = $totalPertemuanPerMapel[$mapel];
                $hadir = $absMapel->where('status_kehadiran', 'hadir')->count();
                $sakit = $absMapel->where('status_kehadiran', 'sakit')->count();
                $izin  = $absMapel->where('status_kehadiran', 'izin')->count();
                $alpha = $absMapel->where('status_kehadiran', 'alpha')->count();

                $totalHadir += $hadir; $totalSakit += $sakit;
                $totalIzin  += $izin;  $totalAlpha += $alpha;
                $totalPertemuanSemuaMapel += $totalPertemuan;

                $persentase = $totalPertemuan > 0
                    ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) : 0;

                $perMapel[] = ['mapel' => $mapel, 'hadir' => $hadir, 'sakit' => $sakit,
                    'izin' => $izin, 'alpha' => $alpha, 'total_pertemuan' => $totalPertemuan, 'persentase' => $persentase];
            }

            $totalKehadiran = $totalHadir + $totalSakit + $totalIzin + $totalAlpha;
            $persentaseTotal = $totalPertemuanSemuaMapel > 0
                ? round(($totalKehadiran / $totalPertemuanSemuaMapel) * 100) : 0;

            return ['id_siswa' => $siswa->id_siswa, 'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa, 'jenis_kelamin' => $siswa->jenis_kelamin,
                'total_hadir' => $totalHadir, 'total_sakit' => $totalSakit,
                'total_izin' => $totalIzin, 'total_alpha' => $totalAlpha,
                'persentase' => $persentaseTotal, 'per_mapel' => $perMapel];
        });

        $tanggalPertemuan = $semuaAbsensi->pluck('tanggal')->unique()->sort()->values();
        $totalPertemuan = $tanggalPertemuan->count();

        $detailSemua = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $tanggalPertemuan) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            $statusByDate = [];
            $totalHadir = $totalSakit = $totalIzin = $totalAlpha = 0;

            foreach ($tanggalPertemuan as $tgl) {
                $abs = $absSiswa->firstWhere('tanggal', $tgl);
                $status = $abs ? $abs->status_kehadiran : '-';
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $status;
                if ($status === 'hadir') $totalHadir++;
                elseif ($status === 'sakit') $totalSakit++;
                elseif ($status === 'izin') $totalIzin++;
                elseif ($status === 'alpha') $totalAlpha++;
            }

            return ['siswa' => ['id_siswa' => $siswa->id_siswa, 'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa, 'jenis_kelamin' => $siswa->jenis_kelamin],
                'statusByDate' => $statusByDate, 'total_hadir' => $totalHadir,
                'total_sakit' => $totalSakit, 'total_izin' => $totalIzin,
                'total_alpha' => $totalAlpha, 'total_pertemuan' => $tanggalPertemuan->count()];
        });

        $totalHadir = $rekapSiswa->sum('total_hadir');
        $totalSakit = $rekapSiswa->sum('total_sakit');
        $totalIzin  = $rekapSiswa->sum('total_izin');
        $totalAlpha = $rekapSiswa->sum('total_alpha');
        $rataKelas = $rekapSiswa->avg('persentase');
        $siswaTerbaik = $rekapSiswa->sortByDesc('persentase')->take(3)->values();
        $siswaBermasalah = $rekapSiswa->filter(fn($s) => $s['persentase'] < 70)->values();

        return [[
            'type' => 'kelas', 'kelas' => $kelas, 'mapel' => 'Semua Mapel',
            'tahun_ajaran' => $tahunAjaran, 'total_pertemuan' => $totalPertemuan,
            'tanggalPertemuan' => $tanggalPertemuan, 'detail_semua' => $detailSemua,
            'hadir' => $totalHadir, 'sakit' => $totalSakit, 'izin' => $totalIzin, 'alpha' => $totalAlpha,
            'statistik' => ['total_siswa' => $daftarSiswa->count(),
                'rata_rata_kelas' => round($rataKelas, 1),
                'siswa_terbaik' => $siswaTerbaik, 'siswa_bermasalah' => $siswaBermasalah],
        ]];
    }

    /**
     * REKAP PER MAPEL - 1 mapel, semua siswa
     */
    public function getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran)
    {
        if (!$mapel) return null;

        $daftarSiswa = Siswa::where('kelas', $kelas)->where('status', 'aktif')
            ->orderBy('nama_siswa')->get();

        $semuaAbsensi = Absensi::where('id_guru', $idGuru)->where('mapel', $mapel)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))->get();

        $tanggalPertemuan = $semuaAbsensi->pluck('tanggal')->unique()->sort()->values();
        $totalPertemuan = $tanggalPertemuan->count();

        $rekapSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $totalPertemuan, $tanggalPertemuan) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            $hadir = $absSiswa->where('status_kehadiran', 'hadir')->count();
            $sakit = $absSiswa->where('status_kehadiran', 'sakit')->count();
            $izin  = $absSiswa->where('status_kehadiran', 'izin')->count();
            $alpha = $absSiswa->where('status_kehadiran', 'alpha')->count();

            $persentase = $totalPertemuan > 0
                ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) : 0;

            $statusByDate = [];
            foreach ($tanggalPertemuan as $tgl) {
                $abs = $absSiswa->firstWhere('tanggal', $tgl);
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $abs ? $abs->status_kehadiran : '-';
            }

            return ['id_siswa' => $siswa->id_siswa, 'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa, 'jenis_kelamin' => $siswa->jenis_kelamin,
                'hadir' => $hadir, 'sakit' => $sakit, 'izin' => $izin, 'alpha' => $alpha,
                'persentase' => $persentase, 'status_by_date' => $statusByDate];
        });

        $rataKelas = $rekapSiswa->avg('persentase');
        $siswaTerbaik = $rekapSiswa->sortByDesc('persentase')->take(3)->values();
        $siswaBermasalah = $rekapSiswa->filter(fn($s) => $s['persentase'] < 70)->values();

        $predikat = [
            'sangat_baik' => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 90)->count(),
            'baik'        => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 75 && $s['persentase'] < 90)->count(),
            'cukup'       => $rekapSiswa->filter(fn($s) => $s['persentase'] >= 60 && $s['persentase'] < 75)->count(),
            'kurang'      => $rekapSiswa->filter(fn($s) => $s['persentase'] < 60)->count(),
        ];

        return ['type' => 'mapel', 'kelas' => $kelas, 'mapel' => $mapel,
            'tahun_ajaran' => $tahunAjaran, 'total_pertemuan' => $totalPertemuan,
            'tanggal_pertemuan' => $tanggalPertemuan, 'rekap_siswa' => $rekapSiswa,
            'statistik' => ['rata_rata_kelas' => round($rataKelas, 1),
                'siswa_terbaik' => $siswaTerbaik, 'siswa_bermasalah' => $siswaBermasalah, 'predikat' => $predikat]];
    }

    /**
     * REKAP PER SISWA - 1 siswa, semua mapel
     */
    private function getRekapPerSiswa($idSiswa, $idGuru, $rentangBulan, $tahunAjaran)
    {
        if (!$idSiswa) return null;

        $siswa = Siswa::findOrFail($idSiswa);
        $semuaAbsensi = Absensi::where('id_siswa', $idSiswa)->where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)->get();

        if ($semuaAbsensi->isEmpty()) {
            return ['type' => 'siswa', 'siswa' => $siswa, 'tahun_ajaran' => $tahunAjaran,
                'total_hadir' => 0, 'total_sakit' => 0, 'total_izin' => 0, 'total_alpha' => 0,
                'persentase' => 0, 'predikat' => $this->getPredikat(0), 'rekap_mapel' => []];
        }

        $kelas = $siswa->kelas;
        $daftarMapel = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        $totalPertemuanPerMapel = [];
        foreach ($daftarMapel as $mapel) {
            $totalPertemuanPerMapel[$mapel] = Absensi::where('id_guru', $idGuru)->where('mapel', $mapel)
                ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)->groupBy('tanggal')->count();
        }

        $rekapMapel = [];
        $totalHadirSemua = $totalSakitSemua = $totalIzinSemua = $totalAlphaSemua = $totalPertemuanSemua = 0;

        foreach ($daftarMapel as $mapel) {
            $absMapel = $semuaAbsensi->where('mapel', $mapel);
            $totalPertemuan = $totalPertemuanPerMapel[$mapel];
            $hadir = $absMapel->where('status_kehadiran', 'hadir')->count();
            $sakit = $absMapel->where('status_kehadiran', 'sakit')->count();
            $izin  = $absMapel->where('status_kehadiran', 'izin')->count();
            $alpha = $absMapel->where('status_kehadiran', 'alpha')->count();

            $totalHadirSemua += $hadir; $totalSakitSemua += $sakit;
            $totalIzinSemua  += $izin;  $totalAlphaSemua += $alpha;
            $totalPertemuanSemua += $totalPertemuan;

            $persentase = $totalPertemuan > 0
                ? round((($totalPertemuan - ($sakit + $izin + $alpha)) / $totalPertemuan) * 100) : 0;

            $statusByDate = [];
            $tanggalAbsensi = Absensi::where('id_guru', $idGuru)->where('mapel', $mapel)
                ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
                ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
                ->groupBy('tanggal')->orderBy('tanggal')->pluck('tanggal');

            foreach ($tanggalAbsensi as $tgl) {
                $abs = $absMapel->firstWhere('tanggal', $tgl);
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $abs ? $abs->status_kehadiran : '-';
            }

            $rekapMapel[] = ['mapel' => $mapel, 'hadir' => $hadir, 'sakit' => $sakit,
                'izin' => $izin, 'alpha' => $alpha, 'persentase' => $persentase,
                'total_pertemuan' => $totalPertemuan, 'status_by_date' => $statusByDate];
        }

        $totalKehadiran = $totalHadirSemua + $totalSakitSemua + $totalIzinSemua + $totalAlphaSemua;
        $persentaseTotal = $totalPertemuanSemua > 0
            ? round(($totalKehadiran / $totalPertemuanSemua) * 100) : 0;

        return ['type' => 'siswa',
            'siswa' => ['id_siswa' => $siswa->id_siswa, 'nis' => $siswa->nis,
                'nama_siswa' => $siswa->nama_siswa, 'kelas' => $siswa->kelas,
                'jenis_kelamin' => $siswa->jenis_kelamin, 'no_hp_ortu' => $siswa->no_hp_ortu],
            'tahun_ajaran' => $tahunAjaran, 'total_hadir' => $totalHadirSemua,
            'total_sakit' => $totalSakitSemua, 'total_izin' => $totalIzinSemua,
            'total_alpha' => $totalAlphaSemua, 'persentase' => $persentaseTotal,
            'predikat' => $this->getPredikat($persentaseTotal), 'rekap_mapel' => $rekapMapel];
    }

    // =========================================================
    //  EXPORT PDF - REKAP PER KELAS PER BULAN
    // =========================================================
    public function exportKelasBulanPDF(Request $request)
    {
        $kelas      = $request->kelas;
        $bulan      = (int) $request->bulan;
        $semester   = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');

        $user   = auth()->user();
        $guru   = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        // Semua bulan semester, tapi nanti filter per bulan di view
        $rentangBulan = [$bulan];

        // Ambil siswa & absensi
        $daftarSiswa = Siswa::where('kelas', $kelas)->where('status', 'aktif')
            ->orderBy('nama_siswa')->get();

        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))
            ->get();

        // Mapel yang diambil
        $mapelList = $semuaAbsensi->pluck('mapel')->unique()->sort()->values()->first() ?? '-';

        // Tanggal pertemuan di bulan itu
        $tanggalPertemuan = $semuaAbsensi->pluck('tanggal')->unique()->sort()->values();
        $totalPertemuan   = $tanggalPertemuan->count();

        // Semua tanggal dalam bulan (1-31 atau sesuai bulan)
        $jumlahHari = cal_days_in_month(CAL_GREGORIAN, $bulan, (int) explode('/', $tahunAjaran)[0]);
        $semuaHari  = range(1, $jumlahHari);

        // Map tanggal ke hari (untuk kolom)
        $tanggalHariMap = [];
        foreach ($tanggalPertemuan as $tgl) {
            $tanggalHariMap[Carbon::parse($tgl)->day] = Carbon::parse($tgl)->format('Y-m-d');
        }

        // Rekap per siswa dengan status per hari
        $detailSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $tanggalPertemuan, $tanggalHariMap) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            $statusByDate = [];
            $h = $s = $i = $a = 0;

            foreach ($tanggalPertemuan as $tgl) {
                $abs = $absSiswa->firstWhere('tanggal', $tgl);
                $status = $abs ? $abs->status_kehadiran : '-';
                $statusByDate[Carbon::parse($tgl)->format('Y-m-d')] = $status;
                if ($status === 'hadir') $h++;
                elseif ($status === 'sakit') $s++;
                elseif ($status === 'izin') $i++;
                elseif ($status === 'alpha') $a++;
            }

            $total = $h + $s + $i + $a;
            $pct   = $total > 0 ? round(($h / $total) * 100) : 0;

            return ['nis' => $siswa->nis, 'nama_siswa' => $siswa->nama_siswa,
                'jenis_kelamin' => $siswa->jenis_kelamin, 'statusByDate' => $statusByDate,
                'h' => $h, 's' => $s, 'i' => $i, 'a' => $a, 'pct' => $pct];
        });

        $namaBulan = Carbon::create()->month($bulan)->locale('id')->monthName;

        $pdf = Pdf::loadView('pdf.rekap_kelas_bulan', [
            'kelas'          => $kelas,
            'bulan'          => $bulan,
            'nama_bulan'     => ucfirst($namaBulan),
            'semester'       => strtoupper($semester),
            'tahun_ajaran'   => $tahunAjaran,
            'guru'           => $user->name,
            'mapel'          => $mapelList,
            'semuaHari'      => $semuaHari,
            'jumlahHari'     => $jumlahHari,
            'tanggalHariMap' => $tanggalHariMap,
            'detailSiswa'    => $detailSiswa,
            'totalPertemuan' => $totalPertemuan,
        ])->setPaper('a4', 'landscape');

        $tahunAjaranSafe = str_replace('/', '-', $tahunAjaran);
        return $pdf->download("Rekap_Kelas_{$kelas}_{$namaBulan}_{$tahunAjaranSafe}.pdf");
    }

    // =========================================================
    //  EXPORT PDF - REKAP PER KELAS PER SEMESTER
    // =========================================================
    public function exportKelasSemesterPDF(Request $request)
    {
        $kelas       = $request->kelas;
        $semester    = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');

        $user   = auth()->user();
        $guru   = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        $bulanList    = $semester === 'ganjil'
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];

        $daftarSiswa = Siswa::where('kelas', $kelas)->where('status', 'aktif')
            ->orderBy('nama_siswa')->get();

        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))->get();

        $daftarMapelUnik = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        // Rekap per siswa per bulan per mapel
        $detailSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $rentangBulan, $daftarMapelUnik) {
            $absSiswa  = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);
            $perBulan  = [];
            $totalH = $totalS = $totalI = $totalA = $totalPertemuan = 0;

            foreach ($rentangBulan as $bln) {
                $absBulan = $absSiswa->filter(fn($ab) => Carbon::parse($ab->tanggal)->month === $bln);
                $h = $absBulan->where('status_kehadiran', 'hadir')->count();
                $s = $absBulan->where('status_kehadiran', 'sakit')->count();
                $i = $absBulan->where('status_kehadiran', 'izin')->count();
                $a = $absBulan->where('status_kehadiran', 'alpha')->count();
                $tot = $h + $s + $i + $a;

                $totalH += $h; $totalS += $s; $totalI += $i; $totalA += $a;
                $totalPertemuan += $tot;

                $perBulan[$bln] = ['h' => $h, 's' => $s, 'i' => $i, 'a' => $a, 'total' => $tot,
                    'pct' => $tot > 0 ? round(($h / $tot) * 100) : 0];
            }

            $pctTotal = ($totalH + $totalS + $totalI + $totalA) > 0
                ? round(($totalH / ($totalH + $totalS + $totalI + $totalA)) * 100) : 0;

            return ['nis' => $siswa->nis, 'nama_siswa' => $siswa->nama_siswa,
                'jenis_kelamin' => $siswa->jenis_kelamin, 'per_bulan' => $perBulan,
                'total_h' => $totalH, 'total_s' => $totalS, 'total_i' => $totalI,
                'total_a' => $totalA, 'total_pertemuan' => $totalPertemuan, 'pct_total' => $pctTotal];
        });

        $pdf = Pdf::loadView('pdf.rekap_kelas_semester', [
            'kelas'       => $kelas,
            'semester'    => strtoupper($semester),
            'tahun_ajaran'=> $tahunAjaran,
            'guru'        => $user->name,
            'bulanList'   => $bulanList,
            'detailSiswa' => $detailSiswa,
            'rentangBulan'=> $rentangBulan,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("Rekap_Kelas_{$kelas}_Semester_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    // =========================================================
    //  EXPORT PDF - REKAP PER SISWA PER SEMESTER (semua siswa)
    // =========================================================
    public function exportSiswaSemesterPDF(Request $request)
    {
        $kelas       = $request->kelas;
        $semester    = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');
        $idSiswa     = $request->id_siswa;

        $user   = auth()->user();
        $guru   = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;

        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        $bulanList    = $semester === 'ganjil'
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];

        $daftarSiswa = Siswa::where('kelas', $kelas)->where('status', 'aktif')
            ->when($idSiswa, fn($q) => $q->where('id_siswa', $idSiswa))
            ->orderBy('nama_siswa')->get();

        $semuaAbsensi = Absensi::where('id_guru', $idGuru)
            ->whereIn(DB::raw('MONTH(tanggal)'), $rentangBulan)
            ->when($idSiswa, fn($q) => $q->where('id_siswa', $idSiswa))
            ->whereHas('siswa', fn($q) => $q->where('kelas', $kelas))->get();

        $daftarMapel = $semuaAbsensi->pluck('mapel')->unique()->sort()->values();

        // Total pertemuan per mapel
        $totalPertemuanPerMapel = [];
        foreach ($daftarMapel as $m) {
            $totalPertemuanPerMapel[$m] = $semuaAbsensi->where('mapel', $m)->groupBy('tanggal')->count();
        }

        // Rekap per siswa
        $rekapSemuaSiswa = $daftarSiswa->map(function ($siswa) use ($semuaAbsensi, $daftarMapel, $totalPertemuanPerMapel, $rentangBulan) {
            $absSiswa = $semuaAbsensi->where('id_siswa', $siswa->id_siswa);

            $perMapel = [];
            $totalH = $totalS = $totalI = $totalA = $totalPert = 0;

            foreach ($daftarMapel as $mapel) {
                $absMapel = $absSiswa->where('mapel', $mapel);
                $totalPertemuan = $totalPertemuanPerMapel[$mapel];
                $h = $absMapel->where('status_kehadiran', 'hadir')->count();
                $s = $absMapel->where('status_kehadiran', 'sakit')->count();
                $i = $absMapel->where('status_kehadiran', 'izin')->count();
                $a = $absMapel->where('status_kehadiran', 'alpha')->count();

                $totalH += $h; $totalS += $s; $totalI += $i; $totalA += $a;
                $totalPert += $totalPertemuan;

                $persentase = $totalPertemuan > 0
                    ? round((($totalPertemuan - ($s + $i + $a)) / $totalPertemuan) * 100) : 0;

                // Per bulan untuk mapel ini
                $perBulan = [];
                foreach ($rentangBulan as $bln) {
                    $absBulan = $absMapel->filter(fn($ab) => Carbon::parse($ab->tanggal)->month === $bln);
                    $perBulan[$bln] = [
                        'h' => $absBulan->where('status_kehadiran', 'hadir')->count(),
                        's' => $absBulan->where('status_kehadiran', 'sakit')->count(),
                        'i' => $absBulan->where('status_kehadiran', 'izin')->count(),
                        'a' => $absBulan->where('status_kehadiran', 'alpha')->count(),
                    ];
                }

                $perMapel[] = ['mapel' => $mapel, 'h' => $h, 's' => $s, 'i' => $i, 'a' => $a,
                    'total_pertemuan' => $totalPertemuan, 'persentase' => $persentase, 'per_bulan' => $perBulan];
            }

            $allTotal = $totalH + $totalS + $totalI + $totalA;
            $pctTotal = $allTotal > 0 ? round(($totalH / $allTotal) * 100) : 0;

            return ['nis' => $siswa->nis, 'nama_siswa' => $siswa->nama_siswa,
                'kelas' => $siswa->kelas, 'jenis_kelamin' => $siswa->jenis_kelamin,
                'no_hp_ortu' => $siswa->no_hp_ortu,
                'total_h' => $totalH, 'total_s' => $totalS, 'total_i' => $totalI, 'total_a' => $totalA,
                'total_pertemuan' => $totalPert, 'pct_total' => $pctTotal,
                'predikat' => $this->getPredikat($pctTotal),
                'per_mapel' => $perMapel];
        });

        $pdf = Pdf::loadView('pdf.rekap_siswa_semester', [
            'kelas'          => $kelas,
            'semester'       => strtoupper($semester),
            'tahun_ajaran'   => $tahunAjaran,
            'guru'           => $user->name,
            'bulanList'      => $bulanList,
            'rentangBulan'   => $rentangBulan,
            'daftarMapel'    => $daftarMapel,
            'rekapSemuaSiswa'=> $rekapSemuaSiswa,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("Rekap_Siswa_Kelas_{$kelas}_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    // =========================================================
    //  EXPORT LAMA (dipertahankan untuk kompatibilitas)
    // =========================================================
    public function exportKelasPDF(Request $request)
    {
        return $this->exportKelasSemesterPDF($request);
    }

    public function exportMapelPDF(Request $request)
    {
        $kelas = $request->kelas; $mapel = $request->mapel;
        $semester = $request->semester ?? 'ganjil';
        $tahunAjaran = $request->tahun_ajaran ?? config('app.tahun_ajaran', '2024/2025');
        $user = auth()->user();
        $guru = Guru::where('user_id', $user->id)->first();
        $idGuru = $guru->id_guru;
        $rentangBulan = $semester === 'ganjil' ? [7,8,9,10,11,12] : [1,2,3,4,5,6];
        $rekapData = $this->getRekapPerMapel($idGuru, $kelas, $mapel, $rentangBulan, $tahunAjaran);
        if (!$rekapData) return back()->with('error', 'Data tidak ditemukan');
        $bulanList = $semester === 'ganjil'
            ? [7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember']
            : [1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni'];
        $pdf = Pdf::loadView('pdf.rekap_mapel', ['kelas' => $kelas, 'mapel' => $mapel,
            'semester' => strtoupper($semester), 'tahun_ajaran' => $tahunAjaran,
            'guru' => $user->name, 'bulanList' => $bulanList, 'rekapData' => $rekapData,
        ])->setPaper('a4', 'landscape');
        return $pdf->download("Rekap_Mapel_{$mapel}_{$kelas}_" . str_replace('/', '-', $tahunAjaran) . ".pdf");
    }

    public function exportSiswaPDF(Request $request)
    {
        return $this->exportSiswaSemesterPDF($request);
    }

    private function getPredikat($persentase)
    {
        if ($persentase >= 90) return ['label' => 'SANGAT BAIK', 'warna' => 'green'];
        if ($persentase >= 75) return ['label' => 'BAIK', 'warna' => 'blue'];
        if ($persentase >= 60) return ['label' => 'CUKUP', 'warna' => 'yellow'];
        return ['label' => 'KURANG', 'warna' => 'red'];
    }
}