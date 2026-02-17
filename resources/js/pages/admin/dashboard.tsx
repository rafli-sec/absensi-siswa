import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Halo Admin! 👋</h1>
                <p className="mt-2">Selamat datang di Sistem SIKAPDIK. Anda punya akses penuh untuk mengelola data guru.</p>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-500 p-4 text-white rounded-lg shadow">
                        Total Guru: 4.000
                    </div>
                    {/* Tambahkan statistik lainnya */}
                </div>
            </div>
        </AppLayout>
    );
}

