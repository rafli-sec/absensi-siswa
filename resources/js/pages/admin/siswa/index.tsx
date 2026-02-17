import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus, Search, Filter, X } from 'lucide-react';
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

    const kelasOptions = ['7A', '7B', '8A', '8B', '9A', '9B'];

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
            router.delete(route('admin.siswa.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Siswa" />

            <div className="p-4 md:p-6 w-full max-w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
                        
                        <Link
                            href={route('admin.siswa.create')}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
                        >
                            <Plus size={18} />
                            Tambah Siswa
                        </Link>
                    </div>

                    {/* Section Filter & Search - Disesuaikan dengan gaya Layout Pertama */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <form onSubmit={handleApplyFilter} className="flex flex-col md:flex-row gap-3">
                            
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Cari Nama / NIS..." 
                                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    value={queryParams.search}
                                    onChange={(e) => setQueryParams({...queryParams, search: e.target.value})}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>

                            {/* Group Filter Dropdowns */}
                            <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={queryParams.kelas}
                                    onChange={(e) => setQueryParams({...queryParams, kelas: e.target.value})}
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasOptions.map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>

                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={queryParams.jenis_kelamin}
                                    onChange={(e) => setQueryParams({...queryParams, jenis_kelamin: e.target.value})}
                                >
                                    <option value="">Semua JK</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>

                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={queryParams.status}
                                    onChange={(e) => setQueryParams({...queryParams, status: e.target.value})}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                </select>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-2">
                                <button 
                                    type="submit"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-none text-sm"
                                >
                                    <Filter size={16} />
                                    Terapkan
                                </button>

                                {(queryParams.search || queryParams.kelas || queryParams.jenis_kelamin || queryParams.status) && (
                                    <button 
                                        type="button"
                                        onClick={resetFilter}
                                        className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center border border-gray-200"
                                        title="Reset Filter"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- TAMPILAN TABEL PENUH (Sesuai Layout Pertama) --- */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">NIS</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Nama Siswa</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Kelas</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">L/P</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">No. HP Ortu</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {siswas?.data?.length > 0 ? (
                                    siswas.data.map((siswa: any) => (
                                        <tr key={siswa.id_siswa} className="hover:bg-blue-50/30 transition">
                                            <td className="p-4 text-gray-700 text-sm font-mono">{siswa.nis}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{siswa.nama_siswa}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">{siswa.alamat}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">
                                                    {siswa.kelas}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600 text-sm">{siswa.jenis_kelamin}</td>
                                            <td className="p-4 text-gray-600 text-sm">{siswa.no_hp_ortu || '-'}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    siswa.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {siswa.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route('admin.siswa.edit', siswa.id_siswa)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition border border-transparent hover:border-amber-100"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(siswa.id_siswa)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition border border-transparent hover:border-red-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-400 italic">
                                            Data siswa tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center md:justify-end gap-1 flex-wrap">
                    {siswas?.links?.map((link: any, index: number) => (
                         <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-2 border rounded-md text-xs transition ${
                                link.active 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                            } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}   