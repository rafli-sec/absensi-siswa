import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { BookOpen, MapPin, Phone, Mail, CheckCircle2, Users, Award, ShieldCheck, Instagram, Facebook, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [scrolled, setScrolled] = useState(false);

    // Efek deteksi scroll untuk header dinamis
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Data Guru sesuai Roster Genap 2026 
    const listGuru = [
        { nama: 'Haerani, S.Pd., M.Pd.', mapel: 'Kepala Sekolah / IPA', initial: 'H' },
        { nama: 'Sukaeni, S.Pd.I., M.Pd', mapel: 'PAI', initial: 'S' },
        { nama: 'Heri Purwono, S.Pd.', mapel: 'IPS', initial: 'H' },
        { nama: 'Andysar Rahmat Pratama, S.Pd', mapel: 'Bhs. Indonesia', initial: 'A' },
        { nama: 'Nur Rezky, S.Pd., M.Pd. Gr', mapel: 'PJOK', initial: 'N' },
        { nama: 'Sunniati, S.Pd., M.Pd, Gr', mapel: 'Pend. Pancasila', initial: 'S' },
    ];

    return (
        <>
            <Head title="SMPN 51 Makassar - Cerdas & Berkarakter" />
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-white selection:bg-orange-100 selection:text-orange-900 scroll-smooth">
                
                {/* 1. DYNAMIC HEADER */}
                <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled 
                    ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/50 py-3 dark:bg-black/70 dark:border-zinc-800' 
                    : 'bg-transparent py-5'
                }`}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="rounded-xl bg-[#F53003] p-2 text-white shadow-lg shadow-orange-200 transition-transform group-hover:rotate-12 dark:shadow-none">
                                <BookOpen size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-tighter uppercase leading-none">SMPN 51</span>
                                <span className="text-[10px] font-bold text-[#F53003] tracking-widest uppercase">Makassar</span>
                            </div>
                        </div>
                        <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                            {['beranda', 'tentang', 'guru', 'kontak'].map((item) => (
                                <a key={item} href={`#${item}`} className="relative hover:text-[#F53003] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#F53003] after:transition-all hover:after:w-full">
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={dashboard()} className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-black dark:bg-white dark:text-black">Dashboard</Link>
                            ) : (
                                <Link href={login()} className="group flex items-center gap-2 rounded-xl bg-[#F53003] px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-orange-200 transition-all hover:scale-105 hover:bg-orange-600 dark:shadow-none uppercase tracking-tighter">
                                    Portal Guru <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* 2. HERO SECTION WITH ANIMATED SHAPES */}
                <section id="beranda" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 lg:flex-row lg:gap-12 lg:px-20">
                    {/* Background Glows */}
                    <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-orange-100/50 blur-[100px] dark:bg-orange-900/10" />
                    <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-blue-100/50 blur-[100px] dark:bg-blue-900/10" />

                    <div className="relative z-10 max-w-2xl text-center lg:text-left animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 border border-orange-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F53003] shadow-sm backdrop-blur dark:bg-zinc-900 dark:border-zinc-800">
                            <Sparkles size={14} className="animate-pulse" /> NPSN: 69988076
                        </div>
                        <h1 className="mb-8 text-5xl font-black leading-[1] tracking-tighter sm:text-7xl lg:text-8xl">
                            Mencetak <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F53003] to-orange-400">Generasi Hebat</span>.
                        </h1>
                        <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-500 dark:text-zinc-400">
                            Selamat Datang di UPT SPF SMP Negeri 51 Makassar. Kami memadukan nilai karakter dengan inovasi teknologi untuk masa depan gemilang[cite: 3, 5].
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                            <a href="#tentang" className="rounded-2xl bg-zinc-900 px-10 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-black dark:bg-white dark:text-black shadow-2xl">Jelajahi Program</a>
                            <div className="flex items-center gap-4 px-6 py-2 border-l-2 border-slate-200 dark:border-zinc-800 text-left">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 dark:bg-emerald-950/30">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-none">18+</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Guru Profesional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Element: Floating Image/Icon */}
                    <div className="relative mt-16 w-full max-w-md lg:mt-0 lg:max-w-xl animate-in zoom-in duration-1000">
                        <div className="relative aspect-square rounded-[4rem] bg-gradient-to-br from-orange-50 to-white p-12 dark:from-zinc-900 dark:to-zinc-950 shadow-inner overflow-hidden animate-floating">
                             <div className="absolute inset-0 opacity-10 dark:opacity-5">
                                <div className="grid grid-cols-6 gap-4 p-4 uppercase font-black text-orange-900">
                                    {Array(36).fill('SMP51').map((t, i) => <span key={i} className="text-[8px]">{t}</span>)}
                                </div>
                             </div>
                            <div className="relative h-full w-full rounded-[3rem] border-8 border-white bg-white/50 backdrop-blur shadow-2xl dark:border-zinc-800 dark:bg-black/20 flex items-center justify-center">
                                <BookOpen size={160} strokeWidth={0.5} className="text-[#F53003] drop-shadow-2xl" />
                            </div>
                        </div>
                        {/* Alamat Card with Glassmorphism */}
                        <div className="absolute -bottom-8 -left-8 max-w-[260px] rounded-3xl bg-white/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:bg-zinc-900/80 border border-white/20">
                            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#F53003] dark:bg-orange-900/30">
                                <MapPin size={18} />
                            </div>
                            <p className="text-xs font-black leading-relaxed tracking-tight text-slate-800 dark:text-white">Jl. Tamangapa Raya V No.48 C, Makassar [cite: 3]</p>
                        </div>
                    </div>
                </section>

                {/* 3. VISI MISI WITH CARD HOVERS */}
                <section id="tentang" className="relative py-32 px-6">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-1 py-10">
                                <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter leading-none">Visi <br /><span className="text-[#F53003]">Utama</span> Kami</h2>
                                <p className="text-lg font-medium leading-relaxed italic text-slate-500 dark:text-zinc-400">
                                    "Sekolah unggul dalam prestasi, berkarakter, dan berbudaya lingkungan."
                                </p>
                            </div>
                            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
                                {[
                                    { title: 'Inovasi Digital', desc: 'Sistem absensi WhatsApp terintegrasi memudahkan pantauan wali murid.', icon: <Sparkles className="text-orange-500" /> },
                                    { title: 'Karakter Unggul', desc: 'Menanamkan nilai budi pekerti luhur berlandaskan IMTAK dan IPTEK.', icon: <ShieldCheck className="text-emerald-500" /> },
                                    { title: 'Kurikulum Modern', desc: 'Implementasi Kurikulum Merdeka untuk eksplorasi minat dan bakat siswa.', icon: <CheckCircle2 className="text-blue-500" /> },
                                    { title: 'Fasilitas Lengkap', desc: 'Laboratorium IPA dan TIK yang mendukung kegiatan praktek siswa[cite: 67, 70].', icon: <Award className="text-purple-500" /> },
                                ].map((feature, i) => (
                                    <div key={i} className="group rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-zinc-900 dark:border-zinc-800">
                                        <div className="mb-4 h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center dark:bg-black group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mb-2 font-black uppercase tracking-tighter text-sm">{feature.title}</h3>
                                        <p className="text-xs leading-relaxed text-slate-400 font-medium">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. TEACHER SECTION WITH AVATARS  */}
                <section id="guru" className="bg-slate-50 py-32 px-6 dark:bg-zinc-950/50">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 sm:text-5xl">Tenaga Pengajar Profesional</h2>
                            <p className="mx-auto max-w-2xl text-slate-500 font-medium">Bekerja di bawah kepemimpinan Haerani, S.Pd., M.Pd., mendidik dengan hati[cite: 28].</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {listGuru.map((guru, idx) => (
                                <div key={idx} className="group relative rounded-[2.5rem] border border-white bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-2xl dark:bg-zinc-900 dark:border-zinc-800">
                                    <div className="flex items-center gap-5">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#F53003] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-200 dark:shadow-none">
                                            {guru.initial}
                                        </div>
                                        <div>
                                            <h3 className="font-black tracking-tight text-sm mb-1 group-hover:text-[#F53003] transition-colors">{guru.nama}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{guru.mapel}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                             <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#F53003] transition-colors underline underline-offset-8">Lihat Seluruh Staff Pengajar</button>
                        </div>
                    </div>
                </section>

                {/* 5. MODERN FOOTER */}
                <footer id="kontak" className="relative overflow-hidden bg-zinc-900 pt-32 pb-12 text-white dark:bg-black">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#F53003] via-orange-400 to-[#F53003]" />
                    <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="rounded-xl bg-[#F53003] p-2">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase">SMPN 51 Makassar</span>
                            </div>
                            <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-400">
                                Alamat: Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235[cite: 3].
                            </p>
                            <div className="mt-10 flex gap-4">
                                {[Instagram, Facebook].map((Icon, i) => (
                                    <a key={i} href="#" className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center transition-all hover:bg-[#F53003] hover:-translate-y-1">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-orange-500">Hubungi Kami</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <Phone size={18} className="text-slate-500" />
                                    <span className="text-sm font-bold">0852-5590-0533 [cite: 4]</span>
                                </div>
                                <div className="flex gap-4">
                                    <Mail size={18} className="text-slate-500" />
                                    <span className="text-[11px] font-bold break-all">uptspfsmpn51makassar@gmail.com [cite: 4]</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-orange-500">Tahun Pelajaran</h4>
                            <div className="rounded-2xl bg-zinc-800/50 p-6 border border-zinc-700/50">
                                <p className="text-sm font-black">GENAP 2025-2026</p>
                                <p className="mt-2 text-[10px] font-bold text-slate-500 italic uppercase leading-tight">Mulai: 05 Jan 2026 [cite: 97]</p>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-6xl mt-32 pt-8 border-t border-zinc-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">© 2026 UPT SPF SMP NEGERI 51 MAKASSAR</p>
                    </div>
                </footer>

            </div>

            {/* Custom Floating Styles */}
            <style>{`
                @keyframes floating {
                    0% { transform: translateY(0px) rotate(3deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(3deg); }
                }
                .animate-floating {
                    animation: floating 6s ease-in-out infinite;
                }
                html { scroll-behavior: smooth; }
            `}</style>
        </>
    );
}