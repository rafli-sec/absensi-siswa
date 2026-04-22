import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus, Search, Filter, X, Users, Phone, MapPin, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Siswa', href: '/admin/siswa' },
];

export default function index({ siswas, filters }: { siswas: any, filters: any }) {
    // State untuk filter (tetap sinkron dengan backend)
    const [queryParams, setQueryParams] = useState({
        search: filters.search || '',
        kelas: filters.kelas || '',
        jenis_kelamin: filters.jenis_kelamin || '',
        status: filters.status || '',
    });

    const kelasOptions = ['7A', '7B', '7C', '8A', '8B', '8C', '9'];

    const handleApplyFilter = (e?: any) => {
        if (e) e.preventDefault();
        router.get(route('admin.siswa.index'), queryParams, { 
            preserveState: true, 
            replace: true 
        });
    };

    const resetFilter = () => {
        setQueryParams({ search: '', kelas: '', jenis_kelamin: '', status: '' });
        router.get(route('admin.siswa.index'), {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data siswa ini?')) {
            router.delete(route('admin.siswa.destroy', { id: id }));
            
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Siswa" />

            <div className="p-4 md:p-6 w-full space-y-6 animate-in fade-in duration-500">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Data Siswa
                            <GraduationCap className="text-orange-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 italic">
                            Kelola data identitas siswa, kelas, dan kontak orang tua untuk keperluan akademik.
                        </p>
                    </div>
                    
                    <Link
                        href={route('admin.siswa.create')}
                        className="w-full md:w-auto bg-[#F53003] hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 dark:shadow-none text-xs font-black uppercase tracking-widest hover:scale-[1.02]"
                    >
                        <Plus size={18} />
                        Tambah Siswa
                    </Link>
                </div>

                {/* --- FILTER & SEARCH SECTION --- */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800">
                    <form onSubmit={handleApplyFilter} className="flex flex-col lg:flex-row gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                placeholder="Cari Nama / NIS..." 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                value={queryParams.search}
                                onChange={(e) => setQueryParams({...queryParams, search: e.target.value})}
                            />
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>

                        {/* Group Filter Dropdowns */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-3 w-full lg:w-auto">
                            <select 
                                className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-orange-500 focus:border-orange-500 cursor-pointer appearance-none"
                                value={queryParams.kelas}
                                onChange={(e) => setQueryParams({...queryParams, kelas: e.target.value})}
                            >
                                <option value="">Semua Kelas</option>
                                {kelasOptions.map((k) => (
                                    <option key={k} value={k}>Kelas {k}</option>
                                ))}
                            </select>

                            <select 
                                className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-orange-500 focus:border-orange-500 cursor-pointer appearance-none"
                                value={queryParams.jenis_kelamin}
                                onChange={(e) => setQueryParams({...queryParams, jenis_kelamin: e.target.value})}
                            >
                                <option value="">Semua Gender</option>
                                <option value="L">Laki-laki (L)</option>
                                <option value="P">Perempuan (P)</option>
                            </select>

                            <select 
                                className="col-span-2 md:col-span-1 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-orange-500 focus:border-orange-500 cursor-pointer appearance-none"
                                value={queryParams.status}
                                onChange={(e) => setQueryParams({...queryParams, status: e.target.value})}
                            >
                                <option value="">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="tidak_aktif">Tidak Aktif</option>
                            </select>
                        </div>

                        {/* Tombol Aksi Filter */}
                        <div className="flex gap-2">
                            <button 
                                type="submit"
                                className="bg-slate-800 dark:bg-zinc-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-1 lg:flex-none text-xs font-black uppercase tracking-widest"
                            >
                                <Filter size={16} /> Terapkan
                            </button>

                            {(queryParams.search || queryParams.kelas || queryParams.jenis_kelamin || queryParams.status) && (
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

                {/* --- TAMPILAN TABEL PENUH --- */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                                <tr>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">NIS</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Siswa</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Kelas</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Gender</th>
                                    {/* KOLOM BARU: NAMA ORANG TUA */}
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Ortu/Wali</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Kontak WA</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {siswas?.data?.length > 0 ? (
                                    siswas.data.map((siswa: any) => (
                                        <tr key={siswa.id_siswa} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            
                                            {/* NIS */}
                                            <td className="p-5">
                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-mono font-bold border border-slate-200 dark:border-zinc-700">
                                                    {siswa.nis}
                                                </span>
                                            </td>

                                            {/* Nama Siswa & Alamat */}
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    {siswa.nama_siswa}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">
                                                    <MapPin size={10} className="shrink-0" />
                                                    {siswa.alamat || <span className="italic">Belum ada alamat</span>}
                                                </div>
                                            </td>

                                            {/* Kelas */}
                                            <td className="p-5 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-[#F53003] dark:text-orange-400 rounded-xl text-sm font-black border border-orange-100 dark:border-orange-900/50">
                                                    {siswa.kelas}
                                                </span>
                                            </td>

                                            {/* L/P */}
                                            <td className="p-5 text-center">
                                                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-800 w-8 h-8 rounded-full flex items-center justify-center mx-auto">
                                                    {siswa.jenis_kelamin === 'laki-laki' || siswa.jenis_kelamin === 'L' ? 'L' : 'P'}
                                                </div>
                                            </td>

                                            {/* DATA BARU: NAMA ORANG TUA */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Users size={14} className="text-slate-400" />
                                                    {siswa.nama_ortu ? siswa.nama_ortu : <span className="text-slate-400 italic text-xs">Belum diisi</span>}
                                                </div>
                                            </td>

                                            {/* Kontak WA */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                                                    <Phone size={14} className={siswa.no_hp_ortu ? "text-emerald-500" : "text-slate-300"} />
                                                    {siswa.no_hp_ortu || <span className="text-slate-400 italic font-sans font-normal">Tidak ada</span>}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="p-5 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    siswa.status === 'aktif' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20' 
                                                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20'
                                                }`}>
                                                    {siswa.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>

                                            {/* Aksi */}
                                            <td className="p-5">
                                                <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={route('admin.siswa.edit', siswa.id_siswa)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                        title="Edit Data"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(siswa.id_siswa)}
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
                                        <td colSpan={8} className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-full text-slate-300 dark:text-zinc-600">
                                                    <Users size={48} />
                                                </div>
                                                <p className="text-slate-400 font-medium italic">Data siswa tidak ditemukan atau masih kosong.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINATION --- */}
                <div className="flex justify-center md:justify-end gap-1 flex-wrap pt-4">
                    {siswas?.links?.map((link: any, index: number) => (
                         <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                link.active 
                                    ? 'bg-[#F53003] text-white shadow-md shadow-orange-200 dark:shadow-none' 
                                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
                            } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}