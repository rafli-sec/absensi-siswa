<?php

namespace App\Http\Controllers;

use App\Models\LaporanOrtu;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PublicController extends Controller
{
    // 1. Tampilkan Halaman Utama
    public function index()
    {
        return Inertia::render('Welcome');
    }

    // 2. API untuk mengambil daftar siswa secara dinamis saat Ortu pilih Kelas
    public function getSiswaByKelas($kelas)
    {
        $siswas = Siswa::where('kelas', $kelas)
                       ->where('status', 'aktif')
                       ->orderBy('nama_siswa', 'asc')
                       ->get(['id_siswa', 'nama_siswa']);
                       
        return response()->json($siswas);
    }

    // 3. Simpan data laporan
    public function storeLaporan(Request $request)
    {
        // Ubah otomatis nomor HP awalan 0 menjadi 62
        $no_hp = $request->no_hp_pengirim;
        if (str_starts_with($no_hp, '0')) {
            $request->merge([
                'no_hp_pengirim' => '62' . substr($no_hp, 1)
            ]);
        }

        $request->validate([
            'id_siswa'       => 'required|exists:siswas,id_siswa',
            'nama_pengirim'  => 'required|string|max:100',
            'no_hp_pengirim' => 'required|string|max:15',
            'tanggal_izin'   => 'required|date',
            'jenis_laporan'  => 'required|in:sakit,izin,pengaduan',
            'pesan'          => 'required|string|max:500',
        ]);

        LaporanOrtu::create($request->all());

        return redirect()->back()->with('success', 'Laporan berhasil dikirim ke pihak sekolah. Terima kasih.');
    }
}