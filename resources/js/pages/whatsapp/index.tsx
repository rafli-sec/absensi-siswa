import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Send, CheckCircle2, XCircle, Clock, Search, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppLogProps {
    logs: any; // Data log dari database, bisa berupa paginator atau array
    user_role: string; // 'admin' atau 'guru'
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function WhatsAppIndex({ logs = [], user_role, filters }: WhatsAppLogProps) {
    // State untuk fitur pencarian
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [cancelingId, setCancelingId] = useState<number | null>(null);

    // Fungsi untuk menangani pencarian (tekan Enter)
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                route('whatsapp.index'),
                { search, status },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            route('whatsapp.index'),
            { search, status: value },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('whatsapp.index'),
            { search, status, page },
            { preserveState: true, replace: true }
        );
    };

    const handleCancel = (id_log: number | null) => {
        if (!id_log) return;
        setCancelingId(id_log);
        router.delete(route('whatsapp.destroy', { id: id_log }), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setCancelingId(null),
        });
    };

    // Breadcrumbs dinamis berdasarkan role
    const breadcrumbs: BreadcrumbItem[] = [
        { 
            title: 'Dashboard', 
            href: user_role === 'admin' ? '/admin/dashboard' : '/guru/dashboard' 
        },
        { title: 'Log WhatsApp', href: '/whatsapp-monitoring' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat WhatsApp" />
            
            {/* Wrapper utama - Full Width */}
            <div className="p-6 w-full space-y-8 animate-in fade-in duration-500">
                
                {/* 1. Header Informasi */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Monitoring WhatsApp 
                            <MessageSquare className="text-orange-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            {user_role === 'admin' 
                                ? 'Memantau seluruh lalu lintas pesan otomatis ke orang tua siswa.' 
                                : 'Daftar notifikasi yang terkirim dari absensi yang Anda input.'}
                        </p>
                    </div>

                    {/* Indikator Status Fonnte */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        API Fonnte Aktif
                    </div>
                </div>

                {/* 2. Fitur Pencarian & Info Antrean */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari nama siswa atau nomor HP... (Tekan Enter)" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                        <Clock size={16} /> Queue Worker: <span className="text-orange-600 animate-pulse">Running</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center text-sm font-semibold">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'berhasil', label: 'Terkirim' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'tidak_perlu', label: 'Tidak Perlu' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => handleStatusChange(item.key)}
                            className={`rounded-full px-4 py-2 transition-all border text-xs uppercase tracking-[0.18em] ${
                                status === item.key
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-200 dark:border-zinc-700'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* 3. Tabel Log Pesan */}
                <div className="bg-white dark:bg-zinc-900 rounded-4xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-zinc-800/50 text-slate-400 uppercase text-[11px] font-black tracking-[0.2em]">
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800 whitespace-nowrap">Waktu Kirim</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Siswa / Kelas</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Nomor Tujuan</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Isi Pesan Singkat</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800 text-center">Status</th>
                            <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {((logs as any)?.data ?? logs).length > 0 ? (
                                    ((logs as any)?.data ?? logs).map((log: any) => (
                                        <tr key={log.id_log ?? `${log.absensi?.siswa?.nama_siswa}-${log.created_at}` } className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black text-slate-700 dark:text-slate-300">
                                                    {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-800 dark:text-slate-100 text-base">
                                                    {log.absensi?.siswa?.nama_siswa || 'N/A'}
                                                </div>
                                                <div className="text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest mt-0.5">
                                                    Kelas {log.absensi?.siswa?.kelas || '-'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-sm text-slate-600 dark:text-slate-400 font-bold">
                                                {log.no_tujuan}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs truncate font-medium">
                                                    {log.pesan}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                    log.status_kirim === 'berhasil' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30' 
                                                    : log.status_kirim === 'pending'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse dark:bg-amber-900/30'
                                                    : log.status_kirim === 'Tidak Perlu WA'
                                                    ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-slate-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30'
                                                }`}>
                                                    {log.status_kirim === 'berhasil' ? <CheckCircle2 size={14} /> : log.status_kirim === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                                                    {log.status_kirim}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {log.status_kirim === 'pending' && log.id_log ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancel(log.id_log)}
                                                        disabled={cancelingId === log.id_log}
                                                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        <XCircle size={14} /> Batal
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-500">
                                                        {log.status_kirim === 'Tidak Perlu WA' ? 'Tidak Perlu' : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-20 w-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-300 dark:text-zinc-600">
                                                    <Send size={40} />
                                                </div>
                                                <p className="text-slate-500 font-bold">Tidak ada riwayat pesan yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {((logs as any)?.meta) && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/70">
                            <div className="text-slate-500 text-sm">
                                Menampilkan {((logs as any).meta.from ?? 0)} - {((logs as any).meta.to ?? 0)} dari {((logs as any).meta.total ?? 0)} entri
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={!((logs as any).meta.prev_page_url)}
                                    onClick={() => handlePageChange(((logs as any).meta.current_page ?? 1) - 1)}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Sebelumnya
                                </button>
                                <span className="text-slate-500 text-xs">Halaman {((logs as any).meta.current_page ?? 1)} dari {((logs as any).meta.last_page ?? 1)}</span>
                                <button
                                    type="button"
                                    disabled={!((logs as any).meta.next_page_url)}
                                    onClick={() => handlePageChange(((logs as any).meta.current_page ?? 1) + 1)}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Berikutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}