import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { Save, X, BookOpen, Clock, Users, CheckCircle, FileText, Thermometer, XCircle } from 'lucide-react';

export default function EditAbsensi({ siswas, kelas, tanggal, mapel, jam_ke }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Riwayat Absensi', href: '/guru/absensi' },
        { title: `Edit Absen Kelas ${kelas}`, href: '#' },
    ];

    // Inisialisasi useForm dengan data dari controller
    const { data, setData, post, processing } = useForm({
        kelas: kelas,
        tanggal: tanggal,
        mapel: mapel,
        jam_ke: jam_ke,
        // Map data siswa dari database menjadi format array untuk disubmit
        absensi: siswas.map((s: any) => ({
            id_siswa: s.id_siswa,
            status_kehadiran: s.status_kehadiran
        }))
    });

    // Fungsi untuk merubah status salah satu siswa
    const handleStatusChange = (id_siswa: number, newStatus: string) => {
        const newData = data.absensi.map((item: any) => 
            item.id_siswa === id_siswa ? { ...item, status_kehadiran: newStatus } : item
        );
        setData('absensi', newData);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Kita menggunakan post ke store karena di controller Anda memakai updateOrCreate
        post(route('guru.absensi.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Absensi ${kelas}`} />

            <div className="p-4 md:p-6 w-full max-w-full animate-in fade-in duration-500">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Absensi Kelas</h1>
                        <p className="text-slate-500 mt-1">Perbarui status kehadiran siswa untuk sesi yang sudah berjalan.</p>
                    </div>
                    <Link 
                        href={route('guru.absensi.index')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                    >
                        <X size={16} /> Batal Edit
                    </Link>
                </div>

                {/* --- KARTU INFO SESI --- */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex flex-wrap gap-8 items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Kelas Aktif</p>
                        <p className="text-xl font-black text-amber-900 flex items-center gap-2">
                            <Users size={20} className="text-amber-500" /> {kelas}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Mata Pelajaran</p>
                        <p className="text-xl font-black text-amber-900 flex items-center gap-2">
                            <BookOpen size={20} className="text-amber-500" /> {mapel}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Jam Ke</p>
                        <p className="text-xl font-black text-amber-900 flex items-center gap-2">
                            <Clock size={20} className="text-amber-500" /> {jam_ke}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Tanggal Absen</p>
                        <p className="text-xl font-black text-amber-900">
                            {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* --- FORM TABEL SISWA --- */}
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 w-16 text-center">No</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Siswa / NIS</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Pilih Status Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {siswas.map((siswa: any, index: number) => {
                                    // Cari status siswa saat ini dari state form
                                    const currentStatus = data.absensi.find((a: any) => a.id_siswa === siswa.id_siswa)?.status_kehadiran;

                                    return (
                                        <tr key={siswa.id_siswa} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 text-center font-bold text-slate-400">{index + 1}</td>
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 text-base">{siswa.nama_siswa}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIS: {siswa.nis}</div>
                                            </td>
                                            <td className="p-5">
                                                {/* Pilihan Radio Button UI Custom */}
                                                <div className="flex items-center justify-center gap-2">
                                                    
                                                    {/* Tombol Hadir */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(siswa.id_siswa, 'hadir')}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                            currentStatus === 'hadir' 
                                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2' 
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'
                                                        }`}
                                                    >
                                                        <CheckCircle size={14} /> Hadir
                                                    </button>

                                                    {/* Tombol Izin */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(siswa.id_siswa, 'izin')}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                            currentStatus === 'izin' 
                                                            ? 'bg-blue-500 text-white shadow-md shadow-blue-200 ring-2 ring-blue-500 ring-offset-2' 
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'
                                                        }`}
                                                    >
                                                        <FileText size={14} /> Izin
                                                    </button>

                                                    {/* Tombol Sakit */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(siswa.id_siswa, 'sakit')}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                            currentStatus === 'sakit' 
                                                            ? 'bg-amber-500 text-white shadow-md shadow-amber-200 ring-2 ring-amber-500 ring-offset-2' 
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'
                                                        }`}
                                                    >
                                                        <Thermometer size={14} /> Sakit
                                                    </button>

                                                    {/* Tombol Alpha */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(siswa.id_siswa, 'alpha')}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                            currentStatus === 'alpha' 
                                                            ? 'bg-rose-500 text-white shadow-md shadow-rose-200 ring-2 ring-rose-500 ring-offset-2' 
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'
                                                        }`}
                                                    >
                                                        <XCircle size={14} /> Alpha
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* --- FOOTER FORM: TOMBOL SIMPAN --- */}
                    <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex items-center gap-3 px-8 py-4 bg-[#F53003] hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="animate-pulse flex items-center gap-2">Memperbarui Database...</span>
                            ) : (
                                <>
                                    <Save size={18} className="transition-transform group-hover:-translate-y-0.5" />
                                    Simpan Perubahan Absensi
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}