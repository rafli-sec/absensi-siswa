import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Guru', href: '/admin/guru' },
];

export default function index({ gurus }: { gurus: any[] }) {
    
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data guru ini? Akun login juga akan terhapus.')) {
            router.delete(`/admin/guru/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Guru" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white-800">Manajemen Guru</h1>
                        <p className="text-white-500 text-sm">Kelola data guru dan akun login mereka.</p>
                    </div>
                    <Link
                        href="/admin/guru/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} />
                        Tambah Guru
                    </Link>
                </div>

                <div className=" rounded-lg shadow overflow-hidden border border-white-100">
                    <table className="w-full text-left border-collapse">
                        <thead className=" border-b border-white-200">
                            <tr>
                                <th className="p-4 font-semibold text-white-600">NIP</th>
                                <th className="p-4 font-semibold text-white-600">Nama Guru</th>
                                <th className="p-4 font-semibold text-white-600">Email Login</th>
                                <th className="p-4 font-semibold text-white-600">Mapel</th>
                                <th className="p-4 font-semibold text-white-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white-100">
                            {gurus.length > 0 ? (
                                gurus.map((guru) => (
                                    <tr key={guru.id_guru} className="hover: transition">
                                        <td className="p-4 text-white-700">{guru.nip}</td>
                                        <td className="p-4 font-medium text-white-900">{guru.nama_guru}</td>
                                        <td className="p-4 text-white-600">{guru.user?.email || '-'}</td>
                                        <td className="p-4 text-white-600">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {guru.mapel}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <Link
                                                href={`/admin/guru/${guru.id_guru}/edit`}
                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md transition"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(guru.id_guru)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-white-500">
                                        Belum ada data guru. Silakan tambah data baru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

