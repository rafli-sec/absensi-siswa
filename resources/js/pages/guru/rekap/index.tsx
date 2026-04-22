import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    ClipboardCheck, Calendar, BookOpen, Clock,
    Download, X, Users, CheckCircle2, Eye, TrendingDown, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

const mapelOptions = [
    'Pend. Agama Islam (PAI)', 'Pend. Agama Kristen (PAK)', 'Pend. Pancasila',
    'Bhs. Indonesia', 'Matematika', 'IPA', 'IPS', 'Bhs. Inggris',
    'Seni Budaya', 'PJOK', 'Bhs. Daerah', 'IPA/TIK', 'Bimbingan Konseling (BK)'
];
const jamOptions = Array.from({ length: 9 }, (_, i) => i + 1);
const bulanOptions = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
    { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
];

// Hitung jumlah hari dalam sebulan berdasarkan bulan & tahun
function getDaysInMonth(bulanStr: string, tahun?: number): number {
    if (!bulanStr) return 31;
    const y = tahun ?? new Date().getFullYear();
    const m = parseInt(bulanStr, 10);
    return new Date(y, m, 0).getDate(); // hari terakhir bulan tsb
}

// Ambil tahun dari kumpulan tanggal, fallback ke tahun sekarang
function getYearFromDates(dates: string[]): number {
    if (dates && dates.length > 0) {
        const parsed = new Date(dates[0]);
        if (!isNaN(parsed.getFullYear())) return parsed.getFullYear();
    }
    return new Date().getFullYear();
}

