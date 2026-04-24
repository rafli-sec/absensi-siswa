<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi {{ $mapel }} - Kelas {{ $kelas }} - {{ $nama_bulan }} {{ $tahun_ajaran }}</title>
    <style>
        @page { margin: 15mm 12mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 8.5px; color: #1a1a1a; }

        .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #2c3e50; padding-bottom: 7px; }
        .header h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; }
        .header h3 { font-size: 10px; margin-top: 2px; color: #444; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 10px; font-size: 8.5px; }
        .info-row { display: flex; margin-bottom: 2px; }
        .info-label { width: 100px; font-weight: bold; }

        table { width: 100%; border-collapse: collapse; font-size: 7.5px; }
        th, td { border: 1px solid #bbb; padding: 3px 4px; text-align: center; vertical-align: middle; }

        .thead-top th { background-color: #2c3e50; color: white; font-size: 8px; padding: 5px 3px; }
        .thead-mapel th { background-color: #3d5a80; color: white; font-size: 7px; padding: 3px 2px; }

        td.nama { text-align: left; padding-left: 5px; white-space: nowrap; font-size: 8px; }
        td.nis  { font-size: 7px; white-space: nowrap; }

        /* Status warna */
        .st-h { background-color: #d4edda; color: #155724; font-weight: bold; }
        .st-s { background-color: #fff3cd; color: #856404; }
        .st-i { background-color: #cce5ff; color: #004085; }
        .st-a { background-color: #f8d7da; color: #721c24; font-weight: bold; }
        .st-n { color: #ccc; }

        .sum-h { background-color: #c8e6c9; color: #1b5e20; font-weight: bold; }
        .sum-s { background-color: #ffe082; color: #e65100; }
        .sum-i { background-color: #90caf9; color: #0d47a1; }
        .sum-a { background-color: #ef9a9a; color: #b71c1c; }

        .pct-great  { background-color: #a5d6a7; color: #1b5e20; font-weight: bold; }
        .pct-good   { background-color: #90caf9; color: #0d47a1; font-weight: bold; }
        .pct-medium { background-color: #fff176; color: #f57f17; font-weight: bold; }
        .pct-bad    { background-color: #ef9a9a; color: #b71c1c; font-weight: bold; }

        .row-even { background-color: #f9f9f9; }
        .no-meeting { background-color: #f0f0f0; color: #ccc; }

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
    <h2>REKAP ABSENSI SISWA &mdash; {{ $nama_bulan }} {{ explode('/', $tahun_ajaran)[count(explode('/', $tahun_ajaran))-1] }}</h2>
    <h3>Kelas {{ $kelas }} &mdash; {{ $mapel }} &mdash; Semester {{ $semester }} &mdash; Tahun Pelajaran {{ $tahun_ajaran }}</h3>
</div>

<div class="info-grid">
    <div>
        <div class="info-row"><span class="info-label">Kelas</span><span>: {{ $kelas }}</span></div>
        <div class="info-row"><span class="info-label">Mapel</span><span>: {{ $mapel }}</span></div>
        <div class="info-row"><span class="info-label">Bulan</span><span>: {{ $nama_bulan }}</span></div>
        <div class="info-row"><span class="info-label">Semester</span><span>: {{ $semester }}</span></div>
        <div class="info-row"><span class="info-label">Tahun Ajaran</span><span>: {{ $tahun_ajaran }}</span></div>
    </div>
    <div>
        <div class="info-row"><span class="info-label">Guru</span><span>: {{ $guru }}</span></div>
        <div class="info-row"><span class="info-label">Jml Pertemuan</span><span>: {{ $totalPertemuan }} kali</span></div>
        <div class="info-row"><span class="info-label">Jml Siswa</span><span>: {{ count($detailSiswa) }} orang</span></div>
        <div class="info-row"><span class="info-label">Tgl Cetak</span><span>: {{ \Carbon\Carbon::now()->format('d-M-Y H:i') }}</span></div>
    </div>
</div>

<table>
    <thead>
        <tr class="thead-top">
            <th rowspan="2" style="width:14px">No</th>
            <th rowspan="2" style="width:52px">No Induk</th>
            <th rowspan="2" style="min-width:100px">Nama Siswa</th>
            <th rowspan="2" style="width:14px">L/P</th>
            {{-- Kolom tanggal 1 s/d jumlahHari --}}
            @foreach ($semuaHari as $hari)
                <th style="width:13px">{{ $hari }}</th>
            @endforeach
            <th rowspan="2" style="width:16px" class="sum-h">H</th>
            <th rowspan="2" style="width:16px" class="sum-s">S</th>
            <th rowspan="2" style="width:16px" class="sum-i">I</th>
            <th rowspan="2" style="width:16px" class="sum-a">A</th>
            <th rowspan="2" style="width:26px">%</th>
        </tr>
        <tr class="thead-mapel">
            @foreach ($semuaHari as $hari)
                @php $ada = isset($tanggalHariMap[$hari]); @endphp
                <th style="{{ $ada ? 'background:#4a6fa5' : 'background:#9e9e9e' }}">
                    {{ $ada ? '✓' : '' }}
                </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach ($detailSiswa as $idx => $siswa)
        <tr class="{{ $idx % 2 === 1 ? 'row-even' : '' }}">
            <td>{{ $idx + 1 }}</td>
            <td class="nis">{{ $siswa['nis'] }}</td>
            <td class="nama">{{ $siswa['nama_siswa'] }}</td>
            <td>{{ $siswa['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>

            @foreach ($semuaHari as $hari)
                @if (isset($tanggalHariMap[$hari]))
                    @php
                        $tglKey = $tanggalHariMap[$hari];
                        $status = $siswa['statusByDate'][$tglKey] ?? '-';
                        $cls    = match($status) { 'hadir'=>'st-h','sakit'=>'st-s','izin'=>'st-i','alpha'=>'st-a', default=>'st-n' };
                        $lbl    = match($status) { 'hadir'=>'H','sakit'=>'S','izin'=>'I','alpha'=>'A', default=>'-' };
                    @endphp
                    <td class="{{ $cls }}">{{ $lbl }}</td>
                @else
                    <td class="no-meeting"></td>
                @endif
            @endforeach

            <td class="sum-h">{{ $siswa['h'] }}</td>
            <td class="sum-s">{{ $siswa['s'] }}</td>
            <td class="sum-i">{{ $siswa['i'] }}</td>
            <td class="sum-a">{{ $siswa['a'] }}</td>
            <td class="{{ $siswa['pct'] >= 90 ? 'pct-great' : ($siswa['pct'] >= 75 ? 'pct-good' : ($siswa['pct'] >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                {{ $siswa['pct'] }}%
            </td>
        </tr>
        @endforeach

        {{-- Baris JUMLAH --}}
        @php
            $jmlH = collect($detailSiswa)->sum('h');
            $jmlS = collect($detailSiswa)->sum('s');
            $jmlI = collect($detailSiswa)->sum('i');
            $jmlA = collect($detailSiswa)->sum('a');
            $jmlAll = $jmlH + $jmlS + $jmlI + $jmlA;
        @endphp
        <tr style="background:#e8eaf6; font-weight:bold;">
            <td colspan="4" style="text-align:center">JUMLAH</td>
            @foreach ($semuaHari as $hari)
                @if (isset($tanggalHariMap[$hari]))
                    @php
                        $tglKey = $tanggalHariMap[$hari];
                        $kH = collect($detailSiswa)->filter(fn($s) => ($s['statusByDate'][$tglKey]??'') === 'hadir')->count();
                        $kN = collect($detailSiswa)->filter(fn($s) => ($s['statusByDate'][$tglKey]??'') !== 'hadir' && ($s['statusByDate'][$tglKey]??'') !== '')->count();
                    @endphp
                    <td style="font-size:7px">{{ $kH }}<br><span style="color:#c62828">{{ $kN > 0 ? $kN : '' }}</span></td>
                @else
                    <td></td>
                @endif
            @endforeach
            <td>{{ $jmlH }}</td>
            <td>{{ $jmlS }}</td>
            <td>{{ $jmlI }}</td>
            <td>{{ $jmlA }}</td>
            <td>{{ $jmlAll > 0 ? round(($jmlH/$jmlAll)*100) : 0 }}%</td>
        </tr>
    </tbody>
</table>

<div class="footer">
    <div class="legend">
        <strong>Ket:</strong>
        <div class="legend-item"><div class="legend-box st-h"></div> H = Hadir</div>
        <div class="legend-item"><div class="legend-box st-s"></div> S = Sakit</div>
        <div class="legend-item"><div class="legend-box st-i"></div> I = Izin</div>
        <div class="legend-item"><div class="legend-box st-a"></div> A = Alpha</div>
        <div class="legend-item"><div class="legend-box no-meeting"></div> = Tidak ada pertemuan</div>
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

