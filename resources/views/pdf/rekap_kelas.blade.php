<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Kelas {{ $kelas }} - Semester {{ $semester }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 10px; 
            color: #1e293b;
            padding: 20px;
            background: white;
        }
        
        /* Header */
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 16px; margin: 0; color: #0f172a; }
        .header h2 { font-size: 14px; margin: 5px 0; color: #334155; }
        .header p { font-size: 11px; color: #64748b; margin-top: 3px; }
        
        /* Info Sekolah */
        .school-info { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #0f172a; padding-bottom: 10px; }
        .school-info h3 { font-size: 18px; margin: 0; }
        .school-info p { font-size: 11px; margin: 3px 0; }
        
        /* Info Table */
        .info-table { width: 100%; margin-bottom: 15px; border-collapse: collapse; font-size: 10px; }
        .info-table td { padding: 4px 8px; border: 1px solid #cbd5e1; background: #f8fafc; }
        .info-table td:first-child { width: 15%; font-weight: bold; background: #f1f5f9; }
        
        /* Main Table */
        .main-table { width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 20px; }
        .main-table th, .main-table td { border: 1px solid #94a3b8; padding: 6px 4px; text-align: center; vertical-align: middle; }
        .main-table th { background-color: #e2e8f0; font-weight: bold; color: #0f172a; }
        .main-table .text-left { text-align: left; }
        .main-table .font-bold { font-weight: bold; }
        
        /* Warna Status */
        .bg-emerald { background-color: #d1fae5; }
        .bg-amber { background-color: #fed7aa; }
        .bg-rose { background-color: #ffe4e6; }
        .bg-blue { background-color: #dbeafe; }
        
        /* Ringkasan */
        .summary { margin-bottom: 20px; }
        .summary-box { 
            display: inline-block; 
            width: 23%; 
            margin: 0 1%; 
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            font-size: 10px;
        }
        .summary-box .value { font-size: 18px; font-weight: bold; }
        
        /* Footer */
        .footer { margin-top: 30px; }
        .signature { width: 100%; margin-top: 30px; }
        .signature td { padding-top: 40px; text-align: center; font-size: 10px; }
        .signature .line { border-top: 1px solid #000; width: 200px; margin-top: 5px; }
        
        /* Page Break */
        .page-break { page-break-before: always; }
        
        /* Predikat */
        .predikat-badge { 
            display: inline-block;
            padding: 2px 6px;
            border-radius: 20px;
            font-size: 8px;
            font-weight: bold;
        }
        .predikat-sangat-baik { background: #d1fae5; color: #065f46; }
        .predikat-baik { background: #dbeafe; color: #1e40af; }
        .predikat-cukup { background: #fed7aa; color: #9a3412; }
        .predikat-kurang { background: #ffe4e6; color: #9f1239; }
    </style>
</head>
<body>

    {{-- HEADER SEKOLAH --}}
    <div class="school-info">
        <h3>UPT SPF SMP NEGERI 51 MAKASSAR</h3>
        <p>Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235</p>
        <p>Email: uptspfsmpn51makassar@gmail.com</p>
        <p><strong>LAPORAN REKAP ABSENSI SEMESTER</strong></p>
    </div>

    {{-- INFO REKAP --}}
    <table class="info-table">
        <tr>
            <td>Kelas</td>
            <td colspan="3"><strong>{{ $kelas }}</strong></td>
            <td>Semester</td>
            <td colspan="3"><strong>{{ $semester }}</strong></td>
        </tr>
        <tr>
            <td>Tahun Ajaran</td>
            <td colspan="3"><strong>{{ $tahun_ajaran }}</strong></td>
            <td>Wali Kelas</td>
            <td colspan="3"><strong>{{ $guru }}</strong></td>
        </tr>
        <tr>
            <td>Total Siswa</td>
            <td colspan="3"><strong>{{ $rekapData[0]['statistik']['total_siswa'] ?? 0 }}</strong></td>
            <td>Tanggal Cetak</td>
            <td colspan="3"><strong>{{ date('d-m-Y H:i') }}</strong></td>
        </tr>
    </table>

    {{-- RINGKASAN STATISTIK KELAS --}}
    <div class="summary">
        <table style="width: 100%; margin-bottom: 15px;">
            <tr>
                <td style="background: #dbeafe; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: bold;">{{ $rekapData[0]['statistik']['rata_rata_kelas'] ?? 0 }}%</div>
                    <div style="font-size: 9px;">Rata-rata Kehadiran</div>
                </td>
                <td style="background: #d1fae5; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: bold;">{{ $rekapData[0]['statistik']['siswa_terbaik'][0]['persentase'] ?? 0 }}%</div>
                    <div style="font-size: 9px;">Kehadiran Tertinggi</div>
                    <div style="font-size: 8px;">{{ $rekapData[0]['statistik']['siswa_terbaik'][0]['nama_siswa'] ?? '-' }}</div>
                </td>
                <td style="background: #ffe4e6; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 20px; font-weight: bold;">{{ $rekapData[0]['statistik']['siswa_bermasalah']->count() ?? 0 }}</div>
                    <div style="font-size: 9px;">Siswa Perlu Perhatian</div>
                    <div style="font-size: 8px;">(&lt;70%)</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- TABEL REKAP SISWA --}}
    <table class="main-table">
        <thead>
            <tr>
                <th rowspan="2" width="5%">No</th>
                <th rowspan="2" width="10%">NIS</th>
                <th rowspan="2" width="25%">Nama Siswa</th>
                <th rowspan="2" width="5%">L/P</th>
                <th colspan="4">Total Kehadiran</th>
                <th rowspan="2" width="10%">% Hadir</th>
                <th rowspan="2" width="15%">Predikat</th>
            </tr>
            <tr>
                <th width="8%">Hadir</th>
                <th width="8%">Sakit</th>
                <th width="8%">Izin</th>
                <th width="8%">Alpha</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @foreach($rekapData[0]['detail_semua'] as $item)
                @php
                    $siswa = $item['siswa'];
                    $totalHadir = $item['total_hadir'];
                    $totalSakit = $item['total_sakit'];
                    $totalIzin = $item['total_izin'];
                    $totalAlpha = $item['total_alpha'];
                    $totalPertemuan = $item['total_pertemuan'];
                    
                    $persentase = $totalPertemuan > 0 ? round((($totalPertemuan - ($totalSakit + $totalIzin + $totalAlpha)) / $totalPertemuan) * 100) : 0;
                    
                    if ($persentase >= 90) $predikatClass = 'predikat-sangat-baik';
                    elseif ($persentase >= 75) $predikatClass = 'predikat-baik';
                    elseif ($persentase >= 60) $predikatClass = 'predikat-cukup';
                    else $predikatClass = 'predikat-kurang';
                    
                    $predikatLabel = $persentase >= 90 ? 'Sangat Baik' : ($persentase >= 75 ? 'Baik' : ($persentase >= 60 ? 'Cukup' : 'Kurang'));
                @endphp
                <tr>
                    <td>{{ $no++ }}</td>
                    <td>{{ $siswa['nis'] }}</td>
                    <td class="text-left">{{ $siswa['nama_siswa'] }}</td>
                    <td>{{ $siswa['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>
                    <td class="bg-emerald">{{ $totalHadir }}</td>
                    <td class="bg-amber">{{ $totalSakit }}</td>
                    <td class="bg-blue">{{ $totalIzin }}</td>
                    <td class="bg-rose">{{ $totalAlpha }}</td>
                    <td class="font-bold">{{ $persentase }}%</td>
                    <td>
                        <span class="predikat-badge {{ $predikatClass }}">{{ $predikatLabel }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- DETAIL PER MAPEL (halaman baru) --}}

    {{-- TABEL DETAIL KEHADIRAN PER TANGGAL --}}
    <div class="page-break"></div>
    
    <div class="school-info">
        <h3>SMP NEGERI 51 SURABAYA</h3>
        <p><strong>DETAIL KEHADIRAN PER TANGGAL</strong></p>
        <p>Kelas {{ $kelas }} - Semester {{ $semester }} - Tahun Ajaran {{ $tahun_ajaran }}</p>
    </div>

    <table class="main-table">
        <thead>
            <tr>
                <th rowspan="2" width="5%">No</th>
                <th rowspan="2" width="10%">NIS</th>
                <th rowspan="2" width="25%">Nama Siswa</th>
                <th rowspan="2" width="5%">L/P</th>
                @foreach($rekapData[0]['tanggalPertemuan'] as $index => $tanggal)
                    <th width="6%" style="font-size: 8px;">
                        {{ \Carbon\Carbon::parse($tanggal)->format('d/m') }}
                    </th>
                @endforeach
            </tr>
            <tr>
                @foreach($rekapData[0]['tanggalPertemuan'] as $tanggal)
                    <th style="font-size: 7px; padding: 2px;">
                        {{ \Carbon\Carbon::parse($tanggal)->format('D') }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @foreach($rekapData[0]['detail_semua'] as $item)
                @php $siswa = $item['siswa']; @endphp
                <tr>
                    <td>{{ $no++ }}</td>
                    <td>{{ $siswa['nis'] }}</td>
                    <td class="text-left">{{ $siswa['nama_siswa'] }}</td>
                    <td>{{ $siswa['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>
                    
                    @foreach($rekapData[0]['tanggalPertemuan'] as $tanggal)
                        @php
                            $status = $item['statusByDate'][\Carbon\Carbon::parse($tanggal)->format('Y-m-d')] ?? '-';
                            $bgClass = '';
                            $textColor = '';
                            
                            if ($status === 'hadir') {
                                $bgClass = 'bg-emerald';
                                $textColor = 'color: #065f46;';
                            } elseif ($status === 'sakit') {
                                $bgClass = 'bg-amber';
                                $textColor = 'color: #9a3412;';
                            } elseif ($status === 'izin') {
                                $bgClass = 'bg-blue';
                                $textColor = 'color: #1e40af;';
                            } elseif ($status === 'alpha') {
                                $bgClass = 'bg-rose';
                                $textColor = 'color: #9f1239;';
                            }
                        @endphp
                        <td class="{{ $bgClass }}" style="font-weight: bold; {{ $textColor }}">
                            @if($status === 'hadir') H
                            @elseif($status === 'sakit') S
                            @elseif($status === 'izin') I
                            @elseif($status === 'alpha') A
                            @else -
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- FOOTER TANDA TANGAN --}}
    <div class="footer">
        <table class="signature">
            <tr>
                <td width="60%"></td>
                <td width="40%" class="text-center">
                    Surabaya, {{ date('d F Y') }}<br>
                    Mengetahui,<br>
                    Wali Kelas<br><br><br><br>
                    <strong><u>{{ $guru }}</u></strong><br>
                    NIP. __________________
                </td>
            </tr>
        </table>
    </div>

</body>
</html>