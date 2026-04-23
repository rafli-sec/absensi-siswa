<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Semester - Kelas {{ $kelas }}</title>
    <style>
        @page { margin: 30mm 35mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9px; color: #1a1a1a; }

        .header { text-align: center; margin-bottom: 14px; }
        .header h2 { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .header h3 { font-size: 11px; margin-top: 3px; color: #444; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 14px; font-size: 9px; }
        .info-row { display: flex; margin-bottom: 3px; }
        .info-label { width: 100px; font-weight: bold; }

        table { width: 100%; border-collapse: collapse; font-size: 8px; }
        th, td { border: 1px solid #aaa; padding: 4px 5px; text-align: center; vertical-align: middle; }

        .thead-main th { background-color: #2c3e50; color: white; font-size: 8px; padding: 5px 4px; }
        .thead-bulan th { background-color: #3d5a80; color: white; font-size: 7.5px; padding: 4px 3px; }
        .thead-sub th { background-color: #4a6fa5; color: white; font-size: 7px; padding: 3px 2px; }

        td.nama { text-align: left; padding-left: 6px; white-space: nowrap; }
        td.nis  { font-size: 7.5px; }

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

        .footer { margin-top: 16px; display: flex; justify-content: space-between; font-size: 9px; }
        .legend { display: flex; gap: 14px; align-items: center; font-size: 8.5px; }
        .legend-item { display: flex; align-items: center; gap: 4px; }
        .legend-box { width: 12px; height: 12px; border: 1px solid #999; }
        .ttd { text-align: center; }
        .ttd-space { margin-top: 40px; }
    </style>
</head>
<body>

<div class="header">
    <h2>REKAP ABSENSI SISWA</h2>
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
            <th colspan="{{ count($bulanList) * 4 }}">Rekap Status</th>
            <th colspan="4" rowspan="2">Jumlah Total</th>
            <th rowspan="3" style="width:28px">Jml Tdk Hadir (%)</th>
            <th rowspan="3" style="width:28px">Jml Hadir (%)</th>
        </tr>
        <tr class="thead-bulan">
            @foreach ($bulanList as $bln => $namaBulan)
                <th colspan="4">{{ $namaBulan }}</th>
            @endforeach
        </tr>
        <tr class="thead-sub">
            @foreach ($bulanList as $bln => $namaBulan)
                <th style="width:12px">H</th>
                <th style="width:12px">I</th>
                <th style="width:12px">S</th>
                <th style="width:12px">A</th>
            @endforeach
            <th style="width:14px">H</th>
            <th style="width:14px">I</th>
            <th style="width:14px">S</th>
            <th style="width:14px">A</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($detailSiswa as $idx => $item)
        @php
            $totalTidakHadir = $item['total_s'] + $item['total_i'] + $item['total_a'];
            $totalAll = $item['total_h'] + $totalTidakHadir;
            $pctTidakHadir = $totalAll > 0 ? round(($totalTidakHadir / $totalAll) * 100) : 0;
            $pctHadir = $item['pct_total'];
        @endphp
        <tr class="{{ $idx % 2 === 1 ? 'row-even' : '' }}">
            <td>{{ $idx + 1 }}</td>
            <td class="nis">{{ $item['nis'] }}</td>
            <td class="nama">{{ $item['nama_siswa'] }}</td>
            <td>{{ $item['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>

            @foreach ($rentangBulan as $bln)
                @php $b = $item['per_bulan'][$bln] ?? ['h'=>0,'s'=>0,'i'=>0,'a'=>0]; @endphp
                <td class="bulan-h">{{ $b['h'] ?: '-' }}</td>
                <td class="bulan-i">{{ $b['i'] ?: '-' }}</td>
                <td class="bulan-s">{{ $b['s'] ?: '-' }}</td>
                <td class="bulan-a">{{ $b['a'] ?: '-' }}</td>
            @endforeach

            <td class="total-h">{{ $item['total_h'] }}</td>
            <td class="total-i">{{ $item['total_i'] }}</td>
            <td class="total-s">{{ $item['total_s'] }}</td>
            <td class="total-a">{{ $item['total_a'] }}</td>

            <td class="{{ $pctTidakHadir >= 25 ? 'pct-bad' : ($pctTidakHadir >= 10 ? 'pct-medium' : '') }}">
                {{ $pctTidakHadir }}%
            </td>
            <td class="{{ $pctHadir >= 90 ? 'pct-great' : ($pctHadir >= 75 ? 'pct-good' : ($pctHadir >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                {{ $pctHadir }}%
            </td>
        </tr>
        @endforeach

        {{-- Baris JUMLAH --}}
        @php
            $jmlS   = collect($detailSiswa)->sum('total_s');
            $jmlI   = collect($detailSiswa)->sum('total_i');
            $jmlA   = collect($detailSiswa)->sum('total_a');
            $jmlH   = collect($detailSiswa)->sum('total_h');
            $jmlAll = $jmlH + $jmlS + $jmlI + $jmlA;
        @endphp
        <tr style="background:#e8eaf6; font-weight:bold;">
            <td colspan="4" style="text-align:center">JUMLAH</td>
            @foreach ($rentangBulan as $bln)
                @php
                    $bH = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['h'] ?? 0);
                    $bI = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['i'] ?? 0);
                    $bS = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['s'] ?? 0);
                    $bA = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['a'] ?? 0);
                @endphp
                <td>{{ $bH }}</td><td>{{ $bI }}</td><td>{{ $bS }}</td><td>{{ $bA }}</td>
            @endforeach
            <td>{{ $jmlH }}</td><td>{{ $jmlI }}</td><td>{{ $jmlS }}</td><td>{{ $jmlA }}</td>
            <td>{{ $jmlAll > 0 ? round((($jmlS+$jmlI+$jmlA)/$jmlAll)*100) : 0 }}%</td>
            <td>{{ $jmlAll > 0 ? round(($jmlH/$jmlAll)*100) : 0 }}%</td>
        </tr>

        {{-- Prosentase Ketidakhadiran --}}
        <tr>
            <td colspan="4" style="text-align:left; padding-left:3px; font-weight:bold;">Prosentase Ketidakhadiran</td>
            @foreach ($rentangBulan as $bln)
                @php
                    $bS = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['s'] ?? 0);
                    $bI = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['i'] ?? 0);
                    $bA = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['a'] ?? 0);
                    $bH = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['h'] ?? 0);
                    $bAll = $bH + $bS + $bI + $bA;
                    $bPct = $bAll > 0 ? round((($bS+$bI+$bA)/$bAll)*100) : 0;
                @endphp
                <td colspan="4" style="font-weight:bold;">{{ $bPct }}%</td>
            @endforeach
            <td colspan="5"></td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:left; padding-left:3px; font-weight:bold;">Prosentase Kehadiran</td>
            @foreach ($rentangBulan as $bln)
                @php
                    $bH = collect($detailSiswa)->sum(fn($d) => $d['per_bulan'][$bln]['h'] ?? 0);
                    $bAll2 = $bH + collect($detailSiswa)->sum(fn($d) => ($d['per_bulan'][$bln]['s']??0)+($d['per_bulan'][$bln]['i']??0)+($d['per_bulan'][$bln]['a']??0));
                    $bPct2 = $bAll2 > 0 ? round(($bH/$bAll2)*100) : 0;
                @endphp
                <td colspan="4" style="font-weight:bold;">{{ $bPct2 }}%</td>
            @endforeach
            <td colspan="5"></td>
        </tr>
    </tbody>
</table>

<div class="footer">
    <div class="legend">
        <strong>Keterangan:</strong>
        <div class="legend-item"><div class="legend-box" style="background:#fff8e1;"></div> S = Sakit</div>
        <div class="legend-item"><div class="legend-box" style="background:#e3f2fd;"></div> I = Izin</div>
        <div class="legend-item"><div class="legend-box" style="background:#fce4ec;"></div> A = Alpha</div>
    </div>
    <div class="ttd">
        <div>{{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
        <div>Guru Pembimbing</div>
        <div class="ttd-space"></div>
        <div><strong>{{ $guru }}</strong></div>
    </div>
</div>

</body>
</html>