import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Users, Send, AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/admin/dashboard',
    },
];

interface DashboardProps {
    stats: {
        total_guru: number;
        total_siswa: number;
        wa_hari_ini: {
            berhasil: number;
            gagal: number;
            pending: number;
        };
        kehadiran: number;
    };
    recentLogs: any[];
}

export default function AdminDashboard({ stats, recentLogs }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            {/* Wrapper utama - Kita hapus max-w-7xl agar tidak "ketengah" dan sangat jelek */}
            <div className="p-6 w-full space-y-8 animate-in fade-in duration-500"> 
                
                {/* 1. Header Ringkasan */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Dasboard
                            <span className="text-orange-500 animate-bounce text-2xl">👋</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Data real-time aktivitas guru dan monitoring pengiriman WhatsApp.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        System Online
                    </div>
                </div>

                {/* 2. Kartu Statistik Utama - Memanfaatkan lebar layar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Guru" 
                        value={stats.total_guru.toLocaleString()} 
                        icon={<Users size={24} />} 
                        color="blue" 
                        subtitle="Staff Terdaftar"
                    />
                    
                    <StatCard 
                        title="Kehadiran Siswa" 
                        value={`${stats.kehadiran}%`} 
                        icon={<CheckCircle size={24} />} 
                        color="emerald" 
                        subtitle="Rata-rata kehadiran hari ini"
                    />

                    <StatCard 
                        title="WA Terkirim" 
                        value={stats.wa_hari_ini.berhasil.toLocaleString()} 
                        icon={<Send size={24} />} 
                        color="orange" 
                        subtitle="Status: Berhasil Terkirim"
                    />

                    <StatCard 
                        title="WA Gagal/Pending" 
                        value={(stats.wa_hari_ini.gagal + stats.wa_hari_ini.pending).toLocaleString()} 
                        icon={<AlertCircle size={24} />} 
                        color="rose" 
                        subtitle="Butuh perhatian segera"
                        action={<button className="ml-2 text-[10px] text-blue-600 hover:underline font-black uppercase">Retry</button>}
                    />
                </div>

                {/* 3. Section Log WhatsApp - Full Width Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/20">
                        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white flex items-center gap-3">
                            <Clock size={22} className="text-orange-500" />
                            Status Pengiriman Terakhir
                        </h2>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                            Live Monitor
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-zinc-900 text-slate-400 uppercase text-[11px] font-black tracking-widest">
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Waktu</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">Siswa / Kelas</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800">No. HP Orang Tua</th>
                                    <th className="px-8 py-5 border-b border-slate-100 dark:border-zinc-800 text-center">Status Notifikasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log) => (
                                        <tr key={log.id_log} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                                            <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-800 dark:text-slate-100 text-base">
                                                    {log.absensi?.siswa?.nama_siswa || 'N/A'}
                                                </div>
                                                <div className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-black tracking-widest mt-0.5">
                                                    Kelas {log.absensi?.siswa?.kelas || '-'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-sm text-slate-600 dark:text-slate-400 font-bold">
                                                {log.no_tujuan}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                    log.status_kirim === 'berhasil' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : log.status_kirim === 'pending'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>
                                                    {log.status_kirim}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-24 text-center">
                                            <p className="text-slate-400 italic font-bold">Tidak ada data notifikasi untuk ditampilkan hari ini.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 bg-slate-50/30 dark:bg-zinc-800/10 text-center border-t border-slate-100 dark:border-zinc-800">
                        <button className="text-[11px] font-black text-[#F53003] hover:text-orange-700 uppercase tracking-[0.2em] flex items-center justify-center mx-auto gap-2 transition-all hover:gap-4">
                            Lihat Seluruh Riwayat Log <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, color, subtitle, action }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20',
        orange: 'bg-orange-50 text-[#F53003] border-orange-100 dark:bg-orange-900/20',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20',
    };

    return (
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 transition-all hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-xl group">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform group-hover:scale-110 group-hover:rotate-3 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
                {action}
            </div>
            {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide italic">{subtitle}</p>}
        </div>
    );
}