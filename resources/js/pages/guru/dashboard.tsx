import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { BookOpen, Send, Clock, PlusCircle, ArrowRight, CalendarDays } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Guru',
        href: '/guru/dashboard',
    },
];

interface GuruDashboardProps {
    stats: {
        total_absen_saya: number;
        wa_terkirim_saya: number;
        hari_ini: string;
    };
    recentAbsensi: any[];
}

export default function GuruDashboard({ 
    stats = { total_absen_saya: 0, wa_terkirim_saya: 0, hari_ini: '' }, 
    recentAbsensi = [] 
}: GuruDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guru Dashboard" />
            
            {/* 1. Hapus max-w-7xl agar Full Width */}
            <div className="p-6 w-full space-y-8 animate-in fade-in duration-500">
                
                {/* Header Dinamis */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Halo Bapak/Ibu Guru! 📚
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Kelola absensi siswa dan pantau notifikasi WhatsApp secara real-time.
                        </p>
                    </div>
                    <Link 
                        href={route('guru.absensi.create')} 
                        className="flex items-center gap-2 px-6 py-3 bg-[#F53003] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-200 dark:shadow-none hover:bg-orange-600 transition-all hover:scale-105"
                    >
                        <PlusCircle size={18} /> Input Absen Baru
                    </Link>
                </div>

                {/* 2. Statistik Guru yang melebar mengikuti layar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Absensi Saya" 
                        value={stats.total_absen_saya.toLocaleString()} 
                        icon={<BookOpen size={24} />} 
                        color="blue" 
                        subtitle="Record di database"
                    />
                    
                    <StatCard 
                        title="WA Terkirim" 
                        value={stats.wa_terkirim_saya.toLocaleString()} 
                        icon={<Send size={24} />} 
                        color="orange" 
                        subtitle="Status: Berhasil"
                    />

                    <StatCard 
                        title="Agenda Hari Ini" 
                        value={stats.hari_ini} 
                        icon={<CalendarDays size={24} />} 
                        color="emerald" 
                        subtitle="Jadwal mengajar aktif"
                    />
                </div>

                {/* 3. Tabel Riwayat dengan Rounded besar dan lebar penuh */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/20">
                        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white flex items-center gap-3">
                            <Clock size={22} className="text-orange-500" />
                            Riwayat Absensi Terakhir
                        </h2>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                            DATABASE ACTIVITY
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-zinc-900 text-slate-400 uppercase text-[11px] font-black tracking-widest">
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Tanggal</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Mata Pelajaran</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {recentAbsensi.length > 0 ? (
                                    recentAbsensi.map((absen, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-800 dark:text-slate-100 text-base">
                                                    {new Date(absen.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pukul {absen.waktu_input}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-300 italic">
                                                {absen.mapel} (Jam ke-{absen.jam_ke})
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Link 
                                                    href={route('guru.absensi.index', { tanggal: absen.tanggal })}
                                                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase text-[#F53003] hover:text-orange-700 underline underline-offset-4"
                                                >
                                                    Detail Laporan <ArrowRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-24 text-center">
                                            <p className="text-slate-400 italic font-bold">Belum ada data absensi yang diinput.</p>
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

function StatCard({ title, value, icon, color, subtitle }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20',
        orange: 'bg-orange-50 text-[#F53003] border-orange-100 dark:bg-orange-900/20',
    };

    return (
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 transition-all hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-xl group">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform group-hover:scale-110 group-hover:rotate-3 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{title}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
            {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide italic">{subtitle}</p>}
        </div>
    );
}