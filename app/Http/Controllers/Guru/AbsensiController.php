<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\LogWhatsapp; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http; 

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->input('tanggal', now()->format('Y-m-d'));
        $idGuru = auth()->user()->guru->id_guru ?? null;

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
                        'jenis_kelamin' => $siswa->jenis_kelamin,
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

    /**
     * STORE: Simpan Absensi & LANGSUNG KIRIM WA
     */
    // ... imports sama seperti sebelumnya ...
 

// ... method index dan create sama ...

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

        $idGuru = Auth::user()->guru->id_guru ?? null;
        if (!$idGuru) return redirect()->back()->with('error', 'Profil Guru tidak ditemukan.');

        $tokenFonnte = env('TOKEN_FONNTE'); 

        DB::beginTransaction();

        try {
            foreach ($request->absensi as $item) {
                // 1. SIMPAN KE DATABASE (Tetap simpan semua status, termasuk Hadir)
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

                // 2. FILTER PENGIRIMAN WA (STRATEGI ANTI-BANNED)
                // Hanya kirim jika status BUKAN 'hadir'. 
                // Jika hadir, skip WA. Ini menghemat kuota dan mencegah spam.
                if ($item['status_kehadiran'] !== 'hadir') {
                    
                    $siswa = Siswa::find($item['id_siswa']);

                    if ($siswa && !empty($siswa->no_hp_ortu)) {
                        
                        $emoji = match($item['status_kehadiran']) {
                            'sakit' => '💊',
                            'izin'  => '📝',
                            'alpha' => '❌', // Merah untuk alpha
                            default => 'ℹ️'
                        };

                        // Buat pesan sedikit variatif (tambahkan jam input) agar tidak terdeteksi spam persis
                        $waktu = now()->format('H:i:s');
                        $pesan = "*PEMBERITAHUAN SEKOLAH*\n\n" .
                                 "Yth. Wali Murid,\n" .
                                 "Siswa a.n: *{$siswa->nama_siswa}*\n" .
                                 "Kelas: {$request->kelas}\n" .
                                 "Status Hari Ini: *".strtoupper($item['status_kehadiran'])."* {$emoji}\n\n" .
                                 "Mohon konfirmasinya jika ada kesalahan.\n" .
                                 "_Waktu lapor: {$waktu}_";

                        try {
                            $response = Http::withHeaders([
                                'Authorization' => $tokenFonnte,
                            ])->post('https://api.fonnte.com/send', [
                                'target' => $siswa->no_hp_ortu,
                                'message' => $pesan,
                                // 'delay' => '2', // Fonnte punya fitur delay bawaan, bisa dimanfaatkan
                            ]);

                        } catch (\Exception $waError) {
                            // Silent fail agar absensi tetap tersimpan
                        }
                        
                        // JEDA RANDOM (PENTING)
                        // Jeda antara 2 sampai 5 detik agar tidak terlihat seperti robot
                        sleep(rand(2, 5)); 
                    }
                }
            }

            DB::commit();
            return redirect()->route('guru.absensi.index')->with('success', 'Absensi disimpan. Notifikasi dikirim hanya kepada siswa yang TIDAK HADIR.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal: ' . $e->getMessage());
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
}