import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { Save, X, BookOpen, Clock, Users, Calendar, UserCircle2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
        absensi: siswas.map((s: any) => ({
            id_siswa: s.id_siswa,
            status_kehadiran: s.status_kehadiran || 'hadir'
        }))
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState<any>(null);

    // Fungsi untuk merubah status salah satu siswa
    const handleStatusChange = (id_siswa: number, newStatus: string) => {
        const newData = data.absensi.map((item: any) => 
            item.id_siswa === id_siswa ? { ...item, status_kehadiran: newStatus } : item
        );
        setData('absensi', newData);
    };

    const getStatus = (id_siswa: number) => {
        const item = data.absensi.find((a: any) => a.id_siswa === id_siswa);
        return item?.status_kehadiran || 'hadir';
    };

    // Fungsi Validasi Laporan (Sama dengan Create)
    const handleValidasiLaporan = (id_laporan: number, status_validasi: string, id_siswa: number, jenis_izin: string) => {
        router.put(route('guru.laporan.validasi', { id: id_laporan }), { status: status_validasi }, {
            preserveScroll: true,
            onSuccess: () => {
                if (status_validasi === 'diterima') {
                    handleStatusChange(id_siswa, jenis_izin);
                }
                setIsModalOpen(false);
            }
        });
    };

    const openLaporanModal = (siswa: any) => {
        setSelectedSiswa(siswa);
        setIsModalOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('guru.absensi.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Absensi ${kelas}`} />

            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
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

                {/* --- KARTU INFO SESI (Dibuat mirip desain Create) --- */}
                <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                    <CardHeader className="p-5 md:p-6 border-b border-slate-100 bg-amber-50">
                        <CardTitle className="text-lg md:text-xl font-black text-amber-900 flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-200">
                                <FileText size={20} />
                            </div>
                            Informasi Sesi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 md:p-6 bg-white">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Kelas</Label>
                                <div className="flex items-center gap-2 font-bold text-slate-800 h-11 px-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Users size={16} className="text-amber-500" /> {kelas}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</Label>
                                <div className="flex items-center gap-2 font-bold text-slate-800 h-11 px-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <BookOpen size={16} className="text-amber-500" /> {mapel}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Jam Ke</Label>
                                <div className="flex items-center gap-2 font-bold text-slate-800 h-11 px-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Clock size={16} className="text-amber-500" /> Ke-{jam_ke}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Tanggal</Label>
                                <div className="flex items-center gap-2 font-bold text-slate-800 h-11 px-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Calendar size={16} className="text-amber-500" /> 
                                    {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- LIST SISWA (Sama Persis dengan Create) --- */}
                <form onSubmit={submit} className="space-y-3 relative">
                    {siswas.map((siswa: any, index: number) => (
                        <div key={siswa.id_siswa} className="rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-300 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                                    <UserCircle2 size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800 leading-tight">{index + 1}. {siswa.nama_siswa}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] text-slate-400 font-mono">NIS: {siswa.nis}</p>
                                        {siswa.laporan_ortu && (
                                            <button 
                                                type="button"
                                                onClick={() => openLaporanModal(siswa)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-colors ${
                                                    siswa.laporan_ortu.status_laporan === 'menunggu' 
                                                    ? 'bg-amber-100 text-amber-700 animate-pulse'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                }`}
                                            >
                                                <FileText size={10} />
                                                {siswa.laporan_ortu.status_laporan === 'menunggu' ? 'Ada Laporan' : 'Laporan Diterima'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 md:flex gap-1.5 md:gap-2 w-full md:w-auto">
                                {['hadir', 'izin', 'sakit', 'alpha'].map((status) => {
                                    const isActive = getStatus(siswa.id_siswa) === status;
                                    const colors: any = {
                                        hadir: isActive ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : ' text-slate-500 border-slate-200',
                                        izin: isActive ? 'bg-blue-500 text-white border-blue-500 shadow-md' : ' text-slate-500 border-slate-200',
                                        sakit: isActive ? 'bg-amber-500 text-white border-amber-500 shadow-md' : ' text-slate-500 border-slate-200',
                                        alpha: isActive ? 'bg-rose-500 text-white border-rose-500 shadow-md' : ' text-slate-500 border-slate-200',
                                    };

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => handleStatusChange(siswa.id_siswa, status)}
                                            className={`py-2 px-1 md:px-5 rounded-xl border font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${colors[status]}`}
                                        >
                                            {status}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="h-32 md:h-40 w-full pointer-events-none"></div>

                    {/* --- FLOATING FOOTER (Sama Persis dengan Create) --- */}
                    <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-40">
                        <div className="max-w-4xl mx-auto flex justify-end">
                            <Button 
                                type="submit" 
                                className="w-full md:w-[300px] h-14 rounded-2xl bg-[#F53003] hover:bg-orange-700 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed" 
                                disabled={processing || siswas.length === 0}
                            >
                                <Save className="mr-2 h-5 w-5" /> 
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* MODAL LAPORAN ORTU */}
                {isModalOpen && selectedSiswa && selectedSiswa.laporan_ortu && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className=" rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden bg-white animate-in zoom-in-95">
                            <div className=" p-5 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-xl text-white ${selectedSiswa.laporan_ortu.jenis === 'sakit' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="font-black text-slate-800 leading-none">Laporan {selectedSiswa.laporan_ortu.jenis.toUpperCase()}</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Pesan Wali Murid:</Label>
                                <div className=" border border-slate-200 rounded-2xl p-4 text-sm font-medium italic text-slate-700">
                                    "{selectedSiswa.laporan_ortu.pesan}"
                                </div>
                                {selectedSiswa.laporan_ortu.status_laporan === 'menunggu' ? (
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                        <button 
                                            type="button" 
                                            onClick={() => handleValidasiLaporan(selectedSiswa.laporan_ortu.id_laporan, 'ditolak', selectedSiswa.id_siswa, 'hadir')} 
                                            className="py-3 rounded-xl border-2 border-rose-100 text-rose-600 font-black text-xs uppercase hover:bg-rose-50 transition-all"
                                        >
                                            Tolak
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleValidasiLaporan(selectedSiswa.laporan_ortu.id_laporan, 'diterima', selectedSiswa.id_siswa, selectedSiswa.laporan_ortu.jenis)} 
                                            className="py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase hover:bg-black transition-all"
                                        >
                                            Terima Izin
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-slate-100 text-center">
                                        <p className="text-xs font-black uppercase text-emerald-600 flex items-center justify-center gap-2">
                                            <CheckCircle2 size={16} /> Telah {selectedSiswa.laporan_ortu.status_laporan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}