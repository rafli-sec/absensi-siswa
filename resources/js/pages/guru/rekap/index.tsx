import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ClipboardCheck, Calendar, Filter, BookOpen, Clock } from 'lucide-react';
import { useState } from 'react';

// Data Konstanta
const mapelOptions = [
    'Pend. Agama Islam (PAI)', 'Pend. Agama Kristen (PAK)', 'Pend. Pancasila',
    'Bhs. Indonesia', 'Matematika', 'IPA', 'IPS', 'Bhs. Inggris',
    'Seni Budaya', 'PJOK', 'Bhs. Daerah', 'IPA/TIK', 'Bimbingan Konseling (BK)'
];
const jamOptions = Array.from({ length: 9 }, (_, i) => i + 1);

export default function Rekap({ rekapAbsensi = [], filters, kelasOptions = [] }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Rekap Absensi', href: '#' },
    ];

    // State untuk masing-masing filter
    const [tanggal, setTanggal] = useState(filters?.tanggal || '');
    const [kelas, setKelas] = useState(filters?.kelas || '');
    const [mapel, setMapel] = useState(filters?.mapel || '');
    const [jamKe, setJamKe] = useState(filters?.jam_ke || '');

    // Fungsi submit filter ke backend
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('guru.rekap.index'), { 
            tanggal, 
            kelas, 
            mapel, 
            jam_ke: jamKe 
        }, { preserveState: true, replace: true });
    };

    // Fungsi reset filter
    const resetFilter = () => {
        setKelas('');
        setMapel('');
        setJamKe('');
        // Kita biarkan tanggal tetap pada saat di-reset atau boleh ubah ke hari ini
        router.get(route('guru.rekap.index'), { tanggal }, { preserveState: true });
    };

    const getPercentage = (part: number, total: number) => total > 0 ? Math.round((part / total) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi" />

            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ClipboardCheck className="text-blue-500" size={32} />
                            Rekap Absensi Harian
                        </h1>
                        <p className="text-slate-500 mt-1">Ringkasan kehadiran siswa per kelas, mapel, dan jam pelajaran</p>
                    </div>
                </div>

                {/* --- KOTAK FILTER --- */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-3">
                            <Filter size={18} className="text-blue-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">Filter Rekapitulasi</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                            {/* Filter Tanggal */}
                            <div className="space-y-1.5 md:col-span-1 col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Tanggal</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="w-full pl-10 text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11"
                                    />
                                    <Calendar className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Filter Kelas */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Kelas</label>
                                <select 
                                    value={kelas}
                                    onChange={(e) => setKelas(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasOptions.map((k: string) => (
                                        <option key={k} value={k}>Kelas {k}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Mapel */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
                                <select 
                                    value={mapel}
                                    onChange={(e) => setMapel(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11"
                                >
                                    <option value="">Semua Mapel</option>
                                    {mapelOptions.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Jam Ke */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Jam</label>
                                <select 
                                    value={jamKe}
                                    onChange={(e) => setJamKe(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11"
                                >
                                    <option value="">Semua Jam</option>
                                    {jamOptions.map((j) => (
                                        <option key={j} value={j.toString()}>Jam ke-{j}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-2 h-11 col-span-2 md:col-span-1">
                                {(kelas || mapel || jamKe) && (
                                    <button 
                                        type="button"
                                        onClick={resetFilter}
                                        className="px-4 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-bold transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold uppercase tracking-wide flex items-center justify-center transition-colors"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- TABEL REKAP --- */}
                {rekapAbsensi.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <ClipboardCheck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak ada data rekapitulasi</h3>
                        <p className="text-slate-500">Tidak ada absensi yang cocok dengan filter pada tanggal tersebut.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="p-4 text-left font-extrabold text-slate-500 uppercase text-[11px] tracking-widest whitespace-nowrap">Detail Sesi</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Total Siswa</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Hadir</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Izin</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Sakit</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Alpha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rekapAbsensi.map((rekap: any, index: number) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 text-sm mb-1">Kelas {rekap.kelas}</div>
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                                                    <BookOpen size={12} className="text-blue-400" /> {rekap.mapel}
                                                </div>
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                                    <Clock size={12} className="text-blue-400" /> Jam ke-{rekap.jam_ke}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-black text-lg text-slate-800">
                                                {rekap.total_siswa}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 rounded-xl inline-flex flex-col items-center min-w-[70px]">
                                                    <span className="font-black text-base leading-none">{rekap.hadir}</span>
                                                    <span className="text-[10px] font-bold opacity-70 mt-1">{getPercentage(rekap.hadir, rekap.total_siswa)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-2 rounded-xl inline-flex flex-col items-center min-w-[70px]">
                                                    <span className="font-black text-base leading-none">{rekap.izin}</span>
                                                    <span className="text-[10px] font-bold opacity-70 mt-1">{getPercentage(rekap.izin, rekap.total_siswa)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-2 rounded-xl inline-flex flex-col items-center min-w-[70px]">
                                                    <span className="font-black text-base leading-none">{rekap.sakit}</span>
                                                    <span className="text-[10px] font-bold opacity-70 mt-1">{getPercentage(rekap.sakit, rekap.total_siswa)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-rose-50 text-rose-700 border border-rose-100 px-3 py-2 rounded-xl inline-flex flex-col items-center min-w-[70px]">
                                                    <span className="font-black text-base leading-none">{rekap.alpha}</span>
                                                    <span className="text-[10px] font-bold opacity-70 mt-1">{getPercentage(rekap.alpha, rekap.total_siswa)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}