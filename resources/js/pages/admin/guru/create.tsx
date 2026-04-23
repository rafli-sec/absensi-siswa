import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler, useState } from 'react';
import { 
    UserCircle, Hash, BookOpen, Mail, KeyRound, 
    Save, X, ShieldCheck, GraduationCap, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Guru', href: '/admin/guru' },
    { title: 'Tambah Data', href: '#' },
];

export default function Create() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [feError, setFeError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        nama_guru: '',
        mapel: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Daftar Mata Pelajaran 
    // SMP 51 Makassar
    const mapelOptions = [
        'Pend. Agama Islam (PAI)',
        'Pend. Agama Kristen (PAK)',
        'Pend. Pancasila',
        'Bhs. Indonesia',
        'Matematika',
        'IPA',
        'IPS',
        'Bhs. Inggris',
        'Seni Budaya',
        'PJOK',
        'Bhs. Daerah',
        'TIK',
        'Bimbingan Konseling (BK)'
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (data.password.length > 0 && data.password.length < 8) {
            setFeError('Password harus minimal 8 karakter.');
            return;
        }

        if (data.password !== data.password_confirmation) {
            setFeError('Konfirmasi password tidak cocok! Silakan periksa kembali.');
            return;
        }

        setFeError('');
        post(route('admin.guru.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Guru Baru" />

            <div className="p-6 w-full space-y-8 animate-in fade-in duration-500">
                
                {/* 1. Header Halaman */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Tambah Guru Baru 
                            <GraduationCap className="text-emerald-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 italic">
                            Daftarkan profil pendidik dan berikan akses login ke sistem absensi.
                        </p>
                    </div>
                    <Link 
                        href={route('admin.guru.index')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
                    >
                        <X size={16} /> Batal & Kembali
                    </Link>
                </div>

                {/* 2. Form Container Utama */}
                <form onSubmit={submit} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">
                    
                    <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* --- BAGIAN KIRI: PROFIL PENDIDIK --- */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <UserCircle size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200">
                                    Profil Pendidik
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* NIP */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Nomor Induk Pegawai (NIP)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Hash size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold font-mono text-slate-800 dark:text-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            value={data.nip}
                                            onChange={(e) => setData('nip', e.target.value)}
                                        />
                                    </div>
                                    {errors.nip && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.nip}</p>}
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Nama Lengkap & Gelar</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserCircle size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            value={data.nama_guru}
                                            onChange={(e) => setData('nama_guru', e.target.value)}
                                        />
                                    </div>
                                    {errors.nama_guru && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.nama_guru}</p>}
                                </div>

                                {/* Mata Pelajaran (Berubah Menjadi Dropdown) */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Mata Pelajaran yang Diampu</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <BookOpen size={16} className="text-slate-400" />
                                        </div>
                                        <select
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                            value={data.mapel}
                                            onChange={(e) => setData('mapel', e.target.value)}
                                        >
                                            <option value="" disabled>-- Pilih Mata Pelajaran --</option>
                                            {mapelOptions.map((mapel) => (
                                                <option key={mapel} value={mapel}>{mapel}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.mapel && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.mapel}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- BAGIAN KANAN: AKSES LOGIN SISTEM --- */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200">
                                    Akses Login Sistem
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Alamat Email (Username)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="new-email"
                                        />
                                    </div>
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.email}</p>}
                                </div>

                                {/* Area Password & Konfirmasi Password */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Kata Sandi</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyRound size={16} className="text-slate-400" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                value={data.password}
                                                onChange={(e) => {
                                                    setData('password', e.target.value);
                                                    setFeError('');
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Konfirmasi Password */}
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Konfirmasi Sandi</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyRound size={16} className="text-slate-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-zinc-800/50 border rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                                    data.password_confirmation.length > 0 && data.password !== data.password_confirmation 
                                                    ? 'border-rose-400 bg-rose-50' 
                                                    : 'border-slate-200 dark:border-zinc-700'
                                                }`}
                                                value={data.password_confirmation}
                                                onChange={(e) => {
                                                    setData('password_confirmation', e.target.value);
                                                    setFeError('');
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Indikator Validasi FE */}
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-bold italic ${
                                        data.password.length > 0 && data.password.length < 8 
                                        ? 'text-rose-500' 
                                        : 'text-slate-400 dark:text-zinc-500'
                                    }`}>
                                        * Minimal 8 karakter.
                                    </p>
                                    
                                    {data.password.length > 0 && data.password_confirmation.length > 0 && data.password === data.password_confirmation && (
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1 mt-1">
                                            <CheckCircle2 size={12} /> Kata sandi cocok
                                        </p>
                                    )}
                                    
                                    {(feError || errors.password) && (
                                        <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2 p-2 bg-rose-50 rounded-lg border border-rose-100">
                                            ⚠️ {feError || errors.password}
                                        </p>
                                    )}
                                </div>

                            </div>
                            
                            {/* Kotak Info Tambahan */}
                            
                        </div>
                    </div>

                    {/* --- FOOTER FORM: TOMBOL SIMPAN --- */}
                    <div className="p-8 bg-slate-50/50 dark:bg-zinc-800/20 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {processing ? (
                                <span className="animate-pulse flex items-center gap-2">Menyimpan Profil...</span>
                            ) : (
                                <>
                                    <Save size={18} className="transition-transform group-hover:-translate-y-0.5" />
                                    Simpan Profil Guru
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}