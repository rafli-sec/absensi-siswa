import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, UserCircle2, BookOpen, Clock, Calendar, AlertCircle, X, FileText, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

// KONSTANTA DATA
const mapelOptions = [
    'Pend. Agama Islam (PAI)',
    'Pend. Agama Kristen (PAK)',
    'Pend. Pancasila',
    'Bhs. Indonesia',
    'Matematika',
    'IPA',
    'IPS',
    'Bhs. Inggris',
    'Seni Budaya',
    'PJOK',
    'Bhs. Daerah',
    'IPA/TIK',
    'Bimbingan Konseling (BK)'
];

// Standar Jam Pelajaran SMP (1-10)
const jamOptions = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Create({ siswas = [], filters, kelasOptions }: any) {
    const { data, setData, post, processing } = useForm({
        kelas: filters.kelas || '',
        tanggal: filters.tanggal || new Date().toISOString().split('T')[0],
        mapel: filters.mapel || '',
        jam_ke: filters.jam_ke || 1,
        absensi: [] as any[]
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState<any>(null);

    // Sinkronisasi data siswa ke state absensi saat list siswa berubah (filter kelas)
    useEffect(() => {
        if (siswas.length > 0) {
            const newAbsensi = siswas.map((s: any) => ({
                id_siswa: s.id_siswa,
                status_kehadiran: s.status_kehadiran || 'hadir'
            }));
            setData('absensi', newAbsensi);
        }
    }, [siswas]);

    // Fungsi untuk reload data berdasarkan filter (Kelas, Mapel, Jam, Tanggal)
    const handleRefreshData = (updates: any) => {
        const newData = { ...data, ...updates };
        router.get(route('guru.absensi.create'), {
            kelas: newData.kelas,
            tanggal: newData.tanggal,
            mapel: newData.mapel,
            jam_ke: newData.jam_ke
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleStatusChange = (id_siswa: number, val: string) => {
        const updatedAbsensi = data.absensi.map((item: any) => 
            item.id_siswa === id_siswa ? { ...item, status_kehadiran: val } : item
        );
        setData('absensi', updatedAbsensi);
    };

    const getStatus = (id_siswa: number) => {
        const item = data.absensi.find((a: any) => a.id_siswa === id_siswa);
        return item?.status_kehadiran || 'hadir';
    };

    // Validasi Laporan dari Orang Tua
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('guru.absensi.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Absen Baru', href: '#' }]}>
            <Head title="Input Absensi" />
            
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                
                {/* CARD HEADER & FILTER */}
                <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                    <CardHeader className="p-5 md:p-6 border-b border-slate-100 bg-white">
                        <CardTitle className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                                <Plus size={20} />
                            </div>
                            Input Absensi Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 md:p-6 bg-slate-50/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {/* SELECT KELAS */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Kelas</Label>
                                <Select onValueChange={(val) => handleRefreshData({ kelas: val })} value={data.kelas}>
                                    <SelectTrigger className="rounded-xl border-slate-200 bg-white h-11">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasOptions.map((k: string) => (
                                            <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* SELECT MAPEL */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pelajaran</Label>
                                <Select onValueChange={(val) => { setData('mapel', val); handleRefreshData({ mapel: val }); }} value={data.mapel}>
                                    <SelectTrigger className="rounded-xl border-slate-200 bg-white h-11">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={14} className="text-slate-400" />
                                            <SelectValue placeholder="Pilih Mapel" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapelOptions.map((m) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* SELECT JAM KE */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jam Ke</Label>
                                <Select 
                                    onValueChange={(val) => { 
                                        const jam = parseInt(val);
                                        setData('jam_ke', jam); 
                                        handleRefreshData({ jam_ke: jam }); 
                                    }} 
                                    value={data.jam_ke?.toString()}
                                >
                                    <SelectTrigger className="rounded-xl border-slate-200 bg-white h-11">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            <SelectValue placeholder="Jam" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jamOptions.map((j) => (
                                            <SelectItem key={j} value={j.toString()}>Ke-{j}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* TANGGAL */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tanggal</Label>
                                <div className="relative">
                                    <Input type="date" value={data.tanggal} onChange={(e) => handleRefreshData({ tanggal: e.target.value })} className="pl-9 rounded-xl h-11 bg-white" />
                                    <Calendar className="absolute left-3 top-3.5 text-slate-400" size={14} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* DAFTAR SISWA */}
                <form onSubmit={handleSubmit} className="space-y-3 relative">
                    {siswas.length > 0 ? (
                        siswas.map((siswa: any, index: number) => (
                            <div key={siswa.id_siswa} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-300 hover:shadow-md">
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
                                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 animate-pulse'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                    }`}
                                                >
                                                    <FileText size={10} />
                                                    {siswa.laporan_ortu.status_laporan === 'menunggu' ? 'Ada Laporan' : 'Laporan ' + siswa.laporan_ortu.status_laporan}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-4 md:flex gap-1.5 md:gap-2 w-full md:w-auto">
                                    {['hadir', 'izin', 'sakit', 'alpha'].map((status) => {
                                        const isActive = getStatus(siswa.id_siswa) === status;
                                        const colorMap: any = {
                                            hadir: isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-500 border-slate-200',
                                            izin: isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-50 text-slate-500 border-slate-200',
                                            sakit: isActive ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-500 border-slate-200',
                                            alpha: isActive ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 text-slate-500 border-slate-200',
                                        };

                                        return (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleStatusChange(siswa.id_siswa, status)}
                                                className={`py-2 px-1 md:px-5 rounded-xl border font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${colorMap[status]}`}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <p className="text-slate-400 font-medium text-sm">Pilih kelas untuk menampilkan daftar siswa.</p>
                        </div>
                    )}

                    <div className="h-32 md:h-40 w-full pointer-events-none"></div>

                    {/* SUBMIT BUTTON */}
                    <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-40">
                        <div className="max-w-4xl mx-auto flex justify-end">
                            <Button 
                                type="submit" 
                                className="w-full md:w-[300px] h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95" 
                                disabled={processing || siswas.length === 0}
                            >
                                <Save className="mr-2 h-5 w-5" /> 
                                {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* MODAL LAPORAN ORTU */}
                {isModalOpen && selectedSiswa && selectedSiswa.laporan_ortu && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
                            <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
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
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium italic">
                                    "{selectedSiswa.laporan_ortu.pesan}"
                                </div>
                                {selectedSiswa.laporan_ortu.status_laporan === 'menunggu' ? (
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                        <button 
                                            type="button" 
                                            onClick={() => handleValidasiLaporan(selectedSiswa.laporan_ortu.id_laporan, 'ditolak', selectedSiswa.id_siswa, 'hadir')} 
                                            className="py-3 rounded-xl border-2 border-rose-100 text-rose-600 font-black text-xs uppercase"
                                        >
                                            Tolak
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleValidasiLaporan(selectedSiswa.laporan_ortu.id_laporan, 'diterima', selectedSiswa.id_siswa, selectedSiswa.laporan_ortu.jenis)} 
                                            className="py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase"
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