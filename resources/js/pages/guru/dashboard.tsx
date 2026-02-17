import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Guru',
        href: '/guru/dashboard',
    },
];

export default function GuruDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guru Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Halo Bapak/Ibu Guru! 📚</h1>
                <p className="mt-2">Di sini Anda bisa mengelola absensi siswa dan laporan harian.</p>
            </div>
        </AppLayout>
    );
}

