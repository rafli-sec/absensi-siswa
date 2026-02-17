<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class GuruController extends Controller
{
    /**
     * Menampilkan daftar guru
     */
    public function index()
    {
        // Pastikan path sesuai dengan folder resources/js/Pages/Admin/Guru/Index
        return Inertia::render('admin/guru/index', [
            'gurus' => Guru::with('user')->latest()->get()
        ]);
    }

    /**
     * Menampilkan halaman form tambah guru
     * (Method Baru)
     */
    public function create()
    {
        return Inertia::render('admin/guru/create');
    }

    /**
     * Menyimpan data guru baru (User + Profil Guru)
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_guru' => 'required|string|max:100',
            'nip'       => 'required|string|max:30|unique:gurus,nip',
            'mapel'     => 'required|string|max:50',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:8',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // 1. Buat Akun Login
                $user = User::create([
                    'name'     => $request->nama_guru,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                    'role'     => 'guru',
                ]);

                // 2. Buat Profil Guru
                Guru::create([
                    'user_id'   => $user->id,
                    'nip'       => $request->nip,
                    'nama_guru' => $request->nama_guru,
                    'mapel'     => $request->mapel,
                ]);
            });

            // Redirect ke halaman index setelah berhasil
            return redirect()->route('admin.guru.index')->with('success', 'Data Guru dan Akun berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan halaman form edit guru
     * (Method Baru)
     */
    public function edit($id)
    {
        // Ambil data guru beserta relasi user-nya (untuk email)
        $guru = Guru::with('user')->findOrFail($id);

        return Inertia::render('admin/guru/edit', [
            'guru' => $guru
        ]);
    }

    /**
     * Menampilkan detail satu guru
     */
    public function show($id)
    {
        $guru = Guru::with('user')->findOrFail($id);
        
        return Inertia::render('admin/guru/show', [
            'guru' => $guru
        ]);
    }

    /**
     * Update data guru
     */
    public function update(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);
        $user = User::findOrFail($guru->user_id);

        $request->validate([
            'nama_guru' => 'required|string|max:100',
            'nip'       => 'required|string|max:30|unique:gurus,nip,' . $id . ',id_guru',
            'mapel'     => 'required|string|max:50',
            'email'     => 'required|email|unique:users,email,' . $user->id,
        ]);

        DB::transaction(function () use ($request, $guru, $user) {
            $user->update([
                'name'  => $request->nama_guru,
                'email' => $request->email,
            ]);

            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }

            $guru->update([
                'nip'       => $request->nip,
                'nama_guru' => $request->nama_guru,
                'mapel'     => $request->mapel,
            ]);
        });

        // Redirect ke halaman index setelah berhasil update
        return redirect()->route('admin.guru.index')->with('success', 'Data Guru berhasil diupdate.');
    }

    /**
     * Hapus data guru
     */
    public function destroy($id)
    {
        $guru = Guru::findOrFail($id);
        
        // Hapus user (profil guru otomatis terhapus karena cascade delete di database)
        User::findOrFail($guru->user_id)->delete();

        return redirect()->back()->with('success', 'Data Guru dan Akun berhasil dihapus.');
    }
}