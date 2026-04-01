<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LaporanOrtu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        
        $query = LaporanOrtu::with(['siswa', 'guru']); 

        // Filter Pencarian
        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where('nama_pengirim', 'like', '%' . $searchTerm . '%')
                ->orWhereHas('siswa', function($q) use ($searchTerm) {
                    $q->where('nama_siswa', 'like', '%' . $searchTerm . '%')
                        ->orWhere('kelas', 'like', '%' . $searchTerm . '%');
                });
        }

        // Filter Tanggal
        if ($request->has('tanggal') && $request->tanggal != '') {
            $query->where('tanggal_izin', $request->tanggal);
        }

        $laporans = $query->latest('created_at')->paginate(10)->withQueryString();

        return Inertia::render('admin/laporan/index', [
            'laporans' => $laporans,
            'filters' => $request->only(['search', 'tanggal']),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'nullable|in:ditolak,diterima'
        ]);

        $laporan = LaporanOrtu::findOrFail($id);
        
        
        $statusValue = $request->status === '' || $request->status === null ? null : $request->status;
        
        $laporan->update(['status' => $statusValue]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        LaporanOrtu::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Laporan berhasil dihapus.');
    }
}