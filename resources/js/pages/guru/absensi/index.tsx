import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Pencil, Trash2, Plus, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/guru/dashboard' },
    { title: 'Riwayat Absensi', href: '/guru/absensi' },
];

export default function index({ rekapAbsensi = [], filters }: any) {
    const handleDelete = (kelas: string, tanggal: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus absensi Kelas ${kelas} pada tanggal ${tanggal}?`)) {
            router.delete(route('guru.absensi.destroy', { kelas, tanggal }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Riwayat Absensi</h1>
                        <p className="text-gray-500 text-sm">Daftar absensi yang telah Anda buat.</p>
                    </div>
                    <Link
                        href="/guru/absensi/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} />
                        Absen Baru
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Tanggal</th>
                                <th className="p-4 font-semibold text-gray-600">Kelas</th>
                                <th className="p-4 font-semibold text-gray-600">Hadir</th>
                                <th className="p-4 font-semibold text-gray-600">Absen</th>
                                <th className="p-4 font-semibold text-gray-600">Total</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rekapAbsensi.length > 0 ? (
                                rekapAbsensi.map((rekap: any) => (
                                    <tr key={`${rekap.kelas}-${filters.tanggal}`} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-700">{filters.tanggal}</td>
                                        <td className="p-4 font-medium text-gray-900">Kelas {rekap.kelas}</td>
                                        <td className="p-4 text-green-600">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                                                <CheckCircle size={12} />
                                                {rekap.hadir}
                                            </span>
                                        </td>
                                        <td className="p-4 text-red-600">
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                                                <XCircle size={12} />
                                                {rekap.tidak_hadir}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                                                <Users size={12} />
                                                {rekap.total_siswa}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <Link
                                                href={route('guru.absensi.edit', { kelas: rekap.kelas, tanggal: filters.tanggal })}
                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md transition"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(rekap.kelas, filters.tanggal)}
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
                                    <td colSpan={6} className="p-6 text-center text-gray-500">
                                        Belum ada data absensi. Silakan buat absensi baru.
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

