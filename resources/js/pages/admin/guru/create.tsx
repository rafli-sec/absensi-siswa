import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Guru', href: '/admin/guru' },
    { title: 'Tambah', href: '#' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        nama_guru: '',
        mapel: '',
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/guru');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Guru" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className=" rounded-lg shadow p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Form Tambah Guru Baru</h2>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Data Guru */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
                                placeholder="198xxxxxxx"
                            />
                            {errors.nip && <div className="text-red-500 text-sm mt-1">{errors.nip}</div>}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.nama_guru}
                                onChange={(e) => setData('nama_guru', e.target.value)}
                                placeholder="S.Pd, M.Pd"
                            />
                            {errors.nama_guru && <div className="text-red-500 text-sm mt-1">{errors.nama_guru}</div>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.mapel}
                                onChange={(e) => setData('mapel', e.target.value)}
                                placeholder="Matematika, Bahasa Indonesia..."
                            />
                            {errors.mapel && <div className="text-red-500 text-sm mt-1">{errors.mapel}</div>}
                        </div>

                        {/* Data Akun Login */}
                        <div className="col-span-2 border-t pt-4 mt-2">
                            <h3 className="text-md font-semibold text-gray-700 mb-4">Informasi Akun Login</h3>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <Link
                                href="/admin/guru"
                                className=" text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

