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

        if ($request->has('search')) {
            $query->where('nama_siswa', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('admin/siswa/index', [
            'siswas' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/siswa/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nis'        => 'required|numeric|unique:siswas,nis',
            'nama_siswa' => 'required|string|max:100',
            'kelas'      => 'required|string|max:20',
            'no_hp_ortu' => 'required|string|max:15',
            'status'     => 'required|in:aktif,tidak_aktif',
            'alamat'     => 'required|string|max:255',
            'jenis_kelamin'     => 'required|in:laki-laki,perempuan',
  
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
        $request->validate([
            'nis'        => 'required|numeric|unique:siswas,nis,' . $id . ',id_siswa', // Ignore ID saat update
            'nama_siswa' => 'required|string|max:100',
            'kelas'      => 'required|string|max:20',
            'no_hp_ortu' => 'required|string|max:15',
            'status'     => 'required|in:aktif,tidak_aktif',
            'alamat' => 'required|string|max:255',
            'jenis_kelamin'     => 'required|in:laki-laki,perempuan',
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