import { Link, usePage } from '@inertiajs/react'; // Tambah usePage
import { BookOpen, Folder, LayoutGrid, Users, ClipboardCheck, PhoneCall, MessageCircleCodeIcon } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

export function AppSidebar() {
    // Ambil data user dari props global Inertia
    const { auth } = usePage().props as any;
    const userRole = auth.user.role;

    // 1. Definisikan semua menu yang mungkin ada
    const allNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: userRole === 'admin' ? '/admin/dashboard' : '/guru/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Manajemen Guru',
            href: '/admin/guru',
            icon: Users,
            role: 'admin',
        },
        {
            title: 'Siswa',
            href: '/admin/siswa',
            icon: Users,
            role: 'admin',
        },
        {
            title: 'Absensi Siswa',
            href: '/guru/absensi',
            icon: ClipboardCheck,
            role: 'guru', 
        },
        {
            title: 'Log WhatsApp',
            href: '/whatsapp-monitoring', 
            icon: MessageCircleCodeIcon,
        },
    ];

    // 2. Filter menu berdasarkan role user yang sedang login
    const filteredNavItems = allNavItems.filter((item) => {
        // Jika item tidak punya property role, tampilkan untuk semua
        if (!item.role) return true;
        // Jika ada property role, cek apakah cocok dengan role user
        return item.role === userRole;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={userRole === 'admin' ? '/admin/dashboard' : '/guru/dashboard'}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Kirim menu yang sudah difilter ke NavMain */}
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
