import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { 
    User, CreditCard, BookOpen, Phone, MapPin, 
    Save, X, CheckCircle, Users 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Siswa', href: '/admin/siswa' },
    { title: 'Tambah', href: '#' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nis: '',
        nama_siswa: '',
        kelas: '',
        jenis_kelamin: 'laki-laki',
        alamat: '',
        no_hp_ortu: '',
        status: 'aktif',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.siswa.store'));
    };

    const kelasOptions = ['7A', '7B', '7C', '8B', '8B', '8C', '9A'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Siswa" />
            
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header Form */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-500">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="h-6 w-6" />
                            Tambah Siswa Baru
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Lengkapi formulir di bawah ini untuk menambahkan data siswa.</p>
                    </div>

                    <form onSubmit={submit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Kolom Kiri: Data Pribadi */}
                            <div className="space-y-6">
                                <h3 className="text-gray-800 font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                                    <User size={18} className="text-blue-600" /> Data Pribadi
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            placeholder="Nomor Induk Siswa"
                                        />
                                    </div>
                                    {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.nama_siswa}
                                            onChange={(e) => setData('nama_siswa', e.target.value)}
                                            placeholder="Nama Siswa"
                                        />
                                    </div>
                                    {errors.nama_siswa && <p className="text-red-500 text-xs mt-1">{errors.nama_siswa}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users size={18} className="text-gray-400" />
                                        </div>
                                        <select
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.jenis_kelamin}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        >
                                            <option value="laki-laki">Laki-laki</option>
                                            <option value="perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                                </div>
                            </div>

                            {/* Kolom Kanan: Akademik & Kontak */}
                            <div className="space-y-6">
                                <h3 className="text-gray-800 font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                                    <BookOpen size={18} className="text-blue-600" /> Akademik & Kontak
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BookOpen size={18} className="text-gray-400" />
                                        </div>
                                        <select
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.kelas}
                                            onChange={(e) => setData('kelas', e.target.value)}
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {kelasOptions.map((k) => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Orang Tua (WhatsApp)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.no_hp_ortu}
                                            onChange={(e) => setData('no_hp_ortu', e.target.value)}
                                            placeholder="628xxxxxxxxxx"
                                        />
                                    </div>
                                    {errors.no_hp_ortu && <p className="text-red-500 text-xs mt-1">{errors.no_hp_ortu}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Siswa</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CheckCircle size={18} className="text-gray-400" />
                                        </div>
                                        <select
                                            className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="aktif">Aktif</option>
                                            <option value="tidak_aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Alamat Full Width */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <MapPin size={18} className="text-gray-400" />
                                </div>
                                <textarea
                                    className="w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all h-24 pt-2"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
                                />
                            </div>
                            {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={route('admin.siswa.index')}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition-all"
                            >
                                <X size={18} />
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="animate-pulse">Menyimpan...</span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Simpan Data
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}