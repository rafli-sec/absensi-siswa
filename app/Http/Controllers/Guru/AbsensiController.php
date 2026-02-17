<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    /**
     * INDEX: Menampilkan riwayat absensi atau rekap harian
     */
    // app/Http/Controllers/Guru/AbsensiController.php

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

    // Mengambil rekap absensi yang HANYA dibuat oleh guru ini
    $rekapAbsensi = Absensi::select('siswas.kelas', 
            DB::raw('count(absensis.id_absensi) as total_siswa'),
            DB::raw("SUM(CASE WHEN status_kehadiran = 'hadir' THEN 1 ELSE 0 END) as hadir"),
            DB::raw("SUM(CASE WHEN status_kehadiran != 'hadir' THEN 1 ELSE 0 END) as tidak_hadir"),
            DB::raw("MAX(absensis.tanggal) as tanggal")
        )
        ->join('siswas', 'absensis.id_siswa', '=', 'siswas.id_siswa')
        ->where('absensis.id_guru', $idGuru) 
        ->where('absensis.tanggal', $tanggal)
        ->groupBy('siswas.kelas')
        ->get();

    return Inertia::render('guru/absensi/index', [
        'rekapAbsensi' => $rekapAbsensi,
        'filters' => [
            'tanggal' => $tanggal,
        ],
    ]);
}
    /**
     * CREATE: Menampilkan form untuk input absensi baru
     */
    public function create(Request $request)
    {
        $kelas = $request->input('kelas');
        $tanggal = $request->input('tanggal', Carbon::now()->format('Y-m-d'));
        
        $siswas = [];

        if ($kelas) {
            // Cek apakah sudah ada absensi untuk kelas ini di tanggal tersebut
            // Jika sudah ada, arahkan ke halaman edit atau beri peringatan
            $siswas = Siswa::where('kelas', $kelas)
                ->where('status', 'aktif')
                ->orderBy('nama_siswa')
                ->with(['absensi' => function ($query) use ($tanggal) {
                    $query->where('tanggal', $tanggal);
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
            ],
            'kelasOptions' => ['7A', '7B', '8A', '8B', '9A', '9B'],
        ]);
    }

    /**
     * STORE: Menyimpan data absensi (Bulk Insert/Update)
     */
    public function store(Request $request)
    {
        $request->validate([
            'kelas' => 'required',
            'tanggal' => 'required|date',
            'absensi' => 'required|array|min:1',
            'absensi.*.id_siswa' => 'required|exists:siswas,id_siswa',
            'absensi.*.status_kehadiran' => 'required|in:hadir,izin,sakit,alpha',
        ]);

        // Proteksi jika data guru tidak ditemukan
        $idGuru = Auth::user()->guru->id_guru ?? null;

        if (!$idGuru) {
            return redirect()->back()->with('error', 'Profil Guru tidak ditemukan. Pastikan akun Anda terhubung dengan data Guru.');
        }

        $tanggal = $request->tanggal;

        try {
            DB::transaction(function () use ($request, $tanggal, $idGuru) {
                foreach ($request->absensi as $data) {
                    Absensi::updateOrCreate(
                        [
                            'id_siswa' => $data['id_siswa'],
                            'tanggal' => $tanggal,
                        ],
                        [
                            'id_guru' => $idGuru,
                            'status_kehadiran' => $data['status_kehadiran'],
                            'waktu_input' => now()->toTimeString(),
                        ]
                    );
                }
            });

            return redirect()->route('guru.absensi.index')->with('success', 'Absensi berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * EDIT: Menampilkan form edit (logikanya sama dengan create karena updateOrCreate)
     * Namun kita buat route spesifik agar rapi secara RESTful
     */
    public function edit($kelas, $tanggal)
    {
        // Logika mengambil data siswa yang sudah diabsen
        $siswas = Siswa::where('kelas', $kelas)
            ->where('status', 'aktif')
            ->with(['absensi' => function ($query) use ($tanggal) {
                $query->where('tanggal', $tanggal);
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
            'tanggal' => $tanggal
        ]);
    }
}