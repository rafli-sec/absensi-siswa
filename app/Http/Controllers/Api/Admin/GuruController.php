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
        return Inertia::render('admin/guru/index', [
            'gurus' => Guru::with('user')->latest()->get()
        ]);
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

            return redirect()->back()->with('success', 'Data Guru dan Akun berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
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

        return redirect()->back()->with('success', 'Data Guru berhasil diupdate.');
    }

    /**
     * Hapus data guru
     */
    public function destroy($id)
    {
        $guru = Guru::findOrFail($id);
        
        // Karena di migrasi Anda menggunakan cascadeOnDelete, 
        // menghapus user akan otomatis menghapus profil guru.
        User::findOrFail($guru->user_id)->delete();

        return redirect()->back()->with('success', 'Data Guru dan Akun berhasil dihapus.');
    }
}