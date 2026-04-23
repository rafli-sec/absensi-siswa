<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\LogWhatsapp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WhatsappLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $statusFilter = $request->query('status', 'all');
        $search = $request->query('search');
        $perPage = 20;
        $idGuruLogin = $user->role !== 'admin' ? $user->guru->id_guru : null;

        if ($statusFilter === 'tidak_perlu') {
            $query = Absensi::with(['siswa'])
                ->where('status_kehadiran', 'hadir')
                ->whereDoesntHave('logWhatsapp');

            if ($idGuruLogin) {
                $query->where('id_guru', $idGuruLogin);
            }

            if ($search) {
                $query->whereHas('siswa', function ($sq) use ($search) {
                    $sq->where('nama_siswa', 'like', "%{$search}%")
                       ->orWhere('nis', 'like', "%{$search}%");
                });
            }

            $paginated = $query->orderBy('waktu_input', 'desc')
                ->paginate($perPage)
                ->withQueryString();

            $rows = $paginated->getCollection()->map(function ($absensi) {
                return [
                    'id_log' => null,
                    'created_at' => $absensi->waktu_input,
                    'no_tujuan' => '-',
                    'pesan' => 'Tidak perlu WA',
                    'status_kirim' => 'Tidak Perlu WA',
                    'absensi' => [
                        'siswa' => [
                            'nama_siswa' => $absensi->siswa->nama_siswa,
                            'kelas' => $absensi->siswa->kelas,
                        ],
                    ],
                ];
            });

            $logs = new LengthAwarePaginator(
                $rows,
                $paginated->total(),
                $paginated->perPage(),
                $paginated->currentPage(),
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'query' => request()->query(),
                ]
            );
        } else {
            $query = LogWhatsapp::with(['absensi.siswa', 'absensi.guru']);

            if ($idGuruLogin) {
                $query->whereHas('absensi', function ($q) use ($idGuruLogin) {
                    $q->where('id_guru', $idGuruLogin);
                });
            }

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('no_tujuan', 'like', "%{$search}%")
                      ->orWhereHas('absensi.siswa', function ($sq) use ($search) {
                          $sq->where('nama_siswa', 'like', "%{$search}%")
                             ->orWhere('nis', 'like', "%{$search}%");
                      });
                });
            }

            if ($statusFilter !== 'all') {
                $query->where('status_kirim', $statusFilter);
            }

            $logs = $query->latest()->paginate($perPage)->withQueryString();
        }

        return Inertia::render('whatsapp/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'status']),
            'user_role' => $user->role,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = Auth::user();
        $log = LogWhatsapp::with('absensi')->findOrFail($id);

        if ($user->role !== 'admin') {
            $idGuruLogin = $user->guru->id_guru;
            if (!$log->absensi || $log->absensi->id_guru !== $idGuruLogin) {
                abort(403);
            }
        }

        if ($log->status_kirim !== 'pending') {
            return redirect()->back()->with('error', 'Hanya pesan yang berstatus pending dapat dibatalkan.');
        }

        $log->update(['status_kirim' => 'gagal']);

        return redirect()->back()->with('success', 'Pengiriman WhatsApp dibatalkan.');
    }
}