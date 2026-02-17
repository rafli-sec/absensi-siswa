<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserGuruController extends Controller
{
    /**
     * GET /api/admin/user-guru
     * List semua akun guru
     */
    public function index()
    {
        $gurus = User::where('role', 'guru')
            ->select('id', 'name', 'email', 'created_at')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $gurus
        ]);
    }

    /**
     * POST /api/admin/user-guru
     * Admin membuat akun guru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'guru',
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Akun guru berhasil dibuat',
            'data'    => $user
        ], 201);
    }

    /**
     * GET /api/admin/user-guru/{id}
     * Detail akun guru
     */
    public function show($id)
    {
        $user = User::where('role', 'guru')->findOrFail($id);

        return response()->json([
            'status' => true,
            'data'   => $user
        ]);
    }

    /**
     * PUT /api/admin/user-guru/{id}
     * Update akun guru
     */
    public function update(Request $request, $id)
    {
        $user = User::where('role', 'guru')->findOrFail($id);

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        $user->name  = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status'  => true,
            'message' => 'Akun guru berhasil diperbarui',
            'data'    => $user
        ]);
    }

    /**
     * DELETE /api/admin/user-guru/{id}
     * Hapus akun guru
     */
    public function destroy($id)
    {
        $user = User::where('role', 'guru')->findOrFail($id);
        $user->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Akun guru berhasil dihapus'
        ]);
    }
}
