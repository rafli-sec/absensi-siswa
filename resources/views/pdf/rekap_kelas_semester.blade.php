<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Semester - Kelas {{ $kelas }}</title>
    <style>
        @page { margin: 15mm 12mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 8.5px; color: #1a1a1a; }

        .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #2c3e50; padding-bottom: 7px; }
        .header h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; }
        .header h3 { font-size: 10px; margin-top: 2px; color: #444; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 10px; font-size: 8.5px; }
        .info-row { display: flex; margin-bottom: 2px; }
        .info-label { width: 90px; font-weight: bold; }

        table { width: 100%; border-collapse: collapse; font-size: 7.5px; }
        th, td { border: 1px solid #aaa; padding: 3px 4px; text-align: center; vertical-align: middle; }

        .thead-main th { background-color: #2c3e50; color: white; font-size: 8px; padding: 5px 4px; }
        .thead-bulan th { background-color: #3d5a80; color: white; font-size: 7.5px; padding: 4px 3px; }
        .thead-sub th { background-color: #4a6fa5; color: white; font-size: 7px; padding: 3px 2px; }

        td.nama { text-align: left; padding-left: 5px; white-space: nowrap; font-size: 8px; }
        td.nis  { font-size: 7px; }

        .bulan-h { background-color: #e8f5e9; color: #2e7d32; font-weight: bold; }
        .bulan-s { background-color: #fff8e1; color: #e65100; }
        .bulan-i { background-color: #e3f2fd; color: #1565c0; }
        .bulan-a { background-color: #fce4ec; color: #c62828; }

        .total-h { background-color: #c8e6c9; color: #1b5e20; font-weight: bold; }
        .total-s { background-color: #ffe082; color: #e65100; }
        .total-i { background-color: #90caf9; color: #0d47a1; }
        .total-a { background-color: #ef9a9a; color: #b71c1c; }

        .pct-great  { background-color: #a5d6a7; color: #1b5e20; font-weight: bold; }
        .pct-good   { background-color: #90caf9; color: #0d47a1; font-weight: bold; }
        .pct-medium { background-color: #fff176; color: #f57f17; font-weight: bold; }
        .pct-bad    { background-color: #ef9a9a; color: #b71c1c; font-weight: bold; }

        .row-even { background-color: #f5f5f5; }

        .footer { margin-top: 12px; display: flex; justify-content: space-between; font-size: 8.5px; }
        .legend { display: flex; gap: 12px; align-items: center; }
        .legend-item { display: flex; align-items: center; gap: 3px; }
        .legend-box { width: 11px; height: 11px; border: 1px solid #999; }
        .ttd { text-align: center; }
        .ttd-space { margin-top: 38px; }
    </style>
</head>
<body>

<div class="header">
    <h2>REKAP ABSENSI SISWA &mdash; SEMUA MATA PELAJARAN</h2>
    <h3>Kelas {{ $kelas }} &mdash; Semester {{ $semester }} &mdash; Tahun Pelajaran {{ $tahun_ajaran }}</h3>
</div>

<div class="info-grid">
    <div>
        <div class="info-row"><span class="info-label">Kelas</span><span>: {{ $kelas }}</span></div>
        <div class="info-row"><span class="info-label">Semester</span><span>: {{ $semester }}</span></div>
        <div class="info-row"><span class="info-label">Tahun Ajaran</span><span>: {{ $tahun_ajaran }}</span></div>
    </div>
    <div>
        <div class="info-row"><span class="info-label">Guru</span><span>: {{ $guru }}</span></div>
        <div class="info-row"><span class="info-label">Mapel</span><span>: Semua Mata Pelajaran</span></div>
        <div class="info-row"><span class="info-label">Tgl Cetak</span><span>: {{ \Carbon\Carbon::now()->format('d-M-Y H:i') }}</span></div>
    </div>
</div>

<table>
    <thead>
        <tr class="thead-main">
            <th rowspan="3" style="width:14px">No</th>
            <th rowspan="3" style="width:50px">No Induk</th>
            <th rowspan="3" style="min-width:100px">Nama Siswa</th>
            <th rowspan="3" style="width:14px">L/P</th>
            <th colspan="{{ count($bulanList) * 4 }}">Rekap Per Bulan (Semua Mapel)</th>
            <th colspan="4" rowspan="2">Total Semester</th>
            <th rowspan="3" style="width:26px">%</th>
        </tr>
        <tr class="thead-bulan">
            @foreach ($bulanList as $bln => $namaBulan)
                <th colspan="4">{{ $namaBulan }}</th>
            @endforeach
        </tr>
        <tr class="thead-sub">
            @foreach ($bulanList as $bln => $namaBulan)
                <th style="width:12px">H</th>
                <th style="width:12px">S</th>
                <th style="width:12px">I</th>
                <th style="width:12px">A</th>
            @endforeach
            <th style="width:14px">H</th>
            <th style="width:14px">S</th>
            <th style="width:14px">I</th>
            <th style="width:14px">A</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($detailSiswa as $idx => $item)
        <tr class="{{ $idx % 2 === 1 ? 'row-even' : '' }}">
            <td>{{ $idx + 1 }}</td>
            <td class="nis">{{ $item['nis'] }}</td>
            <td class="nama">{{ $item['nama_siswa'] }}</td>
            <td>{{ $item['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>

            @foreach ($rentangBulan as $bln)
                @php $b = $item['per_bulan'][$bln] ?? ['h'=>0,'s'=>0,'i'=>0,'a'=>0]; @endphp
                <td class="bulan-h">{{ $b['h'] ?: '-' }}</td>
                <td class="bulan-s">{{ $b['s'] ?: '-' }}</td>
                <td class="bulan-i">{{ $b['i'] ?: '-' }}</td>
                <td class="bulan-a">{{ $b['a'] ?: '-' }}</td>
            @endforeach

            <td class="total-h">{{ $item['total_h'] }}</td>
            <td class="total-s">{{ $item['total_s'] }}</td>
            <td class="total-i">{{ $item['total_i'] }}</td>
            <td class="total-a">{{ $item['total_a'] }}</td>

            <td class="{{ $item['pct_total'] >= 90 ? 'pct-great' : ($item['pct_total'] >= 75 ? 'pct-good' : ($item['pct_total'] >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                {{ $item['pct_total'] }}%
            </td>
        </tr>
        @endforeach

        {{-- Baris JUMLAH --}}
        @php
            $jmlH   = collect($detailSiswa)->sum('total_h');
            $jmlS   = collect($detailSiswa)->sum('total_s');
            $jmlI   = collect($detailSiswa)->sum('total_i');
            $jmlA   = collect($detailSiswa)->sum('total_a');
            $jmlAll = $jmlH + $jmlS + $jmlI + $jmlA;
        @endphp
        <tr style="background:#e8eaf6; font-weight:bold;">
            <td colspan="4" style="text-align:center">JUMLAH</td>
            @foreach ($rentangBulan as $bln)
                @php
                    $bH = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['h'] ?? 0);
                    $bS = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['s'] ?? 0);
                    $bI = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['i'] ?? 0);
                    $bA = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['a'] ?? 0);
                @endphp
                <td>{{ $bH }}</td><td>{{ $bS }}</td><td>{{ $bI }}</td><td>{{ $bA }}</td>
            @endforeach
            <td>{{ $jmlH }}</td><td>{{ $jmlS }}</td><td>{{ $jmlI }}</td><td>{{ $jmlA }}</td>
            <td>{{ $jmlAll > 0 ? round(($jmlH/$jmlAll)*100) : 0 }}%</td>
        </tr>

        {{-- Baris % Kehadiran per bulan --}}
        <tr style="background:#f3e5f5;">
            <td colspan="4" style="text-align:left; padding-left:4px; font-weight:bold; font-size:7.5px;">% Kehadiran / Bulan</td>
            @foreach ($rentangBulan as $bln)
                @php
                    $bH  = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['h'] ?? 0);
                    $bAll = $bH + collect($detailSiswa)->sum(fn($d) => ($d['per_bulan'][$bln]['s']??0)+($d['per_bulan'][$bln]['i']??0)+($d['per_bulan'][$bln]['a']??0));
                    $bPct = $bAll > 0 ? round(($bH/$bAll)*100) : 0;
                @endphp
                <td colspan="4" style="font-weight:bold; background:#ede7f6;">{{ $bPct }}%</td>
            @endforeach
            <td colspan="5"></td>
        </tr>
    </tbody>
</table>

<div class="footer">
    <div class="legend">
        <strong>Ket:</strong>
        <div class="legend-item"><div class="legend-box bulan-h"></div> H = Hadir</div>
        <div class="legend-item"><div class="legend-box bulan-s"></div> S = Sakit</div>
        <div class="legend-item"><div class="legend-box bulan-i"></div> I = Izin</div>
        <div class="legend-item"><div class="legend-box bulan-a"></div> A = Alpha</div>
    </div>
    <div class="ttd">
        <div>{{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
        <div>Guru Mata Pelajaran</div>
        <div class="ttd-space"></div>
        <div><strong>{{ $guru }}</strong></div>
    </div>
</div>

</body>
</html>