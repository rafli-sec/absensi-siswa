import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { 
    BookOpen, MapPin, Phone, Mail, CheckCircle2, Users, Award, 
    ShieldCheck, Instagram, Facebook, ArrowRight, Sparkles, 
    Send, AlertCircle, User, MessageSquare, Calendar 
} from 'lucide-react';
import { useEffect, useState, FormEventHandler } from 'react';
import axios from 'axios';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, flash } = usePage().props as any;
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

    // ==========================================
    // LOGIC FORM LAPORAN ORANG TUA
    // ==========================================
    const [showSuccess, setShowSuccess] = useState(false);
    const [daftarSiswa, setDaftarSiswa] = useState<any[]>([]);
    const [isLoadingSiswa, setIsLoadingSiswa] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pengirim: '',
        no_hp_pengirim: '',
        kelas: '',
        id_siswa: '', 
        tanggal_izin: today,
        jenis_laporan: 'izin',
        pesan: '',
    });

    // Menampilkan notifikasi dari flash session (sebagai backup)
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [flash]);

    // Efek: Jika kelas berubah, ambil data siswa dari API
    useEffect(() => {
        if (data.kelas) {
            setIsLoadingSiswa(true);
            setData('id_siswa', ''); 
            
            axios.get(`/api/siswa-by-kelas/${data.kelas}`)
                .then(response => {
                    setDaftarSiswa(response.data);
                    setIsLoadingSiswa(false);
                })
                .catch(error => {
                    console.error("Gagal mengambil data siswa", error);
                    setIsLoadingSiswa(false);
                });
        } else {
            setDaftarSiswa([]);
        }
    }, [data.kelas]);

    // Handler Submit dengan reset & alert dinamis
    const submitLaporan: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('laporan.store'), {
            preserveScroll: true, // Mencegah layar scroll ke atas secara otomatis
            onSuccess: () => {
                // Bersihkan form
                reset(); 
                // Kembalikan ke nilai default
                setData('tanggal_izin', today); 
                setData('jenis_laporan', 'izin'); 
                
                // Munculkan notifikasi sukses
                setShowSuccess(true); 
                setTimeout(() => setShowSuccess(false), 5000);
            },
            onError: () => {
                // Sembunyikan sukses jika ada error validasi
                setShowSuccess(false);
            }
        });
    };
    // ==========================================

    return (
        <>
            <Head title="SMPN 51 Makassar - Cerdas & Berkarakter" />
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-white selection:bg-orange-100 selection:text-orange-900 scroll-smooth">
                
                {/* 1. DYNAMIC HEADER */}
                <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled 
                    ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 dark:bg-black/80 dark:border-zinc-800' 
                    : 'bg-transparent py-5'
                }`}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                            <div className="rounded-xl bg-[#F53003] p-2 text-white shadow-lg shadow-orange-200 transition-transform group-hover:rotate-12 dark:shadow-none">
                                <BookOpen size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-tighter uppercase leading-none">SMPN 51</span>
                                <span className="text-[10px] font-bold text-[#F53003] tracking-widest uppercase">Makassar</span>
                            </div>
                        </div>
                        <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                            {['beranda', 'tentang', 'guru', 'laporan', 'kontak'].map((item) => (
                                <a key={item} href={`#${item}`} className="relative hover:text-[#F53003] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#F53003] after:transition-all hover:after:w-full">
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link href={dashboard()} className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-black dark:bg-white dark:text-black">Dashboard</Link>
                            ) : (
                                <Link href={login()} className="group flex items-center gap-2 rounded-xl bg-[#F53003] px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-orange-200 transition-all hover:scale-105 hover:bg-orange-600 dark:shadow-none uppercase tracking-tighter">
                                    Portal Pegawai <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* 2. HERO SECTION */}
                <section id="beranda" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 lg:flex-row lg:gap-12 lg:px-20">
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
                            Selamat Datang di UPT SPF SMP Negeri 51 Makassar. Kami memadukan nilai karakter dengan inovasi teknologi untuk masa depan gemilang.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                            <a href="#laporan" className="rounded-2xl bg-zinc-900 px-10 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-black dark:bg-white dark:text-black shadow-2xl">Lapor Kehadiran Anak</a>
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
                        <div className="absolute -bottom-8 -left-8 max-w-[260px] rounded-3xl bg-white/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:bg-zinc-900/80 border border-white/20">
                            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#F53003] dark:bg-orange-900/30">
                                <MapPin size={18} />
                            </div>
                            <p className="text-xs font-black leading-relaxed tracking-tight text-slate-800 dark:text-white">Jl. Tamangapa Raya V No.48 C, Makassar</p>
                        </div>
                    </div>
                </section>

                {/* 3. VISI MISI SECTION */}
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
                                    { title: 'Fasilitas Lengkap', desc: 'Laboratorium IPA dan TIK yang mendukung kegiatan praktek siswa.', icon: <Award className="text-purple-500" /> },
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

                {/* 4. TEACHER SECTION */}
                <section id="guru" className="bg-slate-50 py-32 px-6 dark:bg-zinc-950/50">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 sm:text-5xl">Tenaga Pengajar</h2>
                            <p className="mx-auto max-w-2xl text-slate-500 font-medium">Mendidik dengan hati, membentuk karakter generasi bangsa.</p>
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
                    </div>
                </section>

                {/* 5. NEW SECTION: LAPORAN ORANG TUA */}
                <section id="laporan" className="relative py-32 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/50 to-transparent dark:via-orange-950/10" />
                    
                    <div className="relative mx-auto max-w-4xl">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center p-3 bg-orange-100 text-[#F53003] rounded-2xl mb-6 dark:bg-orange-900/30">
                                <MessageSquare size={28} />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 sm:text-5xl">Portal <span className="text-[#F53003]">Laporan</span> Wali</h2>
                            <p className="mx-auto max-w-2xl text-slate-500 font-medium">
                                Beritahukan ketidakhadiran siswa (sakit/izin) secara langsung ke sistem guru agar tercatat otomatis pada rekap kehadiran hari ini.
                            </p>
                        </div>

                        {showSuccess && (
                            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-lg shadow-emerald-100/50 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:shadow-none transition-all duration-500">
                                <div className="bg-emerald-500 p-2 rounded-full text-white">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-800 dark:text-emerald-400 tracking-tight">Laporan Berhasil Terkirim!</h4>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                        Terima kasih. Laporan kehadiran anak Anda telah kami terima dan akan diteruskan ke guru terkait.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submitLaporan} className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                
                                {/* Data Pengirim */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-widest text-slate-800 text-xs border-b-2 border-slate-100 pb-3 flex items-center gap-2 dark:text-slate-200 dark:border-zinc-800">
                                        <User size={16} className="text-blue-500" /> Identitas Pelapor
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Nama Lengkap Anda</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200"
                                            value={data.nama_pengirim}
                                            onChange={e => setData('nama_pengirim', e.target.value)}
                                            placeholder="Contoh: Bpk. Ahmad"
                                            required
                                        />
                                        {errors.nama_pengirim && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2">{errors.nama_pengirim}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Nomor WhatsApp Aktif</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-5 top-4 text-slate-400" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold font-mono text-slate-800 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200"
                                                value={data.no_hp_pengirim}
                                                onChange={e => setData('no_hp_pengirim', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                required
                                            />
                                        </div>
                                        {errors.no_hp_pengirim && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2">{errors.no_hp_pengirim}</p>}
                                    </div>
                                </div>

                                {/* Data Siswa */}
                                <div className="space-y-6">
                                    <h3 className="font-black uppercase tracking-widest text-slate-800 text-xs border-b-2 border-slate-100 pb-3 flex items-center gap-2 dark:text-slate-200 dark:border-zinc-800">
                                        <BookOpen size={16} className="text-[#F53003]" /> Data Siswa
                                    </h3>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Pilih Kelas</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-[#F53003] focus:border-[#F53003] transition-all cursor-pointer appearance-none dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200"
                                            value={data.kelas}
                                            onChange={e => setData('kelas', e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>-- Pilih Kelas Terlebih Dahulu --</option>
                                            {['7A', '7B', '7C', '8A', '8B', '8C', '9A'].map(k => (
                                                <option key={k} value={k}>Kelas {k}</option>
                                            ))}
                                        </select>
                                        {errors.kelas && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2">{errors.kelas}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Nama Siswa</label>
                                        <select
                                            className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-[#F53003] focus:border-[#F53003] transition-all appearance-none dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200 ${!data.kelas || isLoadingSiswa ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            value={data.id_siswa}
                                            onChange={e => setData('id_siswa', e.target.value)}
                                            disabled={!data.kelas || isLoadingSiswa}
                                            required
                                        >
                                            <option value="" disabled>
                                                {isLoadingSiswa ? "Memuat nama siswa..." : 
                                                 !data.kelas ? "Pilih kelas di atas" : "-- Pilih Nama Anak Anda --"}
                                            </option>
                                            {daftarSiswa.map(siswa => (
                                                <option key={siswa.id_siswa} value={siswa.id_siswa}>
                                                    {siswa.nama_siswa}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_siswa && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2">Silakan pilih nama siswa dari daftar.</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Detail Laporan */}
                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Tanggal Berhalangan</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-5 top-4 text-slate-400" />
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200"
                                                value={data.tanggal_izin}
                                                onChange={e => setData('tanggal_izin', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Alasan</label>
                                        <div className="flex gap-3 h-[54px]">
                                            <label className="flex-1 relative cursor-pointer group">
                                                <input type="radio" name="jenis" value="izin" checked={data.jenis_laporan === 'izin'} onChange={e => setData('jenis_laporan', e.target.value)} className="peer sr-only" />
                                                <div className="h-full flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-black text-sm tracking-widest uppercase transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 group-hover:border-blue-200 dark:bg-zinc-950 dark:border-zinc-800 dark:peer-checked:bg-blue-900/20">
                                                    Izin
                                                </div>
                                            </label>
                                            <label className="flex-1 relative cursor-pointer group">
                                                <input type="radio" name="jenis" value="sakit" checked={data.jenis_laporan === 'sakit'} onChange={e => setData('jenis_laporan', e.target.value)} className="peer sr-only" />
                                                <div className="h-full flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-black text-sm tracking-widest uppercase transition-all peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-600 group-hover:border-amber-200 dark:bg-zinc-950 dark:border-zinc-800 dark:peer-checked:bg-amber-900/20">
                                                    Sakit
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Keterangan Tambahan</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] dark:bg-zinc-950 dark:border-zinc-800 dark:text-slate-200"
                                        value={data.pesan}
                                        onChange={e => setData('pesan', e.target.value)}
                                        placeholder="Contoh: Anak saya sedang demam tinggi, mohon izin tidak bisa mengikuti pelajaran hari ini."
                                        required
                                    />
                                    {errors.pesan && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2">{errors.pesan}</p>}
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col items-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto px-12 py-5 bg-[#F53003] hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 dark:shadow-none"
                                >
                                    {processing ? (
                                        <span className="animate-pulse flex items-center gap-2">MENGIRIM LAPORAN...</span>
                                    ) : (
                                        <><Send size={20} /> KIRIM LAPORAN SEKARANG</>
                                    )}
                                </button>
                                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 text-center">
                                    <AlertCircle size={14} className="text-amber-500" /> 
                                    Laporan akan langsung terhubung ke sistem absensi guru yang bertugas.
                                </p>
                            </div>
                        </form>
                    </div>
                </section>

                {/* 6. MODERN FOOTER */}
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
                                Alamat: Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235.
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
                                    <span className="text-sm font-bold">0852-5590-0533</span>
                                </div>
                                <div className="flex gap-4">
                                    <Mail size={18} className="text-slate-500" />
                                    <span className="text-[11px] font-bold break-all">uptspfsmpn51makassar@gmail.com</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-orange-500">Tahun Pelajaran</h4>
                            <div className="rounded-2xl bg-zinc-800/50 p-6 border border-zinc-700/50">
                                <p className="text-sm font-black">GENAP 2025-2026</p>
                                <p className="mt-2 text-[10px] font-bold text-slate-500 italic uppercase leading-tight">Mulai: 05 Jan 2026</p>
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