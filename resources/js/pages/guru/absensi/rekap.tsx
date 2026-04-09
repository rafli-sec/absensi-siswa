import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Download, Printer, ChevronLeft, ChevronRight, Users, BookOpen, CalendarDays, Filter 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
}
 from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RekapData {
  nama_siswa: string;
  nis: string;
  mapel: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  total_hari: number;
  persen_kehadiran: string;
}

export default function Rekap({ rekap = [], filters, kelasOptions, mapelOptions }: any) {
  const [showPrintView, setShowPrintView] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Nama Siswa', 'NIS', 'Mapel', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Total Hari', '% Kehadiran'];
    const csvContent = [
      headers.join(','),
      ...rekap.map((row: RekapData) => [
        `"${row.nama_siswa}"`,
        row.nis,
        `"${row.mapel}"`,
        row.hadir,
        row.sakit,
        row.izin,
        row.alpha,
        row.total_hari,
        row.persen_kehadiran
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap-absensi-${filters.kelas}-${filters.start_date}-to-${filters.end_date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => window.print(), 500);
  };

  const updateFilters = (newFilters: any) => {
    router.get(route('guru.absensi.rekap'), { ...filters, ...newFilters }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Absensi', href: route('guru.absensi.index') },
      { title: 'Rekap Mapel', href: '#' }
    ]}>
      <Head title="Rekap Absensi Mapel" />

      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Rekap Absensi per Mapel</h1>
            <p className="text-slate-600 mt-1">Laporan akhir semester berdasarkan mata pelajaran</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer size={16} />
              Print
            </Button>
            <Button onClick={handleExportCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="rounded-3xl shadow-xl">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <Filter size={20} />
              Filter Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-bold text-slate-600 mb-2 block">Kelas</Label>
              <Select value={filters.kelas || ''} onValueChange={(val) => updateFilters({ kelas: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasOptions.map((k: string) => (
                    <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-bold text-slate-600 mb-2 block">Mapel</Label>
              <Select value={filters.mapel || ''} onValueChange={(val) => updateFilters({ mapel: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Mapel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Mapel</SelectItem>
                  {mapelOptions.map((m: string) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-bold text-slate-600 mb-2 block">Mulai Tanggal</Label>
              <Input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => updateFilters({ start_date: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-bold text-slate-600 mb-2 block">Selesai Tanggal</Label>
              <Input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => updateFilters({ end_date: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rekap Table */}
        <Card className="rounded-3xl shadow-xl overflow-hidden">
          <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <Users size={24} className="text-blue-600" />
                  Data Rekapitulasi
                </CardTitle>
                <p className="text-slate-600 mt-1">
                  Kelas {filters.kelas} | {filters.mapel || 'Semua Mapel'} |{' '}
                  {filters.start_date} s/d {filters.end_date}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg font-black px-4 py-2">
                {rekap.length} Siswa
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b-2 border-slate-200">
                    <TableHead className="font-black text-slate-700 w-48">Nama Siswa</TableHead>
                    <TableHead className="font-black text-slate-700 w-24 text-center">NIS</TableHead>
                    <TableHead className="font-black text-slate-700 w-40 text-center">Mapel</TableHead>
                    <TableHead className="font-black text-slate-700 text-center">Hadir</TableHead>
                    <TableHead className="font-black text-slate-700 text-center">Sakit</TableHead>
                    <TableHead className="font-black text-slate-700 text-center">Izin</TableHead>
                    <TableHead className="font-black text-slate-700 text-center">Alpha</TableHead>
                    <TableHead className="font-black text-slate-700 text-center w-28">Total Hari</TableHead>
                    <TableHead className="font-black text-slate-700 text-center w-24 font-bold text-lg">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekap.length > 0 ? (
                    rekap.map((row: RekapData, index: number) => (
                      <TableRow key={index} className="hover:bg-slate-50/50 border-b border-slate-100">
                        <TableCell className="font-semibold text-slate-800">{row.nama_siswa}</TableCell>
                        <TableCell className="text-center font-mono text-sm">{row.nis}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{row.mapel}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600">{row.hadir}</TableCell>
                        <TableCell className="text-center font-bold text-amber-600">{row.sakit}</TableCell>
                        <TableCell className="text-center font-bold text-blue-600">{row.izin}</TableCell>
                        <TableCell className="text-center font-bold text-rose-600">{row.alpha}</TableCell>
                        <TableCell className="text-center font-bold text-slate-700">{row.total_hari}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(row.persen_kehadiran) >= 80 ? "default" : "secondary"} className="w-full justify-center font-bold text-lg">
                            {row.persen_kehadiran}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center py-12 text-slate-400">
                        <CalendarDays className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <div>
                          <p className="text-lg font-semibold text-slate-500 mb-1">Tidak ada data rekap</p>
                          <p className="text-sm">Pilih kelas dan rentang tanggal untuk melihat rekapitulasi</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <style jsx>{`
          @media print {
            .no-print { display: none !important; }
            body { font-size: 12pt !important; }
            table { width: 100%; page-break-inside: avoid; }
            th, td { border: 1px solid #ddd !important; padding: 8px !important; }
            .print-title { font-size: 18pt !important; text-align: center; margin: 20px 0; }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
