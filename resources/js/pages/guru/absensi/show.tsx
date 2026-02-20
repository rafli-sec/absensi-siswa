import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ArrowLeft, CheckCircle2, XCircle, Clock, BookOpen, Phone, MessageSquare, AlertCircle } from 'lucide-react';

export default function AbsensiShow({ detailAbsensi = [], infoSesi }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Riwayat Absensi', href: '/guru/absensi' },
        { title: `Detail Kelas ${infoSesi?.kelas || ''}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Absensi ${infoSesi?.kelas || ''}`} />

            <div className="p-4 md:p-6 w-full max-w-full animate-in fade-in duration-500">
                {/* --- HEADER & INFO SESI --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link 
                                href={route('guru.absensi.index')}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                                title="Kembali ke Riwayat"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Rincian Kehadiran Siswa
                            </h1>
                        </div>
                        <p className="text-slate-500 ml-11">
                            Detail status kehadiran dan pengiriman WhatsApp untuk sesi ini.
                        </p>
                    </div>
                </div>

                {/* --- KARTU INFO SESI --- */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex flex-wrap gap-8 items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Kelas</p>
                        <p className="text-xl font-black text-blue-900">{infoSesi?.kelas}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Mata Pelajaran</p>
                        <p className="text-xl font-black text-blue-900 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-500" /> {infoSesi?.mapel}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Jam Ke</p>
                        <p className="text-xl font-black text-blue-900 flex items-center gap-2">
                            <Clock size={20} className="text-blue-500" /> {infoSesi?.jam_ke}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Tanggal</p>
                        <p className="text-xl font-black text-blue-900">
                            {new Date(infoSesi?.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* --- TABEL DETAIL SISWA --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Siswa / NIS</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Status Kehadiran</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Waktu Absen</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">No. HP Orang Tua</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {detailAbsensi.length > 0 ? (
                                    detailAbsensi.map((siswa: any, index: number) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 text-base">{siswa.nama_siswa}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIS: {siswa.nis}</div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    siswa.status_kehadiran === 'hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    siswa.status_kehadiran === 'izin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    siswa.status_kehadiran === 'sakit' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    siswa.status_kehadiran === 'alpha' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {siswa.status_kehadiran}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm font-bold text-slate-600">
                                                {siswa.waktu_input !== '-' ? `Pukul ${siswa.waktu_input}` : '-'}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-600">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {siswa.no_hp_ortu || <span className="text-slate-400 italic font-sans text-xs">Belum ada data</span>}
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                {siswa.status_wa === 'Tidak Perlu WA' ? (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                        Tidak Perlu
                                                    </span>
                                                ) : siswa.status_wa === 'N/A' ? (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                        N/A
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                        siswa.status_wa === 'berhasil' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        siswa.status_wa === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        {siswa.status_wa === 'berhasil' ? <CheckCircle2 size={12} /> : 
                                                         siswa.status_wa === 'pending' ? <Clock size={12} /> : 
                                                         <XCircle size={12} />}
                                                        {siswa.status_wa}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-400 italic font-bold">
                                            Tidak ada data siswa ditemukan untuk kelas ini.
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