import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus, Search, Users, GraduationCap, Mail, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Guru', href: '/admin/guru' },
];

// Menggunakan tipe any agar fleksibel jika nanti diubah menggunakan pagination
export default function Index({ gurus, filters = {} }: { gurus: any, filters: any }) {
    
    // State untuk fitur pencarian
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: any) => {
        e.preventDefault();
        router.get(route('admin.guru.index'), { search }, { 
            preserveState: true, 
            replace: true 
        });
    };

    const resetSearch = () => {
        setSearch('');
        router.get(route('admin.guru.index'), {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data guru ini? Akun login aplikasi milik guru juga akan otomatis terhapus.')) {
            router.delete(route('admin.guru.destroy', { id: id }));
        }
    };

    // Deteksi apakah data yang dikirim adalah Array biasa atau objek Pagination dari Laravel
    const guruData = Array.isArray(gurus) ? gurus : (gurus?.data || []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Guru" />

            <div className="p-4 md:p-6 w-full space-y-6 animate-in fade-in duration-500">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Data Guru
                            <GraduationCap className="text-emerald-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 italic">
                            Kelola data identitas pendidik, mata pelajaran, dan akses akun sistem.
                        </p>
                    </div>
                    
                    <Link
                        href={route('admin.guru.create')}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200 dark:shadow-none text-xs font-black uppercase tracking-widest hover:scale-[1.02]"
                    >
                        <Plus size={18} />
                        Tambah Guru
                    </Link>
                </div>

                {/* --- FILTER & SEARCH SECTION --- */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800">
                    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                placeholder="Cari Nama Guru atau NIP..." 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>

                        {/* Tombol Aksi Filter */}
                        <div className="flex gap-2">
                            <button 
                                type="submit"
                                className="bg-slate-800 dark:bg-zinc-700 text-white px-8 py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-1 lg:flex-none text-xs font-black uppercase tracking-widest"
                            >
                                Cari
                            </button>

                            {search && (
                                <button 
                                    type="button"
                                    onClick={resetSearch}
                                    className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center border border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50"
                                    title="Reset Pencarian"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- TAMPILAN TABEL PENUH --- */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                                <tr>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">NIP</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Pendidik</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Email (Akses Login)</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Mata Pelajaran</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {guruData.length > 0 ? (
                                    guruData.map((guru: any) => (
                                        <tr key={guru.id_guru} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            
                                            {/* NIP */}
                                            <td className="p-5">
                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-mono font-bold border border-slate-200 dark:border-zinc-700">
                                                    {guru.nip}
                                                </span>
                                            </td>

                                            {/* Nama Guru */}
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    {guru.nama_guru}
                                                </div>
                                            </td>

                                            {/* Email Login */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    <Mail size={14} className={guru.user?.email ? "text-blue-500" : "text-slate-300"} />
                                                    {guru.user?.email || <span className="text-slate-400 italic text-xs">Belum ditautkan ke akun</span>}
                                                </div>
                                            </td>

                                            {/* Mata Pelajaran */}
                                            <td className="p-5 text-center">
                                                <span className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
                                                    {guru.mapel}
                                                </span>
                                            </td>

                                            {/* Aksi */}
                                            <td className="p-5">
                                                <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={route('admin.guru.edit', guru.id_guru)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                        title="Edit Data"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(guru.id_guru)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-full text-slate-300 dark:text-zinc-600">
                                                    <Users size={48} />
                                                </div>
                                                <p className="text-slate-400 font-medium italic">Data guru tidak ditemukan atau masih kosong.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINATION (Jika sewaktu-waktu backend diubah jadi paginate(10)) --- */}
                {gurus?.links && (
                    <div className="flex justify-center md:justify-end gap-1 flex-wrap pt-4">
                        {gurus.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    link.active 
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none' 
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