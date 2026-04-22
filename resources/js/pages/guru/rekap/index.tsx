import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    ClipboardCheck, BookOpen, User, Users, Download, X, 
    Eye, Filter, CheckCircle2, AlertCircle, TrendingUp, 
    TrendingDown, Award, School
} from 'lucide-react';
import { useState } from 'react';

const semesterOptions = [
    { value: 'ganjil', label: 'Semester Ganjil (Juli - Desember)' },
    { value: 'genap', label: 'Semester Genap (Januari - Juni)' }
];

const tahunAjaranOptions = [
    '2023/2024',
    '2024/2025',
    '2025/2026'
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

    const [type, setType] = useState(initialType || 'kelas');
    const [semester, setSemester] = useState(filters?.semester || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters?.tahun_ajaran || tahun_ajaran || '2024/2025');
    const [kelas, setKelas] = useState(filters?.kelas || '');
    const [mapel, setMapel] = useState(filters?.mapel || '');
    const [idSiswa, setIdSiswa] = useState(filters?.id_siswa || '');

    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [detailType, setDetailType] = useState<'kelas' | 'mapel' | 'siswa'>('kelas');

    const isFilterActive = semester && kelas && (type !== 'mapel' || mapel) && (type !== 'siswa' || idSiswa);

    const handleTabChange = (newType: string) => {
        setType(newType);
        if (newType === 'siswa') {
            setMapel('');
        } else if (newType === 'mapel') {
            setIdSiswa('');
        }
        router.get(route('guru.rekap.index'), { 
            type: newType, 
            semester, 
            kelas, 
            mapel: newType === 'mapel' ? mapel : undefined,
            id_siswa: newType === 'siswa' ? idSiswa : undefined,
            tahun_ajaran: tahunAjaran 
        }, { preserveState: true });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!semester || !kelas) {
            alert('Semester dan Kelas wajib dipilih!');
            return;
        }
        
        const params: any = { type, semester, kelas, tahun_ajaran: tahunAjaran };
        if (type === 'mapel' && mapel) params.mapel = mapel;
        if (type === 'siswa' && idSiswa) params.id_siswa = idSiswa;
        
        router.get(route('guru.rekap.index'), params, { preserveState: true, replace: true });
    };

    const resetFilter = () => {
        setSemester('');
        setKelas('');
        setMapel('');
        setIdSiswa('');
        router.get(route('guru.rekap.index'), { type, tahun_ajaran: tahunAjaran }, { preserveState: true });
    };

    const handleExportPDF = () => {
        let url = '';
        const params = new URLSearchParams({
            semester: filters?.semester || semester,
            tahun_ajaran: filters?.tahun_ajaran || tahunAjaran
        });

        if (type === 'kelas') {
            params.append('kelas', filters?.kelas || kelas);
            url = route('guru.rekap.export.kelas') + '?' + params.toString();
        } else if (type === 'mapel') {
            params.append('kelas', filters?.kelas || kelas);
            params.append('mapel', filters?.mapel || mapel);
            url = route('guru.rekap.export.mapel') + '?' + params.toString();
        } else if (type === 'siswa') {
            params.append('id_siswa', filters?.id_siswa || idSiswa);
            url = route('guru.rekap.export.siswa') + '?' + params.toString();
        }

        if (url) {
            // Buat link element untuk download langsung
            const link = document.createElement('a');
            link.href = url;
            link.download = ''; // Biarkan browser menentukan nama file dari response
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getPersentaseColor = (persentase: number) => {
        if (persentase >= 90) return 'text-emerald-600 bg-emerald-50';
        if (persentase >= 75) return 'text-blue-600 bg-blue-50';
        if (persentase >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-rose-600 bg-rose-50';
    };

    const getPredikatLabel = (persentase: number) => {
        if (persentase >= 90) return 'Sangat Baik';
        if (persentase >= 75) return 'Baik';
        if (persentase >= 60) return 'Cukup';
        return 'Kurang';
    };

    const renderContent = () => {
        if (!rekapData || rekapData.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <ClipboardCheck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada data</h3>
                    <p className="text-slate-500">Silakan pilih semester, kelas, dan filter yang sesuai</p>
                </div>
            );
        }

        if (type === 'kelas') {
            const rekap = (rekapData && rekapData[0]) || {};
            const detailSemua = rekap.detail_semua || [];
            const tanggalPertemuan = rekap.tanggalPertemuan || [];
            const totalPertemuan = rekap.total_pertemuan || 0;
            
            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 text-sm">Rekap Kelas</p>
                                <h2 className="text-2xl font-bold">Kelas {rekap.kelas}</h2>
                                <p className="text-blue-100 mt-1">Mapel: {rekap.mapel} | Total Pertemuan: {totalPertemuan} kali</p>
                            </div>
                            <School size={48} className="text-blue-300/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Total Hadir</p>
                            <p className="text-2xl font-bold text-emerald-600">{rekap.hadir || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Total Sakit</p>
                            <p className="text-2xl font-bold text-amber-600">{rekap.sakit || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Total Izin</p>
                            <p className="text-2xl font-bold text-blue-600">{rekap.izin || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Total Alpha</p>
                            <p className="text-2xl font-bold text-rose-600">{rekap.alpha || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-100 border-b">
                                        <th className="p-3 font-bold text-slate-700">No</th>
                                        <th className="p-3 font-bold text-slate-700">NIS</th>
                                        <th className="p-3 font-bold text-slate-700">Nama Siswa</th>
                                        <th className="p-3 font-bold text-slate-700">L/P</th>
                                        {tanggalPertemuan.map((tgl: string, idx: number) => (
                                            <th key={idx} className="p-2 text-center text-xs font-bold text-slate-600">
                                                {new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </th>
                                        ))}
                                        <th className="p-3 text-center font-bold text-slate-700">% Hadir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {detailSemua.map((item: any, idx: number) => {
                                        const siswa = item.siswa;
                                        const statusByDate = item.statusByDate || {};
                                        let totalHadir = 0;
                                        
                                        // Hitung total hadir untuk siswa ini
                                        tanggalPertemuan.forEach((tgl: string) => {
                                            if (statusByDate[tgl] === 'hadir') totalHadir++;
                                        });
                                        
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="p-3">{idx + 1}</td>
                                                <td className="p-3 font-mono text-xs">{siswa?.nis}</td>
                                                <td className="p-3 font-medium">{siswa?.nama_siswa}</td>
                                                <td className="p-3 text-center">{siswa?.jenis_kelamin === 'perempuan' ? 'P' : 'L'}</td>
                                                
                                                {tanggalPertemuan.map((tgl: string, tIdx: number) => {
                                                    const status = statusByDate[tgl];
                                                    let statusColor = '';
                                                    let statusText = '';
                                                    
                                                    if (status === 'hadir') {
                                                        statusColor = 'bg-emerald-100 text-emerald-700';
                                                        statusText = 'H';
                                                    } else if (status === 'sakit') {
                                                        statusColor = 'bg-amber-100 text-amber-700';
                                                        statusText = 'S';
                                                    } else if (status === 'izin') {
                                                        statusColor = 'bg-blue-100 text-blue-700';
                                                        statusText = 'I';
                                                    } else if (status === 'alpha') {
                                                        statusColor = 'bg-rose-100 text-rose-700';
                                                        statusText = 'A';
                                                    } else {
                                                        statusColor = 'bg-slate-100 text-slate-400';
                                                        statusText = '-';
                                                    }
                                                    
                                                    return (
                                                        <td key={tIdx} className="p-2 text-center">
                                                            <span className={`inline-block w-7 h-7 rounded-full text-xs font-bold leading-7 ${statusColor}`}>
                                                                {statusText}
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                                
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(totalPertemuan > 0 ? Math.round((totalHadir / totalPertemuan) * 100) : 0)}`}>
                                                        {totalPertemuan > 0 ? Math.round((totalHadir / totalPertemuan) * 100) : 0}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
        
        else if (type === 'siswa') {
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
                            <User size={48} className="text-emerald-300/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Total Hadir</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {rekapMapel.reduce((sum: number, m: any) => sum + (m.hadir || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Sakit</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {rekapMapel.reduce((sum: number, m: any) => sum + (m.sakit || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Izin</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {rekapMapel.reduce((sum: number, m: any) => sum + (m.izin || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Alpha</p>
                            <p className="text-2xl font-bold text-rose-600">
                                {rekapMapel.reduce((sum: number, m: any) => sum + (m.alpha || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Rata-rata Hadir</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {Math.round(rekapMapel.reduce((sum: number, m: any) => sum + (m.persentase || 0), 0) / (rekapMapel.length || 1))}%
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b">
                                        <th className="p-4 font-bold text-slate-600">No</th>
                                        <th className="p-4 font-bold text-slate-600">Mata Pelajaran</th>
                                        <th className="p-4 text-center font-bold text-slate-600">Hadir</th>
                                        <th className="p-4 text-center font-bold text-slate-600">Sakit</th>
                                        <th className="p-4 text-center font-bold text-slate-600">Izin</th>
                                        <th className="p-4 text-center font-bold text-slate-600">Alpha</th>
                                        <th className="p-4 text-center font-bold text-slate-600">% Hadir</th>
                                        <th className="p-4 text-center font-bold text-slate-600">Pertemuan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rekapMapel.map((mapelItem: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="p-4">{idx + 1}</td>
                                            <td className="p-4 font-medium">{mapelItem.mapel}</td>
                                            <td className="p-4 text-center text-emerald-600 font-semibold">{mapelItem.hadir}</td>
                                            <td className="p-4 text-center text-amber-600">{mapelItem.sakit}</td>
                                            <td className="p-4 text-center text-blue-600">{mapelItem.izin}</td>
                                            <td className="p-4 text-center text-rose-600">{mapelItem.alpha}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(mapelItem.persentase)}`}>
                                                    {mapelItem.persentase}%
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-slate-600">{mapelItem.total_pertemuan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
        
        else if (type === 'mapel') {
            const rekap = rekapData || {};
            const rekapSiswa = rekap.rekap_siswa || [];
            const tanggalPertemuan = rekap.tanggal_pertemuan || [];
            const totalPertemuan = rekap.total_pertemuan || 0;
            const statistik = rekap.statistik || {};
            
            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-100 text-sm">Rekap Per Mata Pelajaran</p>
                                <h2 className="text-2xl font-bold">{rekap.mapel}</h2>
                                <p className="text-purple-100 mt-1">Kelas: {rekap.kelas} | Total Pertemuan: {totalPertemuan} kali</p>
                            </div>
                            <BookOpen size={48} className="text-purple-300/50" />
                        </div>
                    </div>

                    {/* Statistik Ringkasan */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Rata-rata Kelas</p>
                            <p className="text-2xl font-bold text-purple-600">{statistik.rata_rata_kelas || 0}%</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Sangat Baik (≥90%)</p>
                            <p className="text-2xl font-bold text-emerald-600">{statistik.predikat?.sangat_baik || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Baik (75-89%)</p>
                            <p className="text-2xl font-bold text-blue-600">{statistik.predikat?.baik || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
                            <p className="text-xs text-slate-400">Kurang (&lt;60%)</p>
                            <p className="text-2xl font-bold text-rose-600">{statistik.predikat?.kurang || 0}</p>
                        </div>
                    </div>

                    {/* Tabel Rekap Siswa */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-100 border-b">
                                        <th className="p-3 font-bold text-slate-700">No</th>
                                        <th className="p-3 font-bold text-slate-700">NIS</th>
                                        <th className="p-3 font-bold text-slate-700">Nama Siswa</th>
                                        <th className="p-3 font-bold text-slate-700">L/P</th>
                                        {tanggalPertemuan.map((tgl: string, idx: number) => (
                                            <th key={idx} className="p-2 text-center text-xs font-bold text-slate-600">
                                                {new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </th>
                                        ))}
                                        <th className="p-3 text-center font-bold text-slate-700">H</th>
                                        <th className="p-3 text-center font-bold text-slate-700">S</th>
                                        <th className="p-3 text-center font-bold text-slate-700">I</th>
                                        <th className="p-3 text-center font-bold text-slate-700">A</th>
                                        <th className="p-3 text-center font-bold text-slate-700">% Hadir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {rekapSiswa.map((siswa: any, idx: number) => {
                                        const statusByDate = siswa.status_by_date || {};
                                        
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="p-3">{idx + 1}</td>
                                                <td className="p-3 font-mono text-xs">{siswa.nis}</td>
                                                <td className="p-3 font-medium">{siswa.nama_siswa}</td>
                                                <td className="p-3 text-center">{siswa.jenis_kelamin === 'perempuan' ? 'P' : 'L'}</td>
                                                
                                                {tanggalPertemuan.map((tgl: string, tIdx: number) => {
                                                    const status = statusByDate[tgl];
                                                    let statusColor = '';
                                                    let statusText = '';
                                                    
                                                    if (status === 'hadir') {
                                                        statusColor = 'bg-emerald-100 text-emerald-700';
                                                        statusText = 'H';
                                                    } else if (status === 'sakit') {
                                                        statusColor = 'bg-amber-100 text-amber-700';
                                                        statusText = 'S';
                                                    } else if (status === 'izin') {
                                                        statusColor = 'bg-blue-100 text-blue-700';
                                                        statusText = 'I';
                                                    } else if (status === 'alpha') {
                                                        statusColor = 'bg-rose-100 text-rose-700';
                                                        statusText = 'A';
                                                    } else {
                                                        statusColor = 'bg-slate-100 text-slate-400';
                                                        statusText = '-';
                                                    }
                                                    
                                                    return (
                                                        <td key={tIdx} className="p-2 text-center">
                                                            <span className={`inline-block w-7 h-7 rounded-full text-xs font-bold leading-7 ${statusColor}`}>
                                                                {statusText}
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                                
                                                <td className="p-3 text-center font-semibold text-emerald-600">{siswa.hadir}</td>
                                                <td className="p-3 text-center text-amber-600">{siswa.sakit}</td>
                                                <td className="p-3 text-center text-blue-600">{siswa.izin}</td>
                                                <td className="p-3 text-center text-rose-600">{siswa.alpha}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPersentaseColor(siswa.persentase)}`}>
                                                        {siswa.persentase}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Siswa Terbaik dan Bermasalah */}
                    {(statistik.siswa_terbaik?.length > 0 || statistik.siswa_bermasalah?.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {statistik.siswa_terbaik?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Award className="text-yellow-500" size={20} />
                                        Siswa Terbaik
                                    </h3>
                                    <div className="space-y-3">
                                        {statistik.siswa_terbaik.slice(0, 3).map((siswa: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{siswa.nama_siswa}</p>
                                                        <p className="text-xs text-slate-500">NIS: {siswa.nis}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                                    {siswa.persentase}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {statistik.siswa_bermasalah?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-rose-500" size={20} />
                                        Perlu Perhatian
                                    </h3>
                                    <div className="space-y-3">
                                        {statistik.siswa_bermasalah.slice(0, 3).map((siswa: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        !
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{siswa.nama_siswa}</p>
                                                        <p className="text-xs text-slate-500">NIS: {siswa.nis}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                                    {siswa.persentase}%
                                                </span>
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi Semester" />

            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ClipboardCheck className="text-blue-500" size={32} />
                            Rekap Absensi Semester
                        </h1>
                        <p className="text-slate-500 mt-1">Laporan kehadiran siswa per semester lengkap</p>
                    </div>
                    
                    {isFilterActive && rekapData && rekapData.length > 0 && (
                        <button
                            onClick={handleExportPDF}
                            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
                        >
                            <Download size={18} /> Export PDF
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl w-fit">
                    <button
                        onClick={() => handleTabChange('kelas')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                            ${type === 'kelas' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Users size={16} /> Rekap Per Kelas
                    </button>
                    <button
                        onClick={() => handleTabChange('mapel')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                            ${type === 'mapel' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BookOpen size={16} /> Rekap Per Mapel
                    </button>
                    <button
                        onClick={() => handleTabChange('siswa')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                            ${type === 'siswa' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <User size={16} /> Rekap Per Siswa
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span className="font-semibold text-slate-700">Filter Pencarian</span>
                            {isFilterActive && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    Aktif
                                </span>
                            )}
                        </div>
                        <span className="text-slate-400">{showFilters ? '▲' : '▼'}</span>
                    </button>

                    {(showFilters || !isFilterActive) && (
                        <div className="px-5 pb-5 border-t pt-4">
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                            Tahun Ajaran <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={tahunAjaran}
                                            onChange={(e) => setTahunAjaran(e.target.value)}
                                            className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50"
                                        >
                                            {tahunAjaranOptions.map(ta => (
                                                <option key={ta} value={ta}>{ta}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                            Semester <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={semester}
                                            onChange={(e) => setSemester(e.target.value)}
                                            className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50"
                                        >
                                            <option value="">-- Pilih Semester --</option>
                                            {semesterOptions.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                            Kelas <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={kelas}
                                            onChange={(e) => setKelas(e.target.value)}
                                            className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50"
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {kelasOptions && kelasOptions.map((k: string) => (
                                                <option key={k} value={k}>Kelas {k}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {type === 'mapel' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                                Mata Pelajaran <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={mapel}
                                                onChange={(e) => setMapel(e.target.value)}
                                                className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50"
                                            >
                                                <option value="">-- Pilih Mapel --</option>
                                                {mapelOptions && mapelOptions.map((m: string) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {type === 'siswa' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                                Nama Siswa <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={idSiswa}
                                                onChange={(e) => setIdSiswa(e.target.value)}
                                                className="w-full border-slate-200 rounded-xl focus:ring-blue-500 h-11 bg-slate-50"
                                                disabled={!kelas}
                                            >
                                                <option value="">-- Pilih Siswa --</option>
                                                {siswaOptions && siswaOptions.map((s: any) => (
                                                    <option key={s.id_siswa} value={s.id_siswa}>
                                                        {s.nama_siswa} ({s.nis})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                                    >
                                        Tampilkan Rekap
                                    </button>
                                    {isFilterActive && (
                                        <button
                                            type="button"
                                            onClick={resetFilter}
                                            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition"
                                        >
                                            Reset
                                        </button>
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