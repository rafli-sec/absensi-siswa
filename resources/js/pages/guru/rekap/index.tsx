import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    ClipboardCheck, Calendar, BookOpen, Clock, 
    Download, X, Users, CheckCircle2, Eye, FileText
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi" />

            <div className="p-4 md:p-6 space-y-6">
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

                <div className="flex gap-2 bg-slate-200/60 p-1.5 rounded-xl w-fit overflow-x-auto max-w-full">
                    {['kelas', 'mapel', 'siswa'].map((item) => (
                        <button key={item} onClick={() => handleTabChange(item)} className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${type === item ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {item === 'kelas' && 'Per Sesi Kelas'}
                            {item === 'mapel' && 'Per Mata Pelajaran'}
                            {item === 'siswa' && 'Per Siswa'}
                        </button>
                    ))}
                </div>

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

            {/* MODAL DETAIL */}
            {isModalOpen && detailData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh]">
                        
                        <div className="p-5 border-b border-slate-100 flex justify-between bg-white sticky top-0 z-10 gap-4 items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                    <Users className="text-blue-500" size={24} />
                                    Detail Rekapitulasi
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {(() => {
                                        let namaBulan = 'Semua Bulan';
                                        if (bulan) {
                                            const b = bulanOptions.find(opt => opt.value === bulan);
                                            if (b) namaBulan = b.label;
                                        } else if (detailData?.tanggalPertemuan && detailData.tanggalPertemuan.length > 0) {
                                            const d = new Date(detailData.tanggalPertemuan[0]);
                                            namaBulan = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                                        }

                                        return (
                                            <>
                                                {type === 'kelas' && <>Kelas <strong className="text-slate-700">{detailData.kelas}</strong> | Mapel <strong className="text-slate-700">{detailData.mapel}</strong> | Bulan <strong className="text-slate-700">{namaBulan}</strong></>}
                                                {type === 'mapel' && <>Mata Pelajaran: <strong className="text-slate-700">{detailData.mapel}</strong> | Bulan <strong className="text-slate-700">{namaBulan}</strong></>}
                                                {type === 'siswa' && <>Siswa: <strong className="text-slate-700">{detailData.nama_siswa}</strong> | Kelas <strong className="text-slate-700">{detailData.kelas}</strong> | Bulan <strong className="text-slate-700">{namaBulan}</strong></>}
                                            </>
                                        );
                                    })()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleExportRowPDF(detailData)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-sm font-bold shadow-sm">
                                    <Download size={16} /> Ekspor PDF
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-5 bg-slate-50 flex-1">
                            {type === 'kelas' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-max">
                                            <thead>
                                                <tr className="bg-slate-100 border-b border-slate-200">
                                                    <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-0 bg-slate-100 z-10" rowSpan={2}>No</th>
                                                    <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-8 bg-slate-100 z-10" rowSpan={2}>NIS</th>
                                                    <th className="p-3 text-xs font-bold uppercase text-slate-600 border-r border-slate-200 sticky left-24 bg-slate-100 z-10" rowSpan={2}>Nama Siswa</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" colSpan={31}>Tanggal</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>H</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>I</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>S</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600 border-r border-slate-200" rowSpan={2}>A</th>
                                                    <th className="p-3 text-center text-xs font-bold uppercase text-slate-600" rowSpan={2}>%</th>
                                                </tr>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                        <th key={day} className="p-2 text-center text-[10px] font-bold text-slate-500 border-r border-slate-200 w-8 min-w-[28px]">
                                                            {day}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {detailData.detail_semua?.map((siswa: any, index: number) => {
                                                    const nis = siswa.siswa?.nis || siswa.nis || '-';
                                                    const nama = siswa.siswa?.nama_siswa || siswa.nama_siswa || 'Tanpa Nama';
                                                    const actualDates = detailData.tanggalPertemuan || [];
                                                    
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
                                                            
                                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                                                let status = '-';
                                                                actualDates.forEach((dateStr: string) => {
                                                                    if (new Date(dateStr).getDate() === day) {
                                                                        const rawStatus = siswa.statusByDate?.[dateStr] || (siswa.tanggal === dateStr ? siswa.status_kehadiran : null);
                                                                        if (rawStatus && rawStatus !== '-') {
                                                                            status = String(rawStatus).charAt(0).toUpperCase();
                                                                        }
                                                                    }
                                                                });

                                                                const colorClass = status === 'H' ? 'text-emerald-600' :
                                                                                   status === 'I' ? 'text-blue-600' :
                                                                                   status === 'S' ? 'text-amber-600' :
                                                                                   status === 'A' ? 'text-rose-600' : 'text-slate-300';

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
                            )}

                            {type !== 'kelas' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-white border border-emerald-100 p-6 rounded-2xl text-center shadow-sm">
                                            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Total Hadir</div>
                                            <div className="text-4xl font-black text-emerald-600">{detailData.hadir}</div>
                                        </div>
                                        <div className="bg-white border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
                                            <div className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Total Izin</div>
                                            <div className="text-4xl font-black text-blue-600">{detailData.izin}</div>
                                        </div>
                                        <div className="bg-white border border-amber-100 p-6 rounded-2xl text-center shadow-sm">
                                            <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Total Sakit</div>
                                            <div className="text-4xl font-black text-amber-600">{detailData.sakit}</div>
                                        </div>
                                        <div className="bg-white border border-rose-100 p-6 rounded-2xl text-center shadow-sm">
                                            <div className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">Total Alpha</div>
                                            <div className="text-4xl font-black text-rose-600">{detailData.alpha}</div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center">
                                        <FileText size={48} className="text-slate-300 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Lengkap Tersedia di PDF</h3>
                                        <p className="text-slate-500 max-w-md">
                                            Untuk melihat detail riwayat harian dan penjabaran secara lengkap, silakan klik tombol <b>Ekspor PDF</b> di pojok kanan atas.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}