import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { 
    User, CreditCard, BookOpen, Phone, MapPin, 
    Save, X, CheckCircle, Users, GraduationCap 
} from 'lucide-react';

export default function Edit({ siswa }: { siswa: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Siswa', href: '/admin/siswa' },
        { title: `Edit: ${siswa.nama_siswa}`, href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nis: siswa.nis,
        nama_siswa: siswa.nama_siswa,
        kelas: siswa.kelas,
        jenis_kelamin: siswa.jenis_kelamin || 'laki-laki',
        alamat: siswa.alamat || '',
        no_hp_ortu: siswa.no_hp_ortu,
        status: siswa.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.siswa.update', siswa.id_siswa));
    };

    const kelasOptions = ['7A', '7B', '7C', '8A', '8B', '8C', '9A'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Siswa - ${siswa.nama_siswa}`} />
            
            <div className="p-6 w-full space-y-8 animate-in fade-in duration-500">
                
                {/* 1. Header Halaman */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            Edit Data Siswa 
                            <GraduationCap className="text-orange-500" size={28} />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 italic">
                            Perbarui profil identitas dan data kontak WhatsApp untuk siswa <span className="font-bold text-slate-700 dark:text-slate-300">{siswa.nama_siswa}</span>.
                        </p>
                    </div>
                    <Link 
                        href={route('admin.siswa.index')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
                    >
                        <X size={16} /> Batal & Kembali
                    </Link>
                </div>

                {/* 2. Form Container Utama */}
                <form onSubmit={submit} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">
                    
                    <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* --- BAGIAN KIRI: DATA PRIBADI --- */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200">
                                    Data Pribadi
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* NIS */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Nomor Induk Siswa (NIS)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CreditCard size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            placeholder="Masukkan NIS..."
                                        />
                                    </div>
                                    {errors.nis && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.nis}</p>}
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Nama Lengkap Siswa</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            value={data.nama_siswa}
                                            onChange={(e) => setData('nama_siswa', e.target.value)}
                                            placeholder="Nama sesuai ijazah..."
                                        />
                                    </div>
                                    {errors.nama_siswa && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.nama_siswa}</p>}
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Jenis Kelamin</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Users size={16} className="text-slate-400" />
                                        </div>
                                        <select
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                            value={data.jenis_kelamin}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        >
                                            <option value="laki-laki">Laki-laki</option>
                                            <option value="perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    {errors.jenis_kelamin && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.jenis_kelamin}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- BAGIAN KANAN: AKADEMIK & KONTAK --- */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 text-[#F53003] dark:text-orange-400 rounded-xl">
                                    <BookOpen size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200">
                                    Akademik & Kontak
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Kelas & Status Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Kelas Aktif</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <BookOpen size={16} className="text-slate-400" />
                                            </div>
                                            <select
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                                value={data.kelas}
                                                onChange={(e) => setData('kelas', e.target.value)}
                                            >
                                                <option value="" disabled>-- Pilih Kelas --</option>
                                                {kelasOptions.map((k) => (
                                                    <option key={k} value={k}>{k}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.kelas && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.kelas}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Status Siswa</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <CheckCircle size={16} className="text-slate-400" />
                                            </div>
                                            <select
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="aktif">Aktif</option>
                                                <option value="tidak_aktif">Tidak Aktif</option>
                                            </select>
                                        </div>
                                        {errors.status && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.status}</p>}
                                    </div>
                                </div>

                                {/* No HP */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">No. HP Orang Tua (Wajib Aktif WA)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold font-mono text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            value={data.no_hp_ortu}
                                            onChange={(e) => setData('no_hp_ortu', e.target.value)}
                                            placeholder="Contoh: 6281234567890"
                                        />
                                    </div>
                                    <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold italic mt-2">* Awali dengan 62, sistem membutuhkannya untuk API Fonnte.</p>
                                    {errors.no_hp_ortu && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.no_hp_ortu}</p>}
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Alamat Lengkap</label>
                                    <div className="relative">
                                        <div className="absolute top-4 left-4 pointer-events-none">
                                            <MapPin size={16} className="text-slate-400" />
                                        </div>
                                        <textarea
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-orange-500 focus:border-orange-500 transition-all min-h-[120px]"
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            placeholder="Detail alamat domisili..."
                                        />
                                    </div>
                                    {errors.alamat && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.alamat}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER FORM: TOMBOL SIMPAN --- */}
                    <div className="p-8 bg-slate-50/50 dark:bg-zinc-800/20 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex items-center gap-3 px-8 py-4 bg-[#F53003] hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-200 dark:shadow-none transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {processing ? (
                                <span className="animate-pulse flex items-center gap-2">Menyimpan Perubahan...</span>
                            ) : (
                                <>
                                    <Save size={18} className="transition-transform group-hover:-translate-y-0.5" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}