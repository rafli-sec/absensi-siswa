import { Head, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, UserCircle2, BookOpen, Clock, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Create({ siswas = [], filters, kelasOptions }: any) {
    const { data, setData, post, processing, errors } = useForm({
        kelas: filters.kelas || '',
        tanggal: filters.tanggal || '',
        mapel: filters.mapel || '', // Mapel baru
        jam_ke: filters.jam_ke || 1, // Jam pelajaran baru
        absensi: [] as any[]
    });

    // Sinkronisasi data siswa ke array absensi form
    useEffect(() => {
        if (siswas.length > 0) {
            const newAbsensi = siswas.map((s: any) => ({
                id_siswa: s.id_siswa,
                status_kehadiran: s.status_kehadiran || 'hadir'
            }));
            setData('absensi', newAbsensi);
        } else {
            setData('absensi', []);
        }
    }, [siswas]);

    // Fungsi refresh untuk mengambil data siswa (Triggered by Kelas, Mapel, or Jam)
    const handleRefreshData = (updates: any) => {
        const newData = { ...data, ...updates };
        router.get(route('guru.absensi.create'), {
            kelas: newData.kelas,
            tanggal: newData.tanggal,
            mapel: newData.mapel,
            jam_ke: newData.jam_ke
        }, { preserveState: true });
    };

    const handleStatusChange = (id_siswa: number, val: string) => {
        setData('absensi', data.absensi.map((item: any) => 
            item.id_siswa === id_siswa ? { ...item, status_kehadiran: val } : item
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('guru.absensi.store'));
    };

    const getStatus = (id_siswa: number) => {
        const item = data.absensi.find((a: any) => a.id_siswa === id_siswa);
        return item?.status_kehadiran || 'hadir';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Absen Baru', href: '#' }]}>
            <Head title="Input Absensi" />
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24">
                
                {/* Bagian Pengaturan Utama */}
                <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className=" p-6 border-b border-slate-100">
                        <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <Plus size={20} />
                            </div>
                            Input Absensi Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Input Kelas */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Kelas</Label>
                                <Select 
                                    onValueChange={(val) => {
                                        setData('kelas', val);
                                        handleRefreshData({ kelas: val });
                                    }} 
                                    value={data.kelas}
                                >
                                    <SelectTrigger className="rounded-xl  border-slate-200">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasOptions.map((k: string) => (
                                            <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kelas && <p className="text-xs text-red-500">{errors.kelas}</p>}
                            </div>

                            {/* Input Mapel */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mata Pelajaran</Label>
                                <div className="relative">
                                    <Input 
                                        placeholder="Contoh: Matematika"
                                        className="pl-9 rounded-xl"
                                        value={data.mapel}
                                        onChange={(e) => setData('mapel', e.target.value)}
                                        onBlur={() => handleRefreshData({ mapel: data.mapel })}
                                    />
                                    <BookOpen className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                </div>
                                {errors.mapel && <p className="text-xs text-red-500">{errors.mapel}</p>}
                            </div>

                            {/* Input Jam Ke */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Jam Ke</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        className="pl-9 rounded-xl"
                                        value={data.jam_ke}
                                        onChange={(e) => setData('jam_ke', parseInt(e.target.value))}
                                        onBlur={() => handleRefreshData({ jam_ke: data.jam_ke })}
                                    />
                                    <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                </div>
                                {errors.jam_ke && <p className="text-xs text-red-500">{errors.jam_ke}</p>}
                            </div>

                            {/* Input Tanggal */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</Label>
                                <div className="relative">
                                    <Input 
                                        type="date" 
                                        value={data.tanggal} 
                                        onChange={(e) => setData('tanggal', e.target.value)} 
                                        className="pl-9 rounded-xl" 
                                    />
                                    <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                </div>
                                {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Daftar Siswa */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {siswas.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {siswas.map((siswa: any, index: number) => (
                                <Card key={siswa.id_siswa} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-slate-300 has-[:checked]:border-l-blue-600">
                                    <div className="p-4 md:flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 transition-colors">
                                                <UserCircle2 size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 tracking-tight">{index + 1}. {siswa.nama_siswa}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">NIS: {siswa.nis}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Kontrol Status Kehadiran */}
                                        <div className="flex gap-2 w-full md:w-auto">
                                            {['hadir', 'izin', 'sakit', 'alpha'].map((status) => {
                                                const isActive = getStatus(siswa.id_siswa) === status;
                                                const colorMap: any = {
                                                    hadir: 'peer-checked:bg-emerald-100 peer-checked:text-emerald-700 peer-checked:border-emerald-200',
                                                    izin: 'peer-checked:bg-blue-100 peer-checked:text-blue-700 peer-checked:border-blue-200',
                                                    sakit: 'peer-checked:bg-amber-100 peer-checked:text-amber-700 peer-checked:border-amber-200',
                                                    alpha: 'peer-checked:bg-rose-100 peer-checked:text-rose-700 peer-checked:border-rose-200',
                                                };

                                                return (
                                                    <label key={status} className="flex-1 md:flex-none cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name={`absensi-${siswa.id_siswa}`}
                                                            value={status}
                                                            checked={isActive}
                                                            onChange={() => handleStatusChange(siswa.id_siswa, status)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className={`text-center py-2 px-3 md:px-5 rounded-xl border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest transition-all  hover:bg-slate-50 ${colorMap[status]}`}>
                                                            {status}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center  rounded-3xl border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 italic">
                                {data.kelas ? 'Tidak ada data siswa aktif di kelas ini.' : 'Silakan pilih kelas, mapel, dan jam untuk memulai.'}
                            </p>
                        </div>
                    )}

                    {/* Submit Bar (Fixed Bottom) */}
                    <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 /80 backdrop-blur-md border-t border-slate-200 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                        <div className="max-w-5xl mx-auto flex justify-between items-center">
                            <div className="hidden lg:block">
                                <p className="text-sm font-bold text-slate-700 uppercase">Sesi: {data.mapel || '...'} (Jam {data.jam_ke})</p>
                                <p className="text-xs text-slate-400">Pastikan data sudah benar sebelum menyimpan.</p>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full md:w-[300px] h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 text-md font-black uppercase tracking-tighter" 
                                disabled={processing || siswas.length === 0}
                            >
                                <Save className="mr-2 h-5 w-5" /> 
                                {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}