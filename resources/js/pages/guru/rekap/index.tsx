import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    ClipboardCheck, BookOpen, User, Users, Download, X, 
    Filter, CheckCircle2, AlertCircle, Award, School, Calendar, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const semesterOptions = [
    { value: 'ganjil', label: 'Semester Ganjil (Juli - Desember)' },
    { value: 'genap',  label: 'Semester Genap (Januari - Juni)' }
];

const tahunAjaranOptions = [
    '2024/2025','2025/2026','2026/2027','2027/2028','2028/2029','2029/2030','2030/2031'
];

const bulanGanjil = [
    { value: 7,  label: 'Juli' },
    { value: 8,  label: 'Agustus' },
    { value: 9,  label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

const bulanGenap = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
];

export default function Rekap({ 
    rekapData = [],
    filters, 
    kelasOptions = [], 
    mapelOptions = [],
    siswaOptions = [], 
    type: initialType, 
    selectedSiswa,
    tahun_ajaran 
}: any) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Rekap Absensi Semester', href: '#' },
    ];

    const [type, setType]               = useState(initialType || 'kelas');
    const [semester, setSemester]       = useState(filters?.semester || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters?.tahun_ajaran || tahun_ajaran || '2024/2025');
    const [kelas, setKelas]             = useState(filters?.kelas || '');
    const [mapel, setMapel]             = useState(filters?.mapel || '');
    const [idSiswa, setIdSiswa]         = useState(filters?.id_siswa || '');
    const [showFilters, setShowFilters] = useState(false);

    // Toggle view mode: 'semester' or 'bulan'
    const [viewMode, setViewMode]         = useState<'semester' | 'bulan'>('semester');
    const [selectedBulan, setSelectedBulan] = useState<number | ''>('');

    // Modal detail siswa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSiswa, setModalSiswa]   = useState<any>(null);

    // Export dropdown
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isFilterActive = semester && kelas
        && (type !== 'mapel' || mapel)
        && (type !== 'siswa' || idSiswa);

    const bulanOptions = semester === 'ganjil' ? bulanGanjil : bulanGenap;

    // Helper: ambil nilai filter aktif (dari filters prop atau state lokal)
    const fSemester    = filters?.semester     || semester;
    const fTahunAjaran = filters?.tahun_ajaran || tahunAjaran;
    const fKelas       = filters?.kelas        || kelas;
    const fMapel       = filters?.mapel        || mapel;
    const fIdSiswa     = filters?.id_siswa     || idSiswa;

    // ===================== TAB & FILTER =====================
    const handleTabChange = (newType: string) => {
        setType(newType);
        setViewMode('semester');
        setSelectedBulan('');
        if (newType === 'siswa') setMapel('');
        else if (newType === 'mapel') setIdSiswa('');
        router.get(route('guru.rekap.index'), { 
            type: newType, semester, kelas, 
            mapel:    newType === 'mapel' ? mapel    : undefined,
            id_siswa: newType === 'siswa' ? idSiswa  : undefined,
            tahun_ajaran: tahunAjaran 
        }, { preserveState: true });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!semester || !kelas) { alert('Semester dan Kelas wajib dipilih!'); return; }
        const params: any = { type, semester, kelas, tahun_ajaran: tahunAjaran };
        if (type === 'mapel' && mapel)   params.mapel    = mapel;
        if (type === 'siswa' && idSiswa) params.id_siswa = idSiswa;
        router.get(route('guru.rekap.index'), params, { preserveState: true, replace: true });
    };

    const resetFilter = () => {
        setSemester(''); setKelas(''); setMapel(''); setIdSiswa(''); setSelectedBulan('');
        router.get(route('guru.rekap.index'), { type, tahun_ajaran: tahunAjaran }, { preserveState: true });
    };

    // ===================== EXPORT HELPERS =====================
    const triggerDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url; link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportMenu(false);
    };

    // --- KELAS: Per Bulan ---
    const handleExportKelasBulan = () => {
        if (!selectedBulan) { alert('Pilih bulan terlebih dahulu di toggle tampilan!'); return; }
        const p = new URLSearchParams({ semester: fSemester, tahun_ajaran: fTahunAjaran, kelas: fKelas, bulan: String(selectedBulan) });
        triggerDownload(route('guru.rekap.export.kelas.bulan') + '?' + p, `Rekap_Kelas_${fKelas}_Bulan${selectedBulan}.pdf`);
    };

    // --- KELAS: Per Semester ---
    const handleExportKelasSemester = () => {
        const p = new URLSearchParams({ semester: fSemester, tahun_ajaran: fTahunAjaran, kelas: fKelas });
        triggerDownload(route('guru.rekap.export.kelas.semester') + '?' + p, `Rekap_Kelas_${fKelas}_Semester.pdf`);
    };

    // --- MAPEL: Per Semester ---
    const handleExportMapelSemester = () => {
        const p = new URLSearchParams({ semester: fSemester, tahun_ajaran: fTahunAjaran, kelas: fKelas, mapel: fMapel });
        triggerDownload(route('guru.rekap.export.mapel') + '?' + p, `Rekap_Mapel_${fMapel}_${fKelas}_Semester.pdf`);
    };

    // --- MAPEL: Per Bulan ---
    const handleExportMapelBulan = () => {
        if (!selectedBulan) { alert('Pilih bulan terlebih dahulu di toggle tampilan!'); return; }
        const p = new URLSearchParams({ semester: fSemester, tahun_ajaran: fTahunAjaran, kelas: fKelas, mapel: fMapel, bulan: String(selectedBulan) });
        triggerDownload(route('guru.rekap.export.mapel.bulan') + '?' + p, `Rekap_Mapel_${fMapel}_${fKelas}_Bulan${selectedBulan}.pdf`);
    };

    // --- SISWA: Per Semester ---
    const handleExportSiswaSemester = () => {
        const p = new URLSearchParams({ semester: fSemester, tahun_ajaran: fTahunAjaran, kelas: fKelas });
        if (fIdSiswa) p.set('id_siswa', String(fIdSiswa));
        triggerDownload(route('guru.rekap.export.siswa.semester') + '?' + p, `Rekap_Siswa_${fKelas}_Semester.pdf`);
    };

    // ===================== HELPERS =====================
    const getPersentaseColor = (pct: number) => {
        if (pct >= 90) return 'text-emerald-600 bg-emerald-50';
        if (pct >= 75) return 'text-blue-600 bg-blue-50';
        if (pct >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-rose-600 bg-rose-50';
    };

    const openModalSiswa = (siswaData: any) => { setModalSiswa(siswaData); setIsModalOpen(true); };

    // ===================== MODAL DETAIL SISWA =====================
    const ModalDetailSiswa = () => {
        if (!isModalOpen || !modalSiswa) return null;
        const statusByDate: Record<string, string> = modalSiswa.statusByDate || modalSiswa.status_by_date || {};
        const rekapPerBulan: Record<string, { hadir:number; sakit:number; izin:number; alpha:number; tanggalTidakHadir:string[] }> = {};

        Object.entries(statusByDate).forEach(([tgl, status]) => {
            const date    = new Date(tgl);
            const bulanKey = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            if (!rekapPerBulan[bulanKey]) rekapPerBulan[bulanKey] = { hadir:0, sakit:0, izin:0, alpha:0, tanggalTidakHadir:[] };
            if (status === 'hadir') rekapPerBulan[bulanKey].hadir++;
            else if (status === 'sakit') { rekapPerBulan[bulanKey].sakit++; rekapPerBulan[bulanKey].tanggalTidakHadir.push(`${date.getDate()} (Sakit)`); }
            else if (status === 'izin')  { rekapPerBulan[bulanKey].izin++;  rekapPerBulan[bulanKey].tanggalTidakHadir.push(`${date.getDate()} (Izin)`); }
            else if (status === 'alpha') { rekapPerBulan[bulanKey].alpha++; rekapPerBulan[bulanKey].tanggalTidakHadir.push(`${date.getDate()} (Alpha)`); }
        });

        const siswaInfo     = modalSiswa.siswa || modalSiswa;
        const totalHadir    = Object.values(rekapPerBulan).reduce((s,b) => s+b.hadir,  0);
        const totalSakit    = Object.values(rekapPerBulan).reduce((s,b) => s+b.sakit,  0);
        const totalIzin     = Object.values(rekapPerBulan).reduce((s,b) => s+b.izin,   0);
        const totalAlpha    = Object.values(rekapPerBulan).reduce((s,b) => s+b.alpha,  0);
        const totalPertemuan = totalHadir + totalSakit + totalIzin + totalAlpha;
        const persentase    = totalPertemuan > 0 ? Math.round((totalHadir / totalPertemuan) * 100) : 0;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white flex justify-between items-start">
                        <div>
                            <p className="text-indigo-200 text-xs uppercase tracking-wider">Detail Kehadiran</p>
                            <h2 className="text-xl font-bold mt-0.5">{siswaInfo?.nama_siswa}</h2>
                            <p className="text-indigo-200 text-sm mt-1">NIS: {siswaInfo?.nis} | {siswaInfo?.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition"><X size={20}/></button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 border-b">
                        {[['Hadir','text-emerald-600',totalHadir],['Sakit','text-amber-600',totalSakit],['Izin','text-blue-600',totalIzin],['Alpha','text-rose-600',totalAlpha]].map(([label,color,val]) => (
                            <div key={label as string} className="text-center">
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className={`text-xl font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-3 bg-slate-50 border-b flex items-center justify-between">
                        <span className="text-sm text-slate-500">Total Kehadiran Semester</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPersentaseColor(persentase)}`}>{persentase}%</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-3">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Rincian Per Bulan</h3>
                        {Object.keys(rekapPerBulan).length === 0 ? (
                            <p className="text-center text-slate-400 py-8">Tidak ada data kehadiran</p>
                        ) : (
                            Object.entries(rekapPerBulan).map(([bulanKey, data]) => (
                                <div key={bulanKey} className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                                        <span className="font-semibold text-slate-700 text-sm">{bulanKey}</span>
                                        <div className="flex gap-3 text-xs">
                                            <span className="text-emerald-600 font-bold">H: {data.hadir}</span>
                                            <span className="text-amber-600">S: {data.sakit}</span>
                                            <span className="text-blue-600">I: {data.izin}</span>
                                            <span className="text-rose-600">A: {data.alpha}</span>
                                        </div>
                                    </div>
                                    {data.tanggalTidakHadir.length > 0 ? (
                                        <div className="px-4 py-2.5">
                                            <p className="text-xs text-slate-500 mb-1.5">Tanggal Tidak Hadir:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {data.tanggalTidakHadir.map((tgl, i) => (
                                                    <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${tgl.includes('Sakit')?'bg-amber-100 text-amber-700':tgl.includes('Izin')?'bg-blue-100 text-blue-700':'bg-rose-100 text-rose-700'}`}>{tgl}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-2 text-xs text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 size={12}/> Hadir semua pertemuan bulan ini
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ===================== TOGGLE VIEW + PILIH BULAN =====================
    const ToggleViewMode = () => (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => { setViewMode('semester'); setSelectedBulan(''); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${viewMode==='semester'?'bg-white shadow text-blue-600':'text-slate-500 hover:text-slate-700'}`}>
                    <ClipboardCheck size={14}/> Per Semester
                </button>
                <button onClick={() => setViewMode('bulan')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${viewMode==='bulan'?'bg-white shadow text-blue-600':'text-slate-500 hover:text-slate-700'}`}>
                    <Calendar size={14}/> Per Bulan
                </button>
            </div>
            {viewMode === 'bulan' && (
                <select value={selectedBulan} onChange={(e) => setSelectedBulan(e.target.value ? Number(e.target.value) : '')}
                    className="border-slate-200 rounded-xl h-10 px-3 bg-white text-sm font-medium focus:ring-blue-500">
                    <option value="">-- Pilih Bulan --</option>
                    {bulanOptions.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
            )}
        </div>
    );

    // ===================== TABEL PER BULAN =====================
    const renderTabelPerBulan = (siswaList: any[], allDates: string[]) => {
        const filteredDates = selectedBulan
            ? allDates.filter(tgl => new Date(tgl).getMonth() + 1 === Number(selectedBulan))
            : allDates;

        if (filteredDates.length === 0) return (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border">
                <Calendar size={40} className="mx-auto mb-2 opacity-40"/>
                <p>Tidak ada data untuk bulan yang dipilih</p>
            </div>
        );

        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-100 border-b">
                                <th className="p-3 font-bold text-slate-700">No</th>
                                <th className="p-3 font-bold text-slate-700">NIS</th>
                                <th className="p-3 font-bold text-slate-700 min-w-[160px]">Nama Siswa</th>
                                <th className="p-3 font-bold text-slate-700">L/P</th>
                                {filteredDates.map((tgl, idx) => (
                                    <th key={idx} className="p-2 text-center text-xs font-bold text-slate-600 min-w-[36px]">
                                        {new Date(tgl).getDate()}
                                    </th>
                                ))}
                                <th className="p-3 text-center font-bold text-emerald-700">H</th>
                                <th className="p-3 text-center font-bold text-amber-600">S</th>
                                <th className="p-3 text-center font-bold text-blue-600">I</th>
                                <th className="p-3 text-center font-bold text-rose-600">A</th>
                                <th className="p-3 text-center font-bold text-slate-700">%</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {siswaList.map((item: any, idx: number) => {
                                const siswa = item.siswa || item;
                                const statusByDate = item.statusByDate || item.status_by_date || {};
                                let h=0, s=0, iz=0, a=0;
                                filteredDates.forEach(tgl => {
                                    const st = statusByDate[tgl];
                                    if (st==='hadir') h++;
                                    else if (st==='sakit') s++;
                                    else if (st==='izin') iz++;
                                    else if (st==='alpha') a++;
                                });
                                const total = h+s+iz+a;
                                const pct   = total > 0 ? Math.round((h/total)*100) : 0;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="p-3">{idx+1}</td>
                                        <td className="p-3 font-mono text-xs">{siswa?.nis}</td>
                                        <td className="p-3">
                                            <button onClick={() => openModalSiswa(item)} className="font-medium text-blue-600 hover:underline text-left">
                                                {siswa?.nama_siswa}
                                            </button>
                                        </td>
                                        <td className="p-3 text-center">{siswa?.jenis_kelamin==='perempuan'?'P':'L'}</td>
                                        {filteredDates.map((tgl, tIdx) => {
                                            const st = statusByDate[tgl];
                                            const [cls, txt] = st==='hadir'?['bg-emerald-100 text-emerald-700','H']:st==='sakit'?['bg-amber-100 text-amber-700','S']:st==='izin'?['bg-blue-100 text-blue-700','I']:st==='alpha'?['bg-rose-100 text-rose-700','A']:['bg-slate-100 text-slate-400','-'];
                                            return <td key={tIdx} className="p-2 text-center"><span className={`inline-block w-7 h-7 rounded-full text-xs font-bold leading-7 ${cls}`}>{txt}</span></td>;
                                        })}
                                        <td className="p-3 text-center font-semibold text-emerald-600">{h}</td>
                                        <td className="p-3 text-center text-amber-600">{s}</td>
                                        <td className="p-3 text-center text-blue-600">{iz}</td>
                                        <td className="p-3 text-center text-rose-600">{a}</td>
                                        <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(pct)}`}>{pct}%</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // ===================== TABEL SEMESTER (kolom tanggal) =====================
    const renderTabelSemesterKolom = (siswaList: any[], tanggalPertemuan: string[], showHSIA = true) => (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-100 border-b">
                            <th className="p-3 font-bold text-slate-700">No</th>
                            <th className="p-3 font-bold text-slate-700">NIS</th>
                            <th className="p-3 font-bold text-slate-700 min-w-[160px]">Nama Siswa</th>
                            <th className="p-3 font-bold text-slate-700">L/P</th>
                            {tanggalPertemuan.map((tgl: string, idx: number) => (
                                <th key={idx} className="p-2 text-center text-xs font-bold text-slate-600 min-w-[40px]">
                                    {new Date(tgl).toLocaleDateString('id-ID', { day:'numeric', month:'short' })}
                                </th>
                            ))}
                            {showHSIA && <>
                                <th className="p-3 text-center font-bold text-emerald-700">H</th>
                                <th className="p-3 text-center font-bold text-amber-600">S</th>
                                <th className="p-3 text-center font-bold text-blue-600">I</th>
                                <th className="p-3 text-center font-bold text-rose-600">A</th>
                            </>}
                            <th className="p-3 text-center font-bold text-slate-700">% Hadir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {siswaList.map((item: any, idx: number) => {
                            const siswa = item.siswa || item;
                            const statusByDate = item.statusByDate || item.status_by_date || {};
                            let h=0, s=0, iz=0, a=0;
                            tanggalPertemuan.forEach((tgl:string) => {
                                const st = statusByDate[tgl];
                                if (st==='hadir') h++;
                                else if (st==='sakit') s++;
                                else if (st==='izin') iz++;
                                else if (st==='alpha') a++;
                            });
                            const total = tanggalPertemuan.length;
                            const pct = total>0 ? Math.round((h/total)*100) : 0;
                            return (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-3">{idx+1}</td>
                                    <td className="p-3 font-mono text-xs">{siswa?.nis}</td>
                                    <td className="p-3">
                                        <button onClick={() => openModalSiswa(item)} className="font-medium text-blue-600 hover:underline text-left">
                                            {siswa?.nama_siswa}
                                        </button>
                                    </td>
                                    <td className="p-3 text-center">{siswa?.jenis_kelamin==='perempuan'?'P':'L'}</td>
                                    {tanggalPertemuan.map((tgl:string, tIdx:number) => {
                                        const st = statusByDate[tgl];
                                        const [cls, txt] = st==='hadir'?['bg-emerald-100 text-emerald-700','H']:st==='sakit'?['bg-amber-100 text-amber-700','S']:st==='izin'?['bg-blue-100 text-blue-700','I']:st==='alpha'?['bg-rose-100 text-rose-700','A']:['bg-slate-100 text-slate-400','-'];
                                        return <td key={tIdx} className="p-2 text-center"><span className={`inline-block w-7 h-7 rounded-full text-xs font-bold leading-7 ${cls}`}>{txt}</span></td>;
                                    })}
                                    {showHSIA && <>
                                        <td className="p-3 text-center font-semibold text-emerald-600">{h}</td>
                                        <td className="p-3 text-center text-amber-600">{s}</td>
                                        <td className="p-3 text-center text-blue-600">{iz}</td>
                                        <td className="p-3 text-center text-rose-600">{a}</td>
                                    </>}
                                    <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(pct)}`}>{pct}%</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ===================== RENDER CONTENT =====================
    const renderContent = () => {
        if (!rekapData || rekapData.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <ClipboardCheck className="mx-auto h-16 w-16 text-slate-300 mb-4"/>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada data</h3>
                    <p className="text-slate-500">Silakan pilih semester, kelas, dan filter yang sesuai</p>
                </div>
            );
        }

        // -------- KELAS --------
        if (type === 'kelas') {
            const rekap           = (rekapData && rekapData[0]) || {};
            const detailSemua     = rekap.detail_semua || [];
            const tanggalPertemuan = rekap.tanggalPertemuan || [];
            const totalPertemuan  = rekap.total_pertemuan || 0;

            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 text-sm">Rekap Kelas</p>
                                <h2 className="text-2xl font-bold">Kelas {rekap.kelas}</h2>
                                <p className="text-blue-100 mt-1">Semua Mapel | Total Pertemuan: {totalPertemuan} kali</p>
                            </div>
                            <School size={48} className="text-blue-300/50"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[['Total Hadir','text-emerald-600',rekap.hadir||0],['Total Sakit','text-amber-600',rekap.sakit||0],['Total Izin','text-blue-600',rekap.izin||0],['Total Alpha','text-rose-600',rekap.alpha||0]].map(([label,color,val]) => (
                            <div key={label as string} className="bg-white rounded-xl p-4 border shadow-sm text-center">
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>
                    <ToggleViewMode/>
                    {viewMode === 'semester'
                        ? renderTabelSemesterKolom(detailSemua, tanggalPertemuan, false)
                        : renderTabelPerBulan(detailSemua, tanggalPertemuan)
                    }
                </div>
            );
        }

        // -------- SISWA --------
        if (type === 'siswa') {
            const rekapMapel = (rekapData && rekapData.rekap_mapel) || [];
            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-100 text-sm">Rekap Per Individu Siswa</p>
                                <h2 className="text-2xl font-bold">{selectedSiswa?.nama_siswa || 'Siswa'}</h2>
                                <p className="text-emerald-100 mt-1">NIS: {selectedSiswa?.nis} | Kelas: {kelas}</p>
                            </div>
                            <User size={48} className="text-emerald-300/50"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            ['Total Hadir','text-emerald-600',rekapMapel.reduce((s:number,m:any)=>s+(m.hadir||0),0)],
                            ['Sakit','text-amber-600',rekapMapel.reduce((s:number,m:any)=>s+(m.sakit||0),0)],
                            ['Izin','text-blue-600',rekapMapel.reduce((s:number,m:any)=>s+(m.izin||0),0)],
                            ['Alpha','text-rose-600',rekapMapel.reduce((s:number,m:any)=>s+(m.alpha||0),0)],
                            ['Rata-rata','text-indigo-600',Math.round(rekapMapel.reduce((s:number,m:any)=>s+(m.persentase||0),0)/(rekapMapel.length||1))+'%'],
                        ].map(([label,color,val]) => (
                            <div key={label as string} className="bg-white rounded-xl p-4 border shadow-sm text-center">
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b">
                                        {['No','Mata Pelajaran','Hadir','Sakit','Izin','Alpha','% Hadir','Pertemuan'].map(h => (
                                            <th key={h} className="p-4 font-bold text-slate-600 text-center first:text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rekapMapel.map((m: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="p-4">{idx+1}</td>
                                            <td className="p-4 font-medium">{m.mapel}</td>
                                            <td className="p-4 text-center text-emerald-600 font-semibold">{m.hadir}</td>
                                            <td className="p-4 text-center text-amber-600">{m.sakit}</td>
                                            <td className="p-4 text-center text-blue-600">{m.izin}</td>
                                            <td className="p-4 text-center text-rose-600">{m.alpha}</td>
                                            <td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(m.persentase)}`}>{m.persentase}%</span></td>
                                            <td className="p-4 text-center text-slate-600">{m.total_pertemuan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        // -------- MAPEL --------
        if (type === 'mapel') {
            const rekap           = rekapData || {};
            const rekapSiswa      = rekap.rekap_siswa || [];
            const tanggalPertemuan = rekap.tanggal_pertemuan || [];
            const totalPertemuan  = rekap.total_pertemuan || 0;
            const statistik       = rekap.statistik || {};

            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-100 text-sm">Rekap Per Mata Pelajaran</p>
                                <h2 className="text-2xl font-bold">{rekap.mapel}</h2>
                                <p className="text-purple-100 mt-1">Kelas: {rekap.kelas} | Total Pertemuan: {totalPertemuan} kali</p>
                            </div>
                            <BookOpen size={48} className="text-purple-300/50"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            ['Rata-rata Kelas','text-purple-600',(statistik.rata_rata_kelas||0)+'%'],
                            ['Sangat Baik (≥90%)','text-emerald-600',statistik.predikat?.sangat_baik||0],
                            ['Baik (75-89%)','text-blue-600',statistik.predikat?.baik||0],
                            ['Kurang (<60%)','text-rose-600',statistik.predikat?.kurang||0],
                        ].map(([label,color,val]) => (
                            <div key={label as string} className="bg-white rounded-xl p-4 border shadow-sm text-center">
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>
                    <ToggleViewMode/>
                    {viewMode === 'semester'
                        ? renderTabelSemesterKolom(
                            rekapSiswa.map((s:any) => ({ siswa: s, status_by_date: s.status_by_date })),
                            tanggalPertemuan, true
                          )
                        : renderTabelPerBulan(
                            rekapSiswa.map((s:any) => ({ siswa: s, status_by_date: s.status_by_date })),
                            tanggalPertemuan
                          )
                    }
                    {(statistik.siswa_terbaik?.length > 0 || statistik.siswa_bermasalah?.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {statistik.siswa_terbaik?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="text-yellow-500" size={20}/> Siswa Terbaik</h3>
                                    <div className="space-y-3">
                                        {statistik.siswa_terbaik.slice(0,3).map((siswa:any, idx:number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx+1}</div>
                                                    <div><p className="font-medium text-slate-900">{siswa.nama_siswa}</p><p className="text-xs text-slate-500">NIS: {siswa.nis}</p></div>
                                                </div>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">{siswa.persentase}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {statistik.siswa_bermasalah?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertCircle className="text-rose-500" size={20}/> Perlu Perhatian</h3>
                                    <div className="space-y-3">
                                        {statistik.siswa_bermasalah.slice(0,3).map((siswa:any, idx:number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">!</div>
                                                    <div><p className="font-medium text-slate-900">{siswa.nama_siswa}</p><p className="text-xs text-slate-500">NIS: {siswa.nis}</p></div>
                                                </div>
                                                <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">{siswa.persentase}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    };

    const hasData = (() => {
        if (type === 'kelas') return rekapData && rekapData.length > 0;
        if (type === 'mapel') return rekapData && rekapData.rekap_siswa?.length > 0;
        if (type === 'siswa') return rekapData && rekapData.rekap_mapel?.length > 0;
        return false;
    })();

    // ===================== EXPORT MENU KONTEKSTUAL =====================
    const renderExportMenu = () => {
        if (type === 'kelas') return (
            <>
                <div className="px-4 py-2.5 bg-slate-50 border-b">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Export Rekap Kelas</p>
                </div>
                <button onClick={handleExportKelasSemester} className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-start gap-3 border-b">
                    <ClipboardCheck size={18} className="text-indigo-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Per Semester — Semua Mapel</p>
                        <p className="text-xs text-slate-400">Rekap semua mapel selama 1 semester</p>
                    </div>
                </button>
                <button onClick={handleExportKelasBulan} className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-start gap-3">
                    <Calendar size={18} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Per Bulan — Semua Mapel</p>
                        <p className="text-xs text-slate-400">Tabel tanggal per bulan yang dipilih</p>
                        {viewMode === 'bulan' && !selectedBulan && <p className="text-xs text-amber-500 mt-0.5">⚠ Pilih bulan di toggle tampilan</p>}
                        {viewMode !== 'bulan' && <p className="text-xs text-amber-500 mt-0.5">⚠ Aktifkan mode "Per Bulan" lalu pilih bulan</p>}
                    </div>
                </button>
            </>
        );

        if (type === 'mapel') return (
            <>
                <div className="px-4 py-2.5 bg-slate-50 border-b">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Export Rekap Mapel</p>
                    <p className="text-xs text-slate-400 mt-0.5">{fMapel}</p>
                </div>
                <button onClick={handleExportMapelSemester} className="w-full text-left px-4 py-3 hover:bg-purple-50 transition flex items-start gap-3 border-b">
                    <ClipboardCheck size={18} className="text-purple-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Per Semester</p>
                        <p className="text-xs text-slate-400">Rekap mapel ini selama 1 semester</p>
                    </div>
                </button>
                <button onClick={handleExportMapelBulan} className="w-full text-left px-4 py-3 hover:bg-purple-50 transition flex items-start gap-3">
                    <Calendar size={18} className="text-indigo-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Per Bulan</p>
                        <p className="text-xs text-slate-400">Tabel tanggal mapel ini untuk bulan dipilih</p>
                        {viewMode === 'bulan' && !selectedBulan && <p className="text-xs text-amber-500 mt-0.5">⚠ Pilih bulan di toggle tampilan</p>}
                        {viewMode !== 'bulan' && <p className="text-xs text-amber-500 mt-0.5">⚠ Aktifkan mode "Per Bulan" lalu pilih bulan</p>}
                    </div>
                </button>
            </>
        );

        if (type === 'siswa') return (
            <>
                <div className="px-4 py-2.5 bg-slate-50 border-b">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Export Rekap Siswa</p>
                </div>
                <button onClick={handleExportSiswaSemester} className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition flex items-start gap-3">
                    <Users size={18} className="text-emerald-500 mt-0.5 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Per Siswa — Per Semester</p>
                        <p className="text-xs text-slate-400">Tiap siswa 1 halaman, semua mapel</p>
                    </div>
                </button>
            </>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi Semester"/>
            <ModalDetailSiswa/>

            <div className="p-4 md:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ClipboardCheck className="text-blue-500" size={32}/>
                            Rekap Absensi Semester
                        </h1>
                        <p className="text-slate-500 mt-1">Laporan kehadiran siswa per semester lengkap</p>
                    </div>

                    {/* Export Button Dropdown */}
                    {isFilterActive && hasData && (
                        <div className="relative" ref={exportMenuRef}>
                            <button onClick={() => setShowExportMenu(!showExportMenu)}
                                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg">
                                <Download size={18}/>
                                Export PDF
                                <ChevronDown size={16} className={`transition-transform ${showExportMenu?'rotate-180':''}`}/>
                            </button>
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20">
                                    {renderExportMenu()}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tab Type */}
                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl w-fit">
                    {[['kelas','Rekap Per Kelas',Users],['mapel','Rekap Per Mapel',BookOpen],['siswa','Rekap Per Siswa',User]].map(([val, label, Icon]: any) => (
                        <button key={val} onClick={() => handleTabChange(val)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${type===val?'bg-white shadow-md text-blue-600':'text-slate-500 hover:text-slate-700'}`}>
                            <Icon size={16}/> {label}
                        </button>
                    ))}
                </div>

                {/* Filter Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400"/>
                            <span className="font-semibold text-slate-700">Filter Pencarian</span>
                            {isFilterActive && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Aktif</span>}
                        </div>
                        <span className="text-slate-400">{showFilters?'▲':'▼'}</span>
                    </button>

                    {(showFilters || !isFilterActive) && (
                        <div className="px-5 pb-5 border-t pt-4">
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tahun Ajaran <span className="text-rose-500">*</span></label>
                                        <select value={tahunAjaran} onChange={e => setTahunAjaran(e.target.value)} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50">
                                            {tahunAjaranOptions.map(ta => <option key={ta} value={ta}>{ta}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Semester <span className="text-rose-500">*</span></label>
                                        <select value={semester} onChange={e => { setSemester(e.target.value); setSelectedBulan(''); }} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50">
                                            <option value="">-- Pilih Semester --</option>
                                            {semesterOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kelas <span className="text-rose-500">*</span></label>
                                        <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50">
                                            <option value="">-- Pilih Kelas --</option>
                                            {kelasOptions.map((k:string) => <option key={k} value={k}>Kelas {k}</option>)}
                                        </select>
                                    </div>
                                    {type === 'mapel' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Mata Pelajaran <span className="text-rose-500">*</span></label>
                                            <select value={mapel} onChange={e => setMapel(e.target.value)} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50">
                                                <option value="">-- Pilih Mapel --</option>
                                                {mapelOptions.map((m:string) => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    {type === 'siswa' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Siswa <span className="text-rose-500">*</span></label>
                                            <select value={idSiswa} onChange={e => setIdSiswa(e.target.value)} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50" disabled={!kelas}>
                                                <option value="">-- Pilih Siswa --</option>
                                                {siswaOptions.map((s:any) => <option key={s.id_siswa} value={s.id_siswa}>{s.nama_siswa} ({s.nis})</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">Tampilkan Rekap</button>
                                    {isFilterActive && (
                                        <button type="button" onClick={resetFilter} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition">Reset</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {renderContent()}
            </div>
        </AppLayout>
    );
}