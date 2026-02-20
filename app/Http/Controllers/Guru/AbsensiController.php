<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\LogWhatsapp;
use App\Jobs\SendWaAbsensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $tanggal = $request->input('tanggal', now()->format('Y-m-d'));
        $idGuru = $user->guru->id_guru ?? null;

        if (!$idGuru) {
            return Inertia::render('guru/absensi/index', [
                'rekapAbsensi' => [],
                'filters' => ['tanggal' => $tanggal],
                'error' => 'Profil guru tidak ditemukan.'
            ]);
        }

        $rekapAbsensi = Absensi::select(
                'siswas.kelas', 
                'absensis.mapel',
                'absensis.jam_ke',
                DB::raw('count(absensis.id_absensi) as total_siswa'),
                DB::raw("SUM(CASE WHEN status_kehadiran = 'hadir' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN status_kehadiran != 'hadir' THEN 1 ELSE 0 END) as tidak_hadir"),
                DB::raw("MAX(absensis.tanggal) as tanggal")
            )
            ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
            ->where('absensis.id_guru', $idGuru) 
            ->where('absensis.tanggal', $tanggal)
            ->groupBy('siswas.kelas', 'absensis.mapel', 'absensis.jam_ke')
            ->orderBy('absensis.jam_ke', 'asc')
            ->get();

        return Inertia::render('guru/absensi/index', [
            'rekapAbsensi' => $rekapAbsensi,
            'filters' => ['tanggal' => $tanggal],
        ]);
    }

    public function create(Request $request)
    {
        $kelas = $request->input('kelas');
        $tanggal = $request->input('tanggal', Carbon::now()->format('Y-m-d'));
        $mapel = $request->input('mapel');
        $jam_ke = $request->input('jam_ke', 1);
        
        $siswas = [];

        if ($kelas) {
            $siswas = Siswa::where('kelas', $kelas)
                ->where('status', 'aktif')
                ->orderBy('nama_siswa')
                ->with(['absensi' => function ($query) use ($tanggal, $mapel, $jam_ke) {
                    $query->where('tanggal', $tanggal)
                          ->where('mapel', $mapel)
                          ->where('jam_ke', $jam_ke);
                }])
                ->get()
                ->map(function ($siswa) {
                    return [
                        'id_siswa' => $siswa->id_siswa,
                        'nis' => $siswa->nis,
                        'nama_siswa' => $siswa->nama_siswa,
                        'status_kehadiran' => $siswa->absensi->first()->status_kehadiran ?? 'hadir', 
                    ];
                });
        }

        return Inertia::render('guru/absensi/create', [
            'siswas' => $siswas,
            'filters' => [
                'kelas' => $kelas,
                'tanggal' => $tanggal,
                'mapel' => $mapel,
                'jam_ke' => $jam_ke,
            ],
            'kelasOptions' => ['7A', '7B', '7C', '8A', '8B', '8C', '9A'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas' => 'required',
            'tanggal' => 'required|date',
            'mapel' => 'required|string|max:50',
            'jam_ke' => 'required|integer|min:1',
            'absensi' => 'required|array|min:1',
            'absensi.*.id_siswa' => 'required|exists:siswas,id_siswa',
            'absensi.*.status_kehadiran' => 'required|in:hadir,izin,sakit,alpha',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $idGuru = $user->guru->id_guru ?? null;
        if (!$idGuru) return redirect()->back()->with('error', 'Profil Guru tidak ditemukan.');

        DB::beginTransaction();

        try {
            foreach ($request->absensi as $item) {
                // 1. Simpan atau Update Absensi ke Database [cite: 4]
                $absensi = Absensi::updateOrCreate(
                    [
                        'id_siswa' => $item['id_siswa'],
                        'tanggal' => $request->tanggal,
                        'mapel' => $request->mapel,
                        'jam_ke' => $request->jam_ke,
                    ],
                    [
                        'id_guru' => $idGuru,
                        'status_kehadiran' => $item['status_kehadiran'],
                        'waktu_input' => now()->toTimeString(),
                    ]
                );

                // 2. Kirim Notifikasi via Queue untuk SEMUA status kehadiran 
                $siswa = Siswa::find($item['id_siswa']);

                if ($siswa && !empty($siswa->no_hp_ortu)) {
                    $emoji = match($item['status_kehadiran']) {
                        'hadir' => '✅',
                        'sakit' => '💊',
                        'izin'  => '📝',
                        'alpha' => '❌',
                        default => 'ℹ️'
                    };

                    $pesan = "*PEMBERITAHUAN ABSENSI SEKOLAH*\n\n" .
                             "Yth. Wali Murid,\n" .
                             "Siswa a.n: *{$siswa->nama_siswa}*\n" .
                             "Kelas: {$request->kelas}\n" .
                             "Mata Pelajaran: {$request->mapel}\n" .
                             "Jam Ke: {$request->jam_ke}\n" .
                             "Status Kehadiran: *".strtoupper($item['status_kehadiran'])."* {$emoji}\n\n" .
                             "Terima kasih atas perhatiannya.";

                    // Simpan Log ke database 
                    $log = LogWhatsapp::create([
                        'id_absensi' => $absensi->id_absensi,
                        'no_tujuan' => $siswa->no_hp_ortu,
                        'pesan' => $pesan,
                        'status_kirim' => 'pending',
                    ]);

                    // Lempar ke Antrean (Queue) 
                    SendWaAbsensi::dispatch($log);
                }
            }

            DB::commit();
            return redirect()->route('guru.absensi.index')->with('success', 'Absensi berhasil disimpan. Seluruh notifikasi sedang dikirim melalui antrean sistem.');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Gagal menyimpan absensi: ' . $e->getMessage());
        }
    }

    public function edit(Request $request, $kelas, $tanggal)
    {
        $mapel = $request->query('mapel');
        $jam_ke = $request->query('jam_ke');

        $siswas = Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->orderBy('nama_siswa')
            ->with(['absensi' => function ($query) use ($tanggal, $mapel, $jam_ke) {
                $query->where('tanggal', $tanggal)
                      ->where('mapel', $mapel)
                      ->where('jam_ke', $jam_ke);
            }])
            ->get()
            ->map(function ($siswa) {
                return [
                    'id_siswa' => $siswa->id_siswa,
                    'nis' => $siswa->nis,
                    'nama_siswa' => $siswa->nama_siswa,
                    'status_kehadiran' => $siswa->absensi->first()->status_kehadiran ?? 'hadir',
                ];
            });

        return Inertia::render('guru/absensi/edit', [
            'siswas' => $siswas,
            'kelas' => $kelas,
            'tanggal' => $tanggal,
            'mapel' => $mapel,
            'jam_ke' => $jam_ke
        ]);
    }
    public function show(Request $request, $kelas, $tanggal)
    {
        $mapel = $request->query('mapel');
        $jam_ke = $request->query('jam_ke');

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $idGuru = $user->guru->id_guru ?? null;

        // Ambil data siswa di kelas tersebut beserta relasi absensi dan log whatsapp-nya
        $detailAbsensi = Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->orderBy('nama_siswa')
            ->with(['absensi' => function ($query) use ($tanggal, $mapel, $jam_ke, $idGuru) {
                $query->where('tanggal', $tanggal)
                      ->where('mapel', $mapel)
                      ->where('jam_ke', $jam_ke)
                      ->where('id_guru', $idGuru) // Pastikan hanya data milik guru ini
                      ->with('logWhatsapp'); // Ambil juga status pengiriman WA
            }])
            ->get()
            ->map(function ($siswa) {
                $absen = $siswa->absensi->first();
                return [
                    'nis' => $siswa->nis,
                    'nama_siswa' => $siswa->nama_siswa,
                    'no_hp_ortu' => $siswa->no_hp_ortu,
                    'status_kehadiran' => $absen ? $absen->status_kehadiran : 'Belum Diabsen',
                    'waktu_input' => $absen ? $absen->waktu_input : '-',
                    // Cek status WA, jika hadir tidak ada WA yang dikirim
                    'status_wa' => $absen && $absen->logWhatsapp 
                                    ? $absen->logWhatsapp->status_kirim 
                                    : ($absen && $absen->status_kehadiran == 'hadir' ? 'Tidak Perlu WA' : 'N/A')
                ];
            });

        return Inertia::render('guru/absensi/show', [
            'detailAbsensi' => $detailAbsensi,
            'infoSesi' => [
                'kelas' => $kelas,
                'tanggal' => $tanggal,
                'mapel' => $mapel,
                'jam_ke' => $jam_ke
            ]
        ]);
    }
}