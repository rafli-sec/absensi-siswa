import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Trash2, Search, Filter, X, MessageSquare, Calendar, User, BookOpen, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Laporan Orang Tua', href: '/admin/laporan' },
];

export default function Index({ laporans, filters }: { laporans: any, filters: any }) {
    
    // State untuk fitur pencarian dan filter
    const [queryParams, setQueryParams] = useState({
        search: filters?.search || '',
        tanggal: filters?.tanggal || '',
    });

    const handleApplyFilter = (e?: any) => {
        if (e) e.preventDefault();
        router.get(route('admin.laporan.index'), queryParams, { 
            preserveState: true, 
            replace: true 
        });
    };

    const resetFilter = () => {
        setQueryParams({ search: '', tanggal: '' });
        router.get(route('admin.laporan.index'), {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data laporan ini?')) {
            router.delete(route('admin.laporan.destroy', { id: id }), { preserveScroll: true });
        }
    };

    // FUNGSI UPDATE STATUS
    const handleStatusChange = (id: number, newStatus: string | null) => {
        console.log('Updating status:', { id, newStatus });
        
        const data = newStatus === null ? null : newStatus;
        router.put(route('admin.laporan.update-status', { id: id }), { status: data }, { 
            preserveScroll: true,
            onError: (errors) => {
                console.error('Error updating status:', errors);
            },
            onSuccess: () => {
                console.log('Status updated successfully');
            },
        });
    };

    // Deteksi array data
    const laporanData = Array.isArray(laporans) ? laporans : (laporans?.data || []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Orang Tua" />

            <div className="p-4 md:p-6 w-full space-y-6 animate-in fade-in duration-500">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Laporan Orang Tua
                            <MessageSquare className="text-blue-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 italic">
                            Pantau dan kelola laporan ketidakhadiran (sakit/izin) atau pengaduan dari wali murid.
                        </p>
                    </div>
                </div>

                {/* --- FILTER & SEARCH SECTION --- */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800">
                    <form onSubmit={handleApplyFilter} className="flex flex-col lg:flex-row gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                placeholder="Cari Nama Siswa atau Nama Pengirim..." 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={queryParams.search}
                                onChange={(e) => setQueryParams({...queryParams, search: e.target.value})}
                            />
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>

                        {/* Date Filter */}
                        <div className="relative w-full lg:w-48">
                            <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={queryParams.tanggal}
                                onChange={(e) => setQueryParams({...queryParams, tanggal: e.target.value})}
                            />
                            <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button 
                                type="submit"
                                className="bg-slate-800 dark:bg-zinc-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-1 lg:flex-none text-xs font-black uppercase tracking-widest"
                            >
                                <Filter size={16} /> Filter
                            </button>

                            {(queryParams.search || queryParams.tanggal) && (
                                <button 
                                    type="button"
                                    onClick={resetFilter}
                                    className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center border border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50"
                                    title="Reset Filter"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                                <tr>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Info Siswa</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Pengirim (Ortu)</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Tgl & Jenis</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 w-1/3">Pesan Detail</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status Laporan</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {laporanData.length > 0 ? (
                                    laporanData.map((laporan: any) => (
                                        <tr key={laporan.id_laporan} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            
                                            {/* Info Siswa */}
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    {laporan.siswa?.nama_siswa || 'Siswa Dihapus'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mt-1">
                                                    <BookOpen size={12} className="text-[#F53003]" /> Kelas {laporan.siswa?.kelas || '-'}
                                                </div>
                                            </td>

                                            {/* Info Pengirim */}
                                            <td className="p-5">
                                                <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                                                    {laporan.nama_pengirim}
                                                </div>
                                                <div className="text-[11px] font-mono text-slate-400 mt-1">
                                                    WA: {laporan.no_hp_pengirim}
                                                </div>
                                            </td>

                                            {/* Tanggal & Jenis */}
                                            <td className="p-5">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        <Calendar size={14} /> {laporan.tanggal_izin}
                                                    </span>
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                        laporan.jenis_laporan === 'sakit' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                                        laporan.jenis_laporan === 'izin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                                                    }`}>
                                                        {laporan.jenis_laporan}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Pesan Detail */}
                                            <td className="p-5">
                                                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                                                    "{laporan.pesan}"
                                                </div>
                                            </td>

                                            {/* Status Laporan & Nama Guru Pemvalidasi */}
                                            <td className="p-5 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <select 
                                                        className={`text-xs font-black uppercase tracking-wider rounded-xl px-3 py-2 border-2 cursor-pointer transition-all outline-none appearance-none text-center ${
                                                            !laporan.status 
                                                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800' 
                                                                : laporan.status === 'ditolak' 
                                                                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:border-rose-800' 
                                                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                                                        }`}
                                                        value={laporan.status || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? null : e.target.value;
                                                            handleStatusChange(laporan.id_laporan, val);
                                                        }}
                                                    >
                                                        <option value="">Menunggu</option>
                                                        <option value="diterima">Diterima</option>
                                                        <option value="ditolak">Ditolak</option>
                                                    </select>

                                                    {/* MENAMPILKAN NAMA GURU */}
                                                    {laporan.guru && laporan.status && (
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                                            Oleh: {laporan.guru.nama_guru}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Aksi Hapus */}
                                            <td className="p-5 text-center">
                                                <button
                                                    onClick={() => handleDelete(laporan.id_laporan)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                                    title="Hapus Laporan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-full text-slate-300 dark:text-zinc-600">
                                                    <CheckCircle size={48} />
                                                </div>
                                                <p className="text-slate-500 font-bold text-sm">Bagus! Tidak ada laporan yang menumpuk.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINATION --- */}
                {laporans?.links && (
                    <div className="flex justify-center md:justify-end gap-1 flex-wrap pt-4">
                        {laporans.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    link.active 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' 
                                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}