export default function Rekap({ rekapAbsensi = [], filters, kelasOptions = [], type: initialType }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Rekap Absensi', href: '#' },
    ];

    const [type, setType] = useState(initialType || 'kelas');
    const [bulan, setBulan] = useState(filters?.bulan || '');
    const [kelas, setKelas] = useState(filters?.kelas || '');
    const [mapel, setMapel] = useState(filters?.mapel || '');
    const [jamKe, setJamKe] = useState(filters?.jam_ke || '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);

    const handleTabChange = (newType: string) => {
        setType(newType);
        router.get(route('guru.rekap.index'), { type: newType, bulan, kelas, mapel, jam_ke: jamKe }, { preserveState: true });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('guru.rekap.index'), { type, bulan, kelas, mapel, jam_ke: jamKe }, { preserveState: true, replace: true });
    };

    const resetFilter = () => {
        setBulan(''); setKelas(''); setMapel(''); setJamKe('');
        router.get(route('guru.rekap.index'), { type }, { preserveState: true });
    };

    const showDetail = (data: any) => {
        setDetailData(data);
        setIsModalOpen(true);
    };

    const handlePrintPDFGlobal = () => {
        const queryParams = new URLSearchParams({ type, bulan, kelas, mapel, jam_ke: jamKe }).toString();
        window.open(route('guru.rekap.pdf') + '?' + queryParams, '_blank');
    };

    const handleExportRowPDF = (item: any) => {
        let url = '';
        if (type === 'kelas') {
            const queryParams = new URLSearchParams({ kelas: item.kelas, mapel: item.mapel, jenis_laporan: 'matriks', bulan: bulan }).toString();
            url = route('guru.rekap.export_pdf') + '?' + queryParams;
        } else if (type === 'mapel') {
            const queryParams = new URLSearchParams({ mapel: item.mapel, bulan: bulan }).toString();
            url = route('guru.rekap.export_mapel_pdf') + '?' + queryParams;
        } else {
            const queryParams = new URLSearchParams({ id_siswa: item.id_siswa, bulan: bulan }).toString();
            url = route('guru.rekap.export_siswa_pdf') + '?' + queryParams;
        }
        window.open(url, '_blank');
    };

    const totalHadir = rekapAbsensi.reduce((sum: number, item: any) => sum + (item.hadir || 0), 0);
    const totalIzin = rekapAbsensi.reduce((sum: number, item: any) => sum + (item.izin || 0), 0);
    const totalSakit = rekapAbsensi.reduce((sum: number, item: any) => sum + (item.sakit || 0), 0);
    const totalAlpha = rekapAbsensi.reduce((sum: number, item: any) => sum + (item.alpha || 0), 0);

    // ── Komponen Ring Progress ─────────────────────────────────────────────
    const RingProgress = ({ pct, color }: { pct: number; color: string }) => {
        const r = 28;
        const circ = 2 * Math.PI * r;
        const filled = (pct / 100) * circ;
        const colorMap: Record<string, string> = {
            emerald: '#059669', blue: '#2563eb', amber: '#d97706', rose: '#e11d48'
        };
        return (
            <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
                <circle
                    cx="36" cy="36" r={r} fill="none"
                    stroke={colorMap[color] ?? '#059669'}
                    strokeWidth="7"
                    strokeDasharray={`${filled} ${circ}`}
                    strokeDashoffset={circ / 4}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                />
                <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={colorMap[color] ?? '#059669'}>{pct}%</text>
            </svg>
        );
    };

    // ── Modal: Per Siswa ───────────────────────────────────────────────────
    const ModalSiswa = ({ data }: { data: any }) => {
        const total = (data.hadir || 0) + (data.izin || 0) + (data.sakit || 0) + (data.alpha || 0);
        const pctHadir = total > 0 ? Math.round((data.hadir / total) * 100) : 0;

        // Kelompokkan riwayat per mapel
        const riwayat: any[] = data.detail_semua ?? [];
        const byMapel: Record<string, { hadir: number; izin: number; sakit: number; alpha: number; total: number }> = {};
        riwayat.forEach((row: any) => {
            const m = row.mapel || 'Tidak diketahui';
            if (!byMapel[m]) byMapel[m] = { hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
            const st = (row.status_kehadiran || '').toLowerCase();
            byMapel[m].total++;
            if (st === 'hadir') byMapel[m].hadir++;
            else if (st === 'izin') byMapel[m].izin++;
            else if (st === 'sakit') byMapel[m].sakit++;
            else if (st === 'alpha') byMapel[m].alpha++;
        });

        // Sort riwayat terbaru dulu
        const sortedRiwayat = [...riwayat].sort((a, b) =>
            new Date(b.tanggal ?? 0).getTime() - new Date(a.tanggal ?? 0).getTime()
        );

        const statusBadge = (st: string) => {
            const map: Record<string, string> = {
                hadir: 'bg-emerald-100 text-emerald-700',
                izin: 'bg-blue-100 text-blue-700',
                sakit: 'bg-amber-100 text-amber-700',
                alpha: 'bg-rose-100 text-rose-700',
            };
            return map[(st ?? '').toLowerCase()] ?? 'bg-slate-100 text-slate-500';
        };

        return (
            <div className="space-y-5">
                {/* Ringkasan */}
                <div className="flex items-center gap-5 bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-col items-center gap-1">
                        <RingProgress pct={pctHadir} color="emerald" />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Kehadiran</span>
                    </div>
                    <div className="grid grid-cols-4 flex-1 gap-3">
                        {[
                            { label: 'Hadir', val: data.hadir, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                            { label: 'Izin', val: data.izin, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
                            { label: 'Sakit', val: data.sakit, cls: 'text-amber-600 bg-amber-50 border-amber-100' },
                            { label: 'Alpha', val: data.alpha, cls: 'text-rose-600 bg-rose-50 border-rose-100' },
                        ].map((s) => (
                            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.cls}`}>
                                <div className="text-[10px] font-black uppercase tracking-wide opacity-70">{s.label}</div>
                                <div className="text-2xl font-black">{s.val ?? 0}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribusi per mapel */}
                {Object.keys(byMapel).length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Distribusi per Mata Pelajaran</h3>
                        <div className="space-y-3">
                            {Object.entries(byMapel).map(([mp, stat]) => {
                                const pct = stat.total > 0 ? Math.round((stat.hadir / stat.total) * 100) : 0;
                                return (
                                    <div key={mp} className="flex items-center gap-3">
                                        <div className="w-40 shrink-0 text-xs font-semibold text-slate-600 truncate" title={mp}>{mp}</div>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="w-8 text-right text-xs font-bold text-slate-500">{pct}%</div>
                                        <div className="flex gap-1 shrink-0">
                                            {stat.alpha > 0 && (
                                                <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                                                    A:{stat.alpha}
                                                </span>
                                            )}
                                            {stat.sakit > 0 && (
                                                <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-1.5 py-0.5 rounded">
                                                    S:{stat.sakit}
                                                </span>
                                            )}
                                            {stat.izin > 0 && (
                                                <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded">
                                                    I:{stat.izin}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Riwayat */}
                {sortedRiwayat.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Riwayat Kehadiran</h3>
                            <span className="text-xs text-slate-400">{sortedRiwayat.length} catatan</span>
                        </div>
                        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                            {sortedRiwayat.map((row: any, idx: number) => {
                                const tgl = row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                                const st = (row.status_kehadiran ?? '').toLowerCase();
                                const initial = st.charAt(0).toUpperCase();
                                return (
                                    <div key={idx} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                                        <div className="text-xs text-slate-400 w-28 shrink-0">{tgl}</div>
                                        <div className="flex-1 text-sm font-semibold text-slate-700 truncate">{row.mapel || '-'}</div>
                                        <div className="text-xs text-slate-400 w-16 text-center">Jam {row.jam_ke ?? '-'}</div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusBadge(st)}`}>
                                            {initial} · {st.charAt(0).toUpperCase() + st.slice(1)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex gap-4 text-xs font-bold text-slate-500">
                            <span className="text-emerald-600">H: Hadir</span>
                            <span className="text-blue-600">I: Izin</span>
                            <span className="text-amber-600">S: Sakit</span>
                            <span className="text-rose-600">A: Alpha</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-200">
                        Belum ada riwayat kehadiran tercatat.
                    </div>
                )}
            </div>
        );
    };

    // ── Modal: Per Mapel ───────────────────────────────────────────────────
    const ModalMapel = ({ data }: { data: any }) => {
        const total = (data.hadir || 0) + (data.izin || 0) + (data.sakit || 0) + (data.alpha || 0);
        const pctHadir = total > 0 ? Math.round((data.hadir / total) * 100) : 0;

        const allRiwayat: any[] = data.detail_semua ?? [];

        // Ringkasan per kelas
        const byKelas: Record<string, { hadir: number; izin: number; sakit: number; alpha: number; total: number; pertemuan: number }> = {};
        allRiwayat.forEach((row: any) => {
            const k = row.siswa?.kelas ?? row.kelas ?? 'Tidak diketahui';
            if (!byKelas[k]) byKelas[k] = { hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0, pertemuan: 0 };
            const st = (row.status_kehadiran || '').toLowerCase();
            byKelas[k].total++;
            byKelas[k].pertemuan++;
            if (st === 'hadir') byKelas[k].hadir++;
            else if (st === 'izin') byKelas[k].izin++;
            else if (st === 'sakit') byKelas[k].sakit++;
            else if (st === 'alpha') byKelas[k].alpha++;
        });

        // Siswa paling banyak tidak hadir (alpha + sakit + izin)
        const bySiswa: Record<string, { nama: string; kelas: string; nis: string; alpha: number; sakit: number; izin: number; total_absen: number }> = {};
        allRiwayat.forEach((row: any) => {
            const id = row.id_siswa ?? row.siswa?.id_siswa ?? row.siswa?.nis ?? Math.random();
            const nama = row.siswa?.nama_siswa ?? row.nama_siswa ?? '-';
            const kls = row.siswa?.kelas ?? row.kelas ?? '-';
            const nis = row.siswa?.nis ?? row.nis ?? '-';
            const st = (row.status_kehadiran || '').toLowerCase();
            if (!bySiswa[id]) bySiswa[id] = { nama, kelas: kls, nis, alpha: 0, sakit: 0, izin: 0, total_absen: 0 };
            if (st === 'alpha') { bySiswa[id].alpha++; bySiswa[id].total_absen++; }
            else if (st === 'sakit') { bySiswa[id].sakit++; bySiswa[id].total_absen++; }
            else if (st === 'izin') { bySiswa[id].izin++; bySiswa[id].total_absen++; }
        });

        const topAbsen = Object.values(bySiswa)
            .filter(s => s.total_absen > 0)
            .sort((a, b) => b.total_absen - a.total_absen)
            .slice(0, 5);

        const initials = (nama: string) => nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
        const initialsColor = (nama: string) => {
            const colors = [
                'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700',
                'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700',
                'bg-violet-100 text-violet-700',
            ];
            return colors[nama.charCodeAt(0) % colors.length];
        };

        return (
            <div className="space-y-5">
                {/* Ringkasan total */}
                <div className="flex items-center gap-5 bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-col items-center gap-1">
                        <RingProgress pct={pctHadir} color="emerald" />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Kehadiran</span>
                    </div>
                    <div className="grid grid-cols-4 flex-1 gap-3">
                        {[
                            { label: 'Hadir', val: data.hadir, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                            { label: 'Izin', val: data.izin, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
                            { label: 'Sakit', val: data.sakit, cls: 'text-amber-600 bg-amber-50 border-amber-100' },
                            { label: 'Alpha', val: data.alpha, cls: 'text-rose-600 bg-rose-50 border-rose-100' },
                        ].map((s) => (
                            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.cls}`}>
                                <div className="text-[10px] font-black uppercase tracking-wide opacity-70">{s.label}</div>
                                <div className="text-2xl font-black">{s.val ?? 0}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ringkasan per kelas */}
                {Object.keys(byKelas).length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Ringkasan per Kelas</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {Object.entries(byKelas).map(([k, stat]) => {
                                const pct = stat.total > 0 ? Math.round((stat.hadir / stat.total) * 100) : 0;
                                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-500';
                                return (
                                    <div key={k} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                                        <div className="w-12 shrink-0">
                                            <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{k}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 w-10 text-right">{pct}%</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400">{stat.total} catatan kehadiran</div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">H:{stat.hadir}</span>
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">I:{stat.izin}</span>
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">S:{stat.sakit}</span>
                                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">A:{stat.alpha}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Siswa paling sering tidak hadir */}
                {topAbsen.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                            <TrendingDown size={14} className="text-rose-400" />
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Siswa Paling Sering Tidak Hadir</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {topAbsen.map((siswa, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${initialsColor(siswa.nama)}`}>
                                        {initials(siswa.nama)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-800 truncate">{siswa.nama}</div>
                                        <div className="text-[10px] text-slate-400">{siswa.kelas} · {siswa.nis}</div>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        {siswa.alpha > 0 && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded">A:{siswa.alpha}</span>}
                                        {siswa.sakit > 0 && <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded">S:{siswa.sakit}</span>}
                                        {siswa.izin > 0 && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">I:{siswa.izin}</span>}
                                    </div>
                                    <div className="text-sm font-black text-slate-500 w-8 text-right shrink-0">{siswa.total_absen}×</div>
                                </div>
                            ))}
                        </div>
                        {topAbsen.length === 0 && (
                            <div className="px-5 py-6 text-center text-slate-400 text-sm">Tidak ada siswa dengan ketidakhadiran tercatat.</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // ── Nama bulan aktif ───────────────────────────────────────────────────
    const getNamaBulan = () => {
        if (bulan) {
            return bulanOptions.find(b => b.value === bulan)?.label ?? 'Semua Bulan';
        }
        if (detailData?.tanggalPertemuan?.length > 0) {
            return new Date(detailData.tanggalPertemuan[0]).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        }
        return 'Semua Bulan';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi" />

            <div className="p-4 md:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ClipboardCheck className="text-blue-500" size={32} />
                            Rekap Absensi
                        </h1>
                        <p className="text-slate-500 mt-1">Ringkasan kehadiran siswa tersentralisasi</p>
                    </div>
                    <button onClick={handlePrintPDFGlobal} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-bold transition-all shadow-lg shadow-rose-200">
                        <Download size={18} /> Cetak Rekap Global
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Hadir', value: totalHadir, color: 'emerald' },
                        { label: 'Total Izin', value: totalIzin, color: 'blue' },
                        { label: 'Total Sakit', value: totalSakit, color: 'amber' },
                        { label: 'Total Alpha', value: totalAlpha, color: 'rose' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white p-4 rounded-2xl border border-${stat.color}-100 shadow-sm flex items-center justify-between`}>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">{stat.label}</p>
                                <p className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</p>
                            </div>
                            <div className={`p-3 bg-${stat.color}-50 rounded-xl`}><CheckCircle2 className={`text-${stat.color}-500`} size={20} /></div>
                        </div>
                    ))}
                </div>

                {/* Tab mode */}
                <div className="flex gap-2 bg-slate-200/60 p-1.5 rounded-xl w-fit overflow-x-auto max-w-full">
                    {['kelas', 'mapel', 'siswa'].map((item) => (
                        <button key={item} onClick={() => handleTabChange(item)} className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${type === item ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {item === 'kelas' && 'Per Sesi Kelas'}
                            {item === 'mapel' && 'Per Mata Pelajaran'}
                            {item === 'siswa' && 'Per Siswa'}
                        </button>
                    ))}
                </div>

                {/* Filter */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-1.5 md:col-span-1 col-span-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Pilih Bulan</label>
                                <div className="relative">
                                    <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="w-full pl-10 text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11">
                                        <option value="">Semua Bulan</option>
                                        {bulanOptions.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
                                    </select>
                                    <Calendar className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Kelas</label>
                                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11">
                                    <option value="">Semua Kelas</option>
                                    {kelasOptions.map((k: string) => (<option key={k} value={k}>Kelas {k}</option>))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
                                <select value={mapel} onChange={(e) => setMapel(e.target.value)} className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11">
                                    <option value="">Semua Mapel</option>
                                    {mapelOptions.map((m) => (<option key={m} value={m}>{m}</option>))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400">Jam</label>
                                <select value={jamKe} onChange={(e) => setJamKe(e.target.value)} className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 h-11">
                                    <option value="">Semua Jam</option>
                                    {jamOptions.map((j) => (<option key={j} value={j.toString()}>Jam ke-{j}</option>))}
                                </select>
                            </div>
                            <div className="flex gap-2 h-11 col-span-2 md:col-span-1">
                                {(bulan || kelas || mapel || jamKe) && (
                                    <button type="button" onClick={resetFilter} className="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold transition-colors">Reset</button>
                                )}
                                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold uppercase tracking-wide transition-colors">Filter</button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tabel rekap */}
                {rekapAbsensi.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <ClipboardCheck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak ada data rekapitulasi</h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="p-4 text-left font-extrabold text-slate-500 uppercase text-[11px] tracking-widest whitespace-nowrap">Detail Info</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Hadir</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Izin</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Sakit</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Alpha</th>
                                        <th className="p-4 text-center font-extrabold text-slate-500 uppercase text-[11px] tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rekapAbsensi.map((rekap: any, index: number) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                {type === 'kelas' && (
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm mb-1">Kelas {rekap.kelas}</div>
                                                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1"><BookOpen size={12} className="text-blue-400" /> {rekap.mapel}</div>
                                                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5"><Clock size={12} className="text-blue-400" /> Jam ke-{rekap.jam_ke}</div>
                                                    </div>
                                                )}
                                                {type === 'mapel' && (
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm mb-1">{rekap.mapel}</div>
                                                        <div className="text-[11px] text-slate-500">{rekap.total_pertemuan} Pertemuan Tercatat</div>
                                                    </div>
                                                )}
                                                {type === 'siswa' && (
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm mb-1">{rekap.nama_siswa}</div>
                                                        <div className="text-[11px] text-slate-500">Kelas {rekap.kelas}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center"><div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl inline-flex min-w-[3rem] justify-center"><span className="font-black text-base">{rekap.hadir}</span></div></td>
                                            <td className="p-4 text-center"><div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl inline-flex min-w-[3rem] justify-center"><span className="font-black text-base">{rekap.izin}</span></div></td>
                                            <td className="p-4 text-center"><div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-xl inline-flex min-w-[3rem] justify-center"><span className="font-black text-base">{rekap.sakit}</span></div></td>
                                            <td className="p-4 text-center"><div className="bg-rose-50 text-rose-700 px-3 py-2 rounded-xl inline-flex min-w-[3rem] justify-center"><span className="font-black text-base">{rekap.alpha}</span></div></td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => showDetail(rekap)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all" title="Lihat Detail"><Eye size={18} /></button>
                                                    <button onClick={() => handleExportRowPDF(rekap)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all" title="Ekspor PDF"><Download size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── MODAL ─────────────────────────────────────────────────────────── */}
            {isModalOpen && detailData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">

                        {/* Header modal */}
                        <div className="p-5 border-b border-slate-100 flex justify-between bg-white sticky top-0 z-10 gap-4 items-center">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Users className="text-blue-500" size={22} />
                                    Detail Rekapitulasi
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {type === 'kelas' && <>Kelas <strong className="text-slate-700">{detailData.kelas}</strong> · <strong className="text-slate-700">{detailData.mapel}</strong> · {getNamaBulan()}</>}
                                    {type === 'mapel' && <>Mata Pelajaran: <strong className="text-slate-700">{detailData.mapel}</strong> · {getNamaBulan()}</>}
                                    {type === 'siswa' && <>Siswa: <strong className="text-slate-700">{detailData.nama_siswa}</strong> · Kelas <strong className="text-slate-700">{detailData.kelas}</strong> · {getNamaBulan()}</>}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleExportRowPDF(detailData)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-sm font-bold shadow-sm transition-colors">
                                    <Download size={15} /> Ekspor PDF
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body modal */}
                        <div className="overflow-y-auto p-5 bg-slate-50 flex-1">

                            {/* MODE KELAS: tabel matriks tanggal */}
                            {type === 'kelas' && (() => {
                                // Hitung jumlah hari bulan ini secara dinamis
                                const allDates: string[] = detailData.tanggalPertemuan ?? [];
                                const tahun = getYearFromDates(allDates);
                                const maxDays = bulan
                                    ? getDaysInMonth(bulan, tahun)
                                    : (allDates.length > 0
                                        ? getDaysInMonth(
                                            String(new Date(allDates[0]).getMonth() + 1).padStart(2, '0'),
                                            tahun
                                          )
                                        : 31);
                                const days = Array.from({ length: maxDays }, (_, i) => i + 1);

                                return (
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-max">
                                                <thead>
                                                    <tr className="bg-slate-100 border-b border-slate-200">
                                                        <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-0 bg-slate-100 z-10" rowSpan={2}>No</th>
                                                        <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-8 bg-slate-100 z-10" rowSpan={2}>NIS</th>
                                                        <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-24 bg-slate-100 z-10" rowSpan={2}>Nama Siswa</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" colSpan={maxDays}>Tanggal</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>H</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>I</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>S</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>A</th>
                                                        <th className="p-3 text-center text-xs font-bold uppercase text-slate-600" rowSpan={2}>%</th>
                                                    </tr>
                                                    <tr className="bg-slate-50 border-b border-slate-200">
                                                        {days.map((day) => (
                                                            <th key={day} className="p-2 text-center text-[10px] font-bold text-slate-500 border-r border-slate-200 w-8 min-w-[28px]">{day}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {detailData.detail_semua?.map((siswa: any, index: number) => {
                                                        const nis = siswa.siswa?.nis || siswa.nis || '-';
                                                        const nama = siswa.siswa?.nama_siswa || siswa.nama_siswa || 'Tanpa Nama';
                                                        const actualDates: string[] = detailData.tanggalPertemuan || [];

                                                        let h = 0, i_count = 0, s = 0, a = 0;
                                                        actualDates.forEach((dateStr: string) => {
                                                            const rawStatus = siswa.statusByDate?.[dateStr] || (siswa.tanggal === dateStr ? siswa.status_kehadiran : '-');
                                                            const initial = rawStatus !== '-' ? String(rawStatus).charAt(0).toUpperCase() : '-';
                                                            if (initial === 'H') h++; else if (initial === 'I') i_count++; else if (initial === 'S') s++; else if (initial === 'A') a++;
                                                        });

                                                        const prosentase = actualDates.length > 0 ? Math.round((h / actualDates.length) * 100) : 0;

                                                        return (
                                                            <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                                                <td className="p-3 text-sm text-slate-600 border-r border-slate-100 sticky left-0 bg-white">{index + 1}</td>
                                                                <td className="p-3 text-sm font-mono text-slate-600 border-r border-slate-100 sticky left-8 bg-white">{nis}</td>
                                                                <td className="p-3 text-sm font-bold text-slate-800 border-r border-slate-100 sticky left-24 bg-white whitespace-nowrap">{nama}</td>
                                                                {days.map((day) => {
                                                                    let status = '-';
                                                                    actualDates.forEach((dateStr: string) => {
                                                                        if (new Date(dateStr).getDate() === day) {
                                                                            const rawStatus = siswa.statusByDate?.[dateStr] || (siswa.tanggal === dateStr ? siswa.status_kehadiran : null);
                                                                            if (rawStatus && rawStatus !== '-') {
                                                                                status = String(rawStatus).charAt(0).toUpperCase();
                                                                            }
                                                                        }
                                                                    });
                                                                    const colorClass = status === 'H' ? 'text-emerald-600' : status === 'I' ? 'text-blue-600' : status === 'S' ? 'text-amber-600' : status === 'A' ? 'text-rose-600' : 'text-slate-300';
                                                                    return (
                                                                        <td key={day} className={`p-1 text-center text-xs font-black border-r border-slate-100 ${colorClass}`}>{status}</td>
                                                                    );
                                                                })}
                                                                <td className="p-2 text-center text-xs font-bold text-emerald-700 border-r border-slate-100 bg-emerald-50/50">{h}</td>
                                                                <td className="p-2 text-center text-xs font-bold text-blue-700 border-r border-slate-100 bg-blue-50/50">{i_count}</td>
                                                                <td className="p-2 text-center text-xs font-bold text-amber-700 border-r border-slate-100 bg-amber-50/50">{s}</td>
                                                                <td className="p-2 text-center text-xs font-bold text-rose-700 border-r border-slate-100 bg-rose-50/50">{a}</td>
                                                                <td className="p-2 text-center text-xs font-bold text-slate-800 bg-slate-50">{prosentase}%</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
                                            <span>Keterangan:</span>
                                            <span className="text-emerald-600">H: Hadir</span>
                                            <span className="text-blue-600">I: Izin</span>
                                            <span className="text-amber-600">S: Sakit</span>
                                            <span className="text-rose-600">A: Alpha</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* MODE SISWA */}
                            {type === 'siswa' && <ModalSiswa data={detailData} />}

                            {/* MODE MAPEL */}
                            {type === 'mapel' && <ModalMapel data={detailData} />}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}