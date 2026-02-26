<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        // Fitur Pencarian & Pagination
        $query = Siswa::query();

        // Tambahkan filter kelas, jenis kelamin, dan status agar sinkron dengan frontend
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama_siswa', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->has('kelas') && $request->kelas != '') {
            $query->where('kelas', $request->kelas);
        }
        if ($request->has('jenis_kelamin') && $request->jenis_kelamin != '') {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        return Inertia::render('admin/siswa/index', [
            'siswas' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'kelas', 'jenis_kelamin', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/siswa/create');
    }

    public function store(Request $request)
    {
        // OTOMATISASI NOMOR HP: Ubah '0' di awal menjadi '62'
        $no_hp = $request->no_hp_ortu;
        if (str_starts_with($no_hp, '0')) {
            $request->merge([
                'no_hp_ortu' => '62' . substr($no_hp, 1)
            ]);
        }

        $request->validate([
            'nis'           => 'required|numeric|unique:siswas,nis',
            'nama_siswa'    => 'required|string|max:100',
            'nama_ortu'     => 'required|string|max:100',
            'kelas'         => 'required|string|max:20',
            'no_hp_ortu'    => 'required|string|max:15',
            'status'        => 'required|in:aktif,tidak_aktif',
            'alamat'        => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:laki-laki,perempuan',
        ]);

        Siswa::create($request->all());

        return redirect()->route('admin.siswa.index')->with('success', 'Data Siswa berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $siswa = Siswa::findOrFail($id);
        return Inertia::render('admin/siswa/edit', [
            'siswa' => $siswa
        ]);
    }

    public function update(Request $request, $id)
    {
        // OTOMATISASI NOMOR HP: Ubah '0' di awal menjadi '62'
        $no_hp = $request->no_hp_ortu;
        if (str_starts_with($no_hp, '0')) {
            $request->merge([
                'no_hp_ortu' => '62' . substr($no_hp, 1)
            ]);
        }

        $request->validate([
            'nis'           => 'required|numeric|unique:siswas,nis,' . $id . ',id_siswa', // Ignore ID saat update
            'nama_siswa'    => 'required|string|max:100',
            'kelas'         => 'required|string|max:20',
            'no_hp_ortu'    => 'required|string|max:15',
            'nama_ortu'     => 'required|string|max:100',
            'status'        => 'required|in:aktif,tidak_aktif',
            'alamat'        => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:laki-laki,perempuan',
        ]);

        Siswa::findOrFail($id)->update($request->all());

        return redirect()->route('admin.siswa.index')->with('success', 'Data Siswa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Siswa::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data Siswa berhasil dihapus.');
    }
}