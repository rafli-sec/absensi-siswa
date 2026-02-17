// resources/js/Pages/guru/absensi/create.tsx
import { Head, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, UserCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Create({ siswas = [], filters, kelasOptions }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kelas: filters.kelas || '',
        tanggal: filters.tanggal || '',
        absensi: [] as any[]
    });

    // Update absensi array when siswas data changes
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

    const handleSelectKelas = (val: string) => {
        setData('kelas', val);
        // Use Inertia visit for proper navigation
        router.visit(route('guru.absensi.create') + `?kelas=${val}&tanggal=${data.tanggal}`, {
            method: 'get',
            replace: true
        });
    };

    const handleStatusChange = (id_siswa: number, val: string) => {
        setData('absensi', data.absensi.map((item: any) => 
            item.id_siswa === id_siswa ? { ...item, status_kehadiran: val } : item
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug: log the data being sent
        console.log('Submitting data:', JSON.stringify({
            kelas: data.kelas,
            tanggal: data.tanggal,
            absensi: data.absensi
        }, null, 2));
        
        post(route('guru.absensi.store'), {
            onSuccess: () => {
                console.log('Success! Redirecting...');
                router.visit(route('guru.absensi.index'));
            },
            onError: (err) => {
                console.log('Error:', err);
                alert('Error: ' + JSON.stringify(err));
            }
        });
    };

    // Get current status for a student
    const getStatus = (id_siswa: number) => {
        const item = data.absensi.find((a: any) => a.id_siswa === id_siswa);
        return item?.status_kehadiran || 'hadir';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Absen Baru', href: '#' }]}>
            <Head title="Input Absensi" />
            <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
                <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="bg-slate-50/50 p-6 rounded-t-2xl">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <Plus className="text-blue-600" /> Input Absensi Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Pilih Kelas</Label>
                            <Select 
                                onValueChange={handleSelectKelas} 
                                value={data.kelas}
                            >
                                <SelectTrigger className="rounded-xl bg-white">
                                    <SelectValue placeholder="Pilih Kelas Siswa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelasOptions.map((k: string) => (
                                        <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal</Label>
                            <Input 
                                type="date" 
                                value={data.tanggal} 
                                onChange={(e) => setData('tanggal', e.target.value)} 
                                className="rounded-xl" 
                            />
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-4 pb-20">
                    {/* Hidden inputs to ensure kelas is submitted */}
                    <input type="hidden" name="kelas" value={data.kelas} />
                    
                    {siswas.length > 0 ? siswas.map((siswa: any, index: number) => (
                        <Card key={siswa.id_siswa} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                        <UserCircle2 size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{index + 1}. {siswa.nama_siswa}</p>
                                        <p className="text-xs text-slate-400 font-mono">NIS: {siswa.nis}</p>
                                    </div>
                                </div>
                                
                                {/* Simple radio buttons using standard HTML */}
                                <div className="flex gap-2">
                                    {['hadir', 'izin', 'sakit', 'alpha'].map((status) => (
                                        <label 
                                            key={status}
                                            className={`flex-1 text-center py-2 px-3 rounded-lg border cursor-pointer transition-all ${
                                                getStatus(siswa.id_siswa) === status
                                                    ? 'bg-blue-100 border-blue-300 text-blue-700 font-semibold'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`absensi[${index}][status_kehadiran]`}
                                                value={status}
                                                checked={getStatus(siswa.id_siswa) === status}
                                                onChange={() => handleStatusChange(siswa.id_siswa, status)}
                                                className="sr-only"
                                            />
                                            <input type="hidden" name={`absensi[${index}][id_siswa]`} value={siswa.id_siswa} />
                                            <span className="text-xs font-bold uppercase">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )) : data.kelas ? (
                        <p className="text-center py-10 text-slate-400 italic">Belum ada data siswa di kelas ini.</p>
                    ) : (
                        <p className="text-center py-10 text-slate-400 italic">Silakan pilih kelas terlebih dahulu.</p>
                    )}

                    {errors.absensi && (
                        <p className="text-red-500 text-sm">{errors.absensi}</p>
                    )}
                    {errors.kelas && (
                        <p className="text-red-500 text-sm">{errors.kelas}</p>
                    )}

                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl">
                        <Button 
                            type="submit" 
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl text-lg font-bold" 
                            disabled={processing || siswas.length === 0}
                        >
                            <Save className="mr-2" /> 
                            {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

