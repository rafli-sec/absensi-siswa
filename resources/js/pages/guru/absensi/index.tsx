import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus, Calendar, Users, CheckCircle, XCircle, BookOpen, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/guru/dashboard' },
    { title: 'Riwayat Absensi', href: '/guru/absensi' },
];

export default function index({ rekapAbsensi = [], filters }: any) {
    
    // Fungsi hapus disesuaikan dengan parameter unik: kelas, tanggal, mapel, dan jam_ke
    const handleDelete = (rekap: any) => {
        if (confirm(`Hapus absensi Kelas ${rekap.kelas} - ${rekap.mapel} (Jam ke-${rekap.jam_ke})?`)) {
            router.delete(route('guru.absensi.destroy', { 
                kelas: rekap.kelas, 
                tanggal: rekap.tanggal,
                mapel: rekap.mapel,
                jam_ke: rekap.jam_ke
            }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />

            <div className="p-4 md:p-6 w-full max-w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Riwayat Absensi</h1>
                        <p className="text-slate-500 mt-1">Daftar kelas dan mata pelajaran yang telah Anda absen.</p>
                    </div>
                    
                    <Link
                        href={route('guru.absensi.create')}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 w-full md:w-auto text-sm"
                    >
                        <Plus size={18} />
                        Absen Baru
                    </Link>
                </div>

                {/* Filter Tanggal */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-fit">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter Tanggal</p>
                            <input 
                                type="date" 
                                className="border-none p-0 focus:ring-0 font-bold text-slate-700 cursor-pointer"
                                value={filters.tanggal}
                                onChange={(e) => router.get(route('guru.absensi.index'), { tanggal: e.target.value }, { preserveState: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- TAMPILAN TABEL --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sesi Pelajaran</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Kelas</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Statistik Kehadiran</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Total</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rekapAbsensi.length > 0 ? (
                                    rekapAbsensi.map((rekap: any, index: number) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <Clock size={14} />
                                                        <span className="text-[10px] font-bold leading-none mt-0.5">{rekap.jam_ke}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 uppercase flex items-center gap-2">
                                                            <BookOpen size={14} className="text-blue-500" />
                                                            {rekap.mapel}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-mono">Sesi Jam Pelajaran ke-{rekap.jam_ke}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 uppercase">
                                                    {rekap.kelas}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                                        <CheckCircle size={14} />
                                                        {rekap.hadir} Hadir
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-100">
                                                        <XCircle size={14} />
                                                        {rekap.tidak_hadir} Absen
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-black text-slate-800 leading-none">{rekap.total_siswa}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Siswa</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route('guru.absensi.edit', { 
                                                            kelas: rekap.kelas, 
                                                            tanggal: rekap.tanggal,
                                                            mapel: rekap.mapel,
                                                            jam_ke: rekap.jam_ke
                                                        })}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                                                        title="Edit Sesi Ini"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(rekap)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                        title="Hapus Sesi Ini"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 rounded-full text-slate-200">
                                                    <Calendar size={48} />
                                                </div>
                                                <p className="text-slate-400 font-medium italic">Belum ada riwayat absensi untuk tanggal ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}