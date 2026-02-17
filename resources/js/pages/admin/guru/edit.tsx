import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Guru', href: '/admin/guru' },
    { title: 'Edit', href: '#' },
];

export default function Edit({ guru }: { guru: any }) {
    // Inisialisasi form dengan data yang diterima dari controller
    const { data, setData, put, processing, errors } = useForm({
        id_guru: guru.id_guru,
        nip: guru.nip,
        nama_guru: guru.nama_guru,
        mapel: guru.mapel,
        email: guru.user?.email || '', // Ambil dari relasi user
        password: '', // Password kosongkan defaultnya
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.guru.update', { id: guru.id_guru }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Guru" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Edit Data Guru: {guru.nama_guru}</h2>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Data Guru */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
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
                            />
                            {errors.mapel && <div className="text-red-500 text-sm mt-1">{errors.mapel}</div>}
                        </div>

                        {/* Data Akun Login */}
                        <div className="col-span-2 border-t pt-4 mt-2">
                            <h3 className="text-md font-semibold text-gray-700 mb-4">Update Akun Login</h3>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                            <input
                                type="password"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Isi hanya jika ingin mengganti password"
                            />
                            <p className="text-xs text-gray-500 mt-1">*Kosongkan jika tidak ingin mengubah password.</p>
                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <Link
                                href={route('admin.guru.index')}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Update Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

