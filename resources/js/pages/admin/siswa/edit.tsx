import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Siswa', href: '/admin/siswa' },
    { title: 'Edit', href: '#' },
];

export default function Edit({ siswa }: { siswa: any }) {
    const { data, setData, put, processing, errors } = useForm({
        nis: siswa.nis,
        nama_siswa: siswa.nama_siswa,
        kelas: siswa.kelas,
        jenis_kelamin: siswa.jenis_kelamin || 'laki-laki',
        alamat: siswa.alamat || '',
        no_hp_ortu: siswa.no_hp_ortu,
        status: siswa.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.siswa.update', siswa.id_siswa));
    };

    const kelasOptions = ['7A', '7B', '8A', '8B', '9A', '9B'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Siswa" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mx-auto w-full max-w-4xl">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Data Siswa</CardTitle>
                                <CardDescription>
                                    Perbarui informasi data diri dan akademik siswa.
                                </CardDescription>
                            </CardHeader>
                            <Separator className="mb-6" />
                            
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                {/* Kolom Kiri */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nis">NIS</Label>
                                        <Input
                                            id="nis"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            // Biasanya NIS tidak boleh diedit sembarangan, bisa ditambah disabled
                                        />
                                        {errors.nis && <p className="text-sm text-red-500">{errors.nis}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nama_siswa">Nama Lengkap</Label>
                                        <Input
                                            id="nama_siswa"
                                            value={data.nama_siswa}
                                            onChange={(e) => setData('nama_siswa', e.target.value)}
                                        />
                                        {errors.nama_siswa && <p className="text-sm text-red-500">{errors.nama_siswa}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin</Label>
                                        <Select 
                                            value={data.jenis_kelamin} 
                                            onValueChange={(val) => setData('jenis_kelamin', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Kelas</Label>
                                        <Select 
                                            value={data.kelas} 
                                            onValueChange={(val) => setData('kelas', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kelas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kelasOptions.map((k) => (
                                                    <SelectItem key={k} value={k}>{k}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.kelas && <p className="text-sm text-red-500">{errors.kelas}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_hp_ortu">No. HP Orang Tua</Label>
                                        <Input
                                            id="no_hp_ortu"
                                            value={data.no_hp_ortu}
                                            onChange={(e) => setData('no_hp_ortu', e.target.value)}
                                        />
                                        {errors.no_hp_ortu && <p className="text-sm text-red-500">{errors.no_hp_ortu}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select 
                                            value={data.status} 
                                            onValueChange={(val) => setData('status', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">Aktif</SelectItem>
                                                <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                    </div>
                                </div>

                                {/* Full Width Alamat */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                                    <Textarea
                                        id="alamat"
                                        className="min-h-[100px]"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                    />
                                    {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.siswa.index')}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}