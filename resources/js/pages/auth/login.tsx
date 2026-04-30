import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { BookOpen, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Log in — SMPN 51 Makassar" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-white selection:bg-orange-100 selection:text-orange-900">

                {/* DYNAMIC HEADER */}
                <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 dark:bg-black/80 dark:border-zinc-800'
                    : 'bg-transparent py-5'
                }`}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="rounded-xl bg-[#F53003] p-2 text-white shadow-lg shadow-orange-200 transition-transform group-hover:rotate-12 dark:shadow-none">
                                <BookOpen size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-tighter uppercase leading-none">SMPN 51</span>
                                <span className="text-[10px] font-bold text-[#F53003] tracking-widest uppercase">Makassar</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">
                            <ShieldCheck size={14} className="text-[#F53003]" />
                            Portal Pegawai
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="relative flex min-h-screen flex-col lg:flex-row">

                    {/* LEFT PANEL — Branding */}
                    <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-zinc-900 dark:bg-black px-16">
                        {/* Decorative blobs */}
                        <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-[#F53003]/20 blur-[100px]" />
                        <div className="absolute bottom-1/3 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-[80px]" />

                        {/* Top-left accent line */}
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#F53003] via-orange-400 to-transparent" />

                        {/* Watermark grid */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="grid grid-cols-8 gap-4 p-6 uppercase font-black text-white">
                                {Array(64).fill('SMP51').map((t, i) => (
                                    <span key={i} className="text-[7px]">{t}</span>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 max-w-md text-white">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 backdrop-blur">
                                <Sparkles size={12} className="animate-pulse" /> NPSN: 69988076
                            </div>
                            <h1 className="mb-6 text-5xl font-black leading-[1] tracking-tighter xl:text-7xl">
                                Selamat<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F53003] to-orange-400">
                                    Datang
                                </span>
                                <br />Kembali.
                            </h1>
                            <p className="mb-12 text-base font-medium leading-relaxed text-zinc-400">
                                Masuk ke sistem manajemen internal UPT SPF SMP Negeri 51 Makassar. Kelola data absensi, laporan, dan informasi siswa.
                            </p>

                            {/* Stats row */}
                            <div className="flex gap-8">
                                {[
                                    { label: 'Guru Aktif', value: '18' },
                                    { label: 'Kelas', value: '7' },
                                    { label: 'T.A.', value: '2025/26' },
                                ].map((stat, i) => (
                                    <div key={i} className="border-l-2 border-zinc-700 pl-4 first:border-l-0 first:pl-0">
                                        <p className="text-2xl font-black leading-none text-white">{stat.value}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom badge */}
                        <div className="absolute bottom-10 left-16 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-800/50 px-5 py-3 backdrop-blur">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                Sistem Aktif · Semester Genap 2025-2026
                            </span>
                        </div>
                    </div>

                    {/* RIGHT PANEL — Login Form */}
                    <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-32 lg:px-16 xl:px-24">
                        {/* Subtle background blobs */}
                        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-orange-50/80 blur-[80px] dark:bg-orange-900/10" />

                        <div className="relative w-full max-w-md">
                            {/* Mobile logo */}
                            <div className="mb-10 flex items-center gap-3 lg:hidden">
                                <div className="rounded-xl bg-[#F53003] p-2 text-white shadow-lg shadow-orange-200">
                                    <BookOpen size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tighter uppercase leading-none">SMPN 51</p>
                                    <p className="text-[10px] font-bold text-[#F53003] tracking-widest uppercase">Makassar</p>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="mb-10">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F53003] dark:bg-orange-900/20">
                                    <ShieldCheck size={12} /> Portal Pegawai
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter leading-none mb-3">
                                    Masuk ke<br />
                                    <span className="text-[#F53003]">Akun Anda</span>
                                </h2>
                                <p className="text-sm font-medium text-slate-400 dark:text-zinc-500">
                                    Gunakan email dan password yang terdaftar di sistem.
                                </p>
                            </div>

                            {/* Status message */}
                            {status && (
                                <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-4 text-sm font-bold text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400">
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-0"
                            >
                                {({ processing, errors }) => (
                                    <div className="space-y-5">

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 mb-2"
                                            >
                                                Alamat Email
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400 focus:border-[#F53003] focus:ring-[#F53003] dark:bg-zinc-900 dark:border-zinc-700 dark:text-white h-auto"
                                            />
                                            <InputError message={errors.email} className="mt-2 text-[10px] font-bold uppercase text-rose-500" />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label
                                                    htmlFor="password"
                                                    className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400"
                                                >
                                                    Password
                                                </label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-[10px] font-black uppercase tracking-widest text-[#F53003] hover:text-orange-600 transition-colors"
                                                        tabIndex={5}
                                                    >
                                                        Lupa Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400 focus:border-[#F53003] focus:ring-[#F53003] dark:bg-zinc-900 dark:border-zinc-700 dark:text-white h-auto"
                                            />
                                            <InputError message={errors.password} className="mt-2 text-[10px] font-bold uppercase text-rose-500" />
                                        </div>

                                        {/* Remember me */}
                                        <div className="flex items-center gap-3 pt-1">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="rounded-lg border-slate-300 data-[state=checked]:bg-[#F53003] data-[state=checked]:border-[#F53003]"
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-400 cursor-pointer select-none"
                                            >
                                                Ingat Saya
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                                className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#F53003] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200 transition-all hover:bg-orange-600 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed dark:shadow-none"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <Spinner className="h-4 w-4" />
                                                        Memproses...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Masuk Sekarang
                                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Register link */}
                                        {/* {canRegister && (
                                            <p className="text-center text-[11px] font-bold text-slate-400 dark:text-zinc-500 pt-2">
                                                Belum punya akun?{' '}
                                                <TextLink
                                                    href={register()}
                                                    tabIndex={5}
                                                    className="font-black text-[#F53003] hover:text-orange-600 uppercase tracking-widest transition-colors"
                                                >
                                                    Daftar
                                                </TextLink>
                                            </p>
                                        )} */}
                                    </div>
                                )}
                            </Form>

                            {/* Footer note */}
                            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-zinc-800">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">
                                    © 2026 UPT SPF SMP Negeri 51 Makassar
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}