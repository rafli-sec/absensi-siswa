<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Mapel {{ $mapel }} - Kelas {{ $kelas }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 10px; 
            color: #1e293b;
            padding: 20px;
            background: white;
        }
        
        .school-info { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #0f172a; padding-bottom: 10px; }
        .school-info h3 { font-size: 18px; margin: 0; }
        .school-info p { font-size: 11px; margin: 3px 0; }
        
        .info-table { width: 100%; margin-bottom: 15px; border-collapse: collapse; font-size: 10px; }
        .info-table td { padding: 4px 8px; border: 1px solid #cbd5e1; background: #f8fafc; }
        .info-table td:first-child { width: 15%; font-weight: bold; background: #f1f5f9; }
        
        .main-table { width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 20px; }
        .main-table th, .main-table td { border: 1px solid #94a3b8; padding: 6px 4px; text-align: center; vertical-align: middle; }
        .main-table th { background-color: #e2e8f0; font-weight: bold; }
        .main-table .text-left { text-align: left; }
        .main-table .font-bold { font-weight: bold; }
        
        .bg-emerald { background-color: #d1fae5; }
        .bg-amber { background-color: #fed7aa; }
        .bg-rose { background-color: #ffe4e6; }
        .bg-blue { background-color: #dbeafe; }
        
        .summary-stats { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 10px; }
        .stat-card { flex: 1; padding: 10px; border-radius: 8px; text-align: center; }
        .stat-card .value { font-size: 24px; font-weight: bold; }
        .stat-card .label { font-size: 9px; margin-top: 5px; }
        
        .signature { width: 100%; margin-top: 30px; }
        .signature td { padding-top: 40px; text-align: center; font-size: 10px; }
        
        .predikat-badge { display: inline-block; padding: 2px 6px; border-radius: 20px; font-size: 8px; font-weight: bold; }
        .predikat-sangat-baik { background: #d1fae5; color: #065f46; }
        .predikat-baik { background: #dbeafe; color: #1e40af; }
        .predikat-cukup { background: #fed7aa; color: #9a3412; }
        .predikat-kurang { background: #ffe4e6; color: #9f1239; }
        
        .page-break { page-break-before: always; }
    </style>
</head>
<body>

    {{-- HEADER --}}
    <div class="school-info">
        <h3>UPT SPF SMP NEGERI 51 MAKASSAR</h3>
        <p>Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235</p>
        <p>Email: uptspfsmpn51makassar@gmail.com</p>
        <p><strong>LAPORAN REKAP ABSENSI PER MATA PELAJARAN</strong></p>
    </div>

    {{-- INFO MAPEL --}}
    <table class="info-table">
        <tr>
            <td>Kelas</td>
            <td colspan="3"><strong>{{ $kelas }}</strong></td>
            <td>Semester</td>
            <td colspan="3"><strong>{{ $semester }}</strong></td>
        </tr>
        <tr>
            <td>Mata Pelajaran</td>
            <td colspan="3"><strong>{{ $mapel }}</strong></td>
            <td>Tahun Ajaran</td>
            <td colspan="3"><strong>{{ $tahun_ajaran }}</strong></td>
        </tr>
        <tr>
            <td>Guru Pengampu</td>
            <td colspan="3"><strong>{{ $guru }}</strong></td>
            <td>Total Pertemuan</td>
            <td colspan="3"><strong>{{ $rekapData['total_pertemuan'] ?? 0 }} Kali</strong></td>
        </tr>
    </table>

    {{-- STATISTIK --}}
    <div class="summary-stats">
        <div class="stat-card" style="background: #dbeafe;">
            <div class="value">{{ $rekapData['statistik']['rata_rata_kelas'] ?? 0 }}%</div>
            <div class="label">Rata-rata Kelas</div>
        </div>
        <div class="stat-card" style="background: #d1fae5;">
            <div class="value">{{ $rekapData['statistik']['predikat']['sangat_baik'] ?? 0 }}</div>
            <div class="label">Sangat Baik (≥90%)</div>
        </div>
        <div class="stat-card" style="background: #dbeafe;">
            <div class="value">{{ $rekapData['statistik']['predikat']['baik'] ?? 0 }}</div>
            <div class="label">Baik (75-89%)</div>
        </div>
        <div class="stat-card" style="background: #fed7aa;">
            <div class="value">{{ $rekapData['statistik']['predikat']['cukup'] ?? 0 }}</div>
            <div class="label">Cukup (60-74%)</div>
        </div>
        <div class="stat-card" style="background: #ffe4e6;">
            <div class="value">{{ $rekapData['statistik']['predikat']['kurang'] ?? 0 }}</div>
            <div class="label">Kurang (&lt;60%)</div>
        </div>
    </div>

    {{-- TABEL REKAP SISWA --}}
    <table class="main-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="10%">NIS</th>
                <th width="30%">Nama Siswa</th>
                <th width="5%">L/P</th>
                <th width="10%">Hadir</th>
                <th width="10%">Sakit</th>
                <th width="10%">Izin</th>
                <th width="10%">Alpha</th>
                <th width="10%">% Hadir</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @foreach($rekapData['rekap_siswa'] as $siswa)
                @php
                    $persentase = $siswa['persentase'];
                    if ($persentase >= 90) $bgColor = 'bg-emerald';
                    elseif ($persentase >= 75) $bgColor = 'bg-blue';
                    elseif ($persentase >= 60) $bgColor = '';
                    else $bgColor = 'bg-rose';
                @endphp
                <tr>
                    <td>{{ $no++ }}</td>
                    <td>{{ $siswa['nis'] }}</td>
                    <td class="text-left">{{ $siswa['nama_siswa'] }}</td>
                    <td>{{ $siswa['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>
                    <td class="bg-emerald">{{ $siswa['hadir'] }}</td>
                    <td class="bg-amber">{{ $siswa['sakit'] }}</td>
                    <td class="bg-blue">{{ $siswa['izin'] }}</td>
                    <td class="bg-rose">{{ $siswa['alpha'] }}</td>
                    <td class="font-bold {{ $bgColor }}">{{ $persentase }}%</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- DAFTAR TANGGAL PERTEMUAN --}}
    @if(!empty($rekapData['tanggal_pertemuan']))
        <div style="margin-top: 20px; font-size: 9px;">
            <strong>Catatan:</strong> Total pertemuan selama semester: {{ count($rekapData['tanggal_pertemuan']) }} kali
            @if(count($rekapData['tanggal_pertemuan']) > 0)
                <br>Tanggal pertemuan: 
                @foreach($rekapData['tanggal_pertemuan'] as $tgl)
                    {{ \Carbon\Carbon::parse($tgl)->format('d/m/Y') }}@if(!$loop->last), @endif
                @endforeach
            @endif
        </div>
    @endif

    {{-- SISWA TERBAIK & BERMASALAH --}}
    @if(!empty($rekapData['statistik']['siswa_terbaik']) || !empty($rekapData['statistik']['siswa_bermasalah']))
        <div style="margin-top: 20px; padding: 10px; background: #f8fafc; border-radius: 8px;">
            <table style="width: 100%; font-size: 9px;">
                @if(!empty($rekapData['statistik']['siswa_terbaik']))
                    <tr>
                        <td width="15%"><strong>Siswa Terbaik:</strong></td>
                        <td>
                            @foreach($rekapData['statistik']['siswa_terbaik'] as $terbaik)
                                {{ $terbaik['nama_siswa'] }} ({{ $terbaik['persentase'] }}%)@if(!$loop->last), @endif
                            @endforeach
                        </td>
                    </tr>
                @endif
                @if(!empty($rekapData['statistik']['siswa_bermasalah']))
                    <tr>
                        <td><strong>Perlu Perhatian:</strong></td>
                        <td>
                            @foreach($rekapData['statistik']['siswa_bermasalah'] as $bermasalah)
                                {{ $bermasalah['nama_siswa'] }} ({{ $bermasalah['persentase'] }}%)@if(!$loop->last), @endif
                            @endforeach
                        </td>
                    </tr>
                @endif
            </table>
        </div>
    @endif

    {{-- FOOTER --}}
    <div style="margin-top: 30px;">
        <table class="signature">
            <tr>
                <td width="60%"></td>
                <td width="40%" class="text-center">
                    Surabaya, {{ date('d F Y') }}<br>
                    Guru Mata Pelajaran<br><br><br><br>
                    <strong><u>{{ $guru }}</u></strong><br>
                    NIP. __________________
                </td>
            </tr>
        </table>
    </div>

</body>
</html>