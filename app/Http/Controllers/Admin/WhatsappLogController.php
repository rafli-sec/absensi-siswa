<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LogWhatsapp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WhatsappLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Mulai query dengan eager loading agar tidak berat (N+1 Problem)
        $query = LogWhatsapp::with(['absensi.siswa', 'absensi.guru']);

        // --- LOGIKA FILTER BERDASARKAN ROLE ---
        // Jika user adalah Guru (bukan admin), tampilkan hanya milik dia saja
        if ($user->role !== 'admin') {
            // Kita asumsikan user memiliki relasi ke table guru
            $id_guru_login = $user->guru->id_guru; 

            $query->whereHas('absensi', function ($q) use ($id_guru_login) {
                $q->where('id_guru', $id_guru_login);
            });
        }
        // Jika Admin, query tidak di-filter (melihat semua)

        // Fitur Pencarian (Opsional)
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('no_tujuan', 'like', "%{$request->search}%")
                  ->orWhereHas('absensi.siswa', function ($sq) use ($request) {
                      $sq->where('nama_siswa', 'like', "%{$request->search}%");
                  });
            });
        }

        $logs = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('whatsapp/index', [
            'logs' => $logs->items(),
            'filters' => $request->only(['search']),
            'user_role' => $user->role // Kirim role ke frontend jika perlu
        ]);
    }
}