<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Per Siswa - Kelas {{ $kelas }}</title>
    <style>
        @page { margin: 30mm 35mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9.5px; color: #1a1a1a; }

        .page { padding: 0; }
        .page-break { page-break-after: always; }

        .header { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #2c3e50; padding-bottom: 8px; }
        .header h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; }
        .header h3 { font-size: 10.5px; margin-top: 3px; color: #444; }

        .siswa-info { background-color: #eef2ff; border: 1px solid #c5cae9; border-radius: 4px; padding: 8px 12px; margin-bottom: 10px; }
        .siswa-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .info-row { display: flex; font-size: 9px; margin-bottom: 2px; }
        .info-label { width: 100px; font-weight: bold; }

        /* Summary boxes */
        .summary-boxes { display: flex; gap: 8px; margin-bottom: 10px; }
        .summary-box { flex: 1; text-align: center; padding: 6px 4px; border-radius: 4px; border: 1px solid #ddd; }
        .box-h { background-color: #e8f5e9; border-color: #a5d6a7; }
        .box-s { background-color: #fff8e1; border-color: #ffe082; }
        .box-i { background-color: #e3f2fd; border-color: #90caf9; }
        .box-a { background-color: #fce4ec; border-color: #ef9a9a; }
        .box-pct { border-color: #b0bec5; }
        .box-label { font-size: 8px; color: #666; }
        .box-value { font-size: 15px; font-weight: bold; }
        .box-h .box-value { color: #2e7d32; }
        .box-s .box-value { color: #e65100; }
        .box-i .box-value { color: #1565c0; }
        .box-a .box-value { color: #c62828; }

        .predikat-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: bold; margin-bottom: 8px; }
        .predikat-green  { background-color: #c8e6c9; color: #1b5e20; }
        .predikat-blue   { background-color: #bbdefb; color: #0d47a1; }
        .predikat-yellow { background-color: #fff9c4; color: #f57f17; }
        .predikat-red    { background-color: #ffcdd2; color: #b71c1c; }

        /* Main table */
        table { width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 10px; }
        th, td { border: 1px solid #bbb; padding: 4px 5px; text-align: center; vertical-align: middle; }
        thead th { background-color: #2c3e50; color: white; font-size: 8.5px; padding: 5px 4px; }
        thead tr:nth-child(2) th { background-color: #3d5a80; font-size: 8px; padding: 4px 3px; }

        td.mapel-name { text-align: left; padding-left: 7px; font-weight: bold; min-width: 110px; }

        .bulan-h { background-color: #f1f8e9; color: #33691e; }
        .bulan-s { background-color: #fffde7; color: #f57f17; }
        .bulan-i { background-color: #e8f4f8; color: #1565c0; }
        .bulan-a { background-color: #fce4ec; color: #c62828; }

        .total-row td { background-color: #e8eaf6; font-weight: bold; }

        .pct-great  { background-color: #a5d6a7; color: #1b5e20; font-weight: bold; }
        .pct-good   { background-color: #90caf9; color: #0d47a1; font-weight: bold; }
        .pct-medium { background-color: #fff176; color: #f57f17; font-weight: bold; }
        .pct-bad    { background-color: #ef9a9a; color: #b71c1c; font-weight: bold; }

        .row-even { background-color: #fafafa; }

        .footer { display: flex; justify-content: flex-end; font-size: 9px; margin-top: 14px; }
        .ttd { text-align: center; }
        .ttd-space { margin-top: 40px; }
    </style>
</head>
<body>

@foreach ($rekapSemuaSiswa as $siswaIdx => $siswa)
<div class="page {{ !$loop->last ? 'page-break' : '' }}">

    <div class="header">
        <h2>REKAP ABSENSI SISWA</h2>
        <h3>Semester {{ $semester }} &mdash; Tahun Pelajaran {{ $tahun_ajaran }} &mdash; Kelas {{ $kelas }}</h3>
    </div>

    {{-- Info Siswa --}}
    <div class="siswa-info">
        <div class="siswa-info-grid">
            <div>
                <div class="info-row"><span class="info-label">Nama Siswa</span><span>: <strong>{{ $siswa['nama_siswa'] }}</strong></span></div>
                <div class="info-row"><span class="info-label">NIS / No Induk</span><span>: {{ $siswa['nis'] }}</span></div>
                <div class="info-row"><span class="info-label">Kelas</span><span>: {{ $siswa['kelas'] }}</span></div>
            </div>
            <div>
                <div class="info-row"><span class="info-label">Jenis Kelamin</span><span>: {{ $siswa['jenis_kelamin'] === 'perempuan' ? 'Perempuan' : 'Laki-laki' }}</span></div>
                <div class="info-row"><span class="info-label">No HP Ortu</span><span>: {{ $siswa['no_hp_ortu'] ?? '-' }}</span></div>
                <div class="info-row"><span class="info-label">Guru</span><span>: {{ $guru }}</span></div>
            </div>
        </div>
    </div>

    {{-- Summary Boxes --}}
    <div class="summary-boxes">
        <div class="summary-box box-h">
            <div class="box-label">Total Hadir</div>
            <div class="box-value">{{ $siswa['total_h'] }}</div>
        </div>
        <div class="summary-box box-s">
            <div class="box-label">Sakit</div>
            <div class="box-value">{{ $siswa['total_s'] }}</div>
        </div>
        <div class="summary-box box-i">
            <div class="box-label">Izin</div>
            <div class="box-value">{{ $siswa['total_i'] }}</div>
        </div>
        <div class="summary-box box-a">
            <div class="box-label">Alpha</div>
            <div class="box-value">{{ $siswa['total_a'] }}</div>
        </div>
        <div class="summary-box box-pct">
            <div class="box-label">% Kehadiran</div>
            <div class="box-value" style="color: {{ $siswa['pct_total'] >= 90 ? '#1b5e20' : ($siswa['pct_total'] >= 75 ? '#0d47a1' : ($siswa['pct_total'] >= 60 ? '#f57f17' : '#b71c1c')) }}">
                {{ $siswa['pct_total'] }}%
            </div>
        </div>
        <div class="summary-box" style="background-color: {{ $siswa['predikat']['warna'] === 'green' ? '#c8e6c9' : ($siswa['predikat']['warna'] === 'blue' ? '#bbdefb' : ($siswa['predikat']['warna'] === 'yellow' ? '#fff9c4' : '#ffcdd2')) }}; border-color: #bbb;">
            <div class="box-label">Predikat</div>
            <div style="font-size: 9px; font-weight: bold; margin-top: 2px;">{{ $siswa['predikat']['label'] }}</div>
        </div>
    </div>

    {{-- Tabel Rekap Per Mapel Per Bulan --}}
    <table>
        <thead>
            <tr>
                <th rowspan="2" style="width:14px">No</th>
                <th rowspan="2">Mata Pelajaran</th>
                @foreach ($bulanList as $bln => $namaBulan)
                    <th colspan="4">{{ $namaBulan }}</th>
                @endforeach
                <th colspan="4">Total</th>
                <th rowspan="2" style="width:28px">Total Pertemuan</th>
                <th rowspan="2" style="width:28px">% Hadir</th>
            </tr>
            <tr>
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
            @foreach ($siswa['per_mapel'] as $idx => $mapelItem)
            <tr class="{{ $idx % 2 === 1 ? 'row-even' : '' }}">
                <td>{{ $idx + 1 }}</td>
                <td class="mapel-name">{{ $mapelItem['mapel'] }}</td>

                @foreach ($rentangBulan as $bln)
                    @php $b = $mapelItem['per_bulan'][$bln] ?? ['h'=>0,'s'=>0,'i'=>0,'a'=>0]; @endphp
                    <td class="bulan-h">{{ $b['h'] ?: '-' }}</td>
                    <td class="bulan-s">{{ $b['s'] ?: '-' }}</td>
                    <td class="bulan-i">{{ $b['i'] ?: '-' }}</td>
                    <td class="bulan-a">{{ $b['a'] ?: '-' }}</td>
                @endforeach

                <td class="bulan-h" style="font-weight:bold">{{ $mapelItem['h'] }}</td>
                <td class="bulan-s">{{ $mapelItem['s'] }}</td>
                <td class="bulan-i">{{ $mapelItem['i'] }}</td>
                <td class="bulan-a">{{ $mapelItem['a'] }}</td>
                <td>{{ $mapelItem['total_pertemuan'] }}</td>
                <td class="{{ $mapelItem['persentase'] >= 90 ? 'pct-great' : ($mapelItem['persentase'] >= 75 ? 'pct-good' : ($mapelItem['persentase'] >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                    {{ $mapelItem['persentase'] }}%
                </td>
            </tr>
            @endforeach

            {{-- Total row --}}
            <tr class="total-row">
                <td colspan="2" style="text-align:center;">TOTAL</td>
                @foreach ($rentangBulan as $bln)
                    @php
                        $bH = collect($siswa['per_mapel'])->sum(fn($m) => $m['per_bulan'][$bln]['h'] ?? 0);
                        $bS = collect($siswa['per_mapel'])->sum(fn($m) => $m['per_bulan'][$bln]['s'] ?? 0);
                        $bI = collect($siswa['per_mapel'])->sum(fn($m) => $m['per_bulan'][$bln]['i'] ?? 0);
                        $bA = collect($siswa['per_mapel'])->sum(fn($m) => $m['per_bulan'][$bln]['a'] ?? 0);
                    @endphp
                    <td>{{ $bH }}</td><td>{{ $bS }}</td><td>{{ $bI }}</td><td>{{ $bA }}</td>
                @endforeach
                <td>{{ $siswa['total_h'] }}</td>
                <td>{{ $siswa['total_s'] }}</td>
                <td>{{ $siswa['total_i'] }}</td>
                <td>{{ $siswa['total_a'] }}</td>
                <td>{{ $siswa['total_pertemuan'] }}</td>
                <td class="{{ $siswa['pct_total'] >= 90 ? 'pct-great' : ($siswa['pct_total'] >= 75 ? 'pct-good' : ($siswa['pct_total'] >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                    {{ $siswa['pct_total'] }}%
                </td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <div class="ttd">
            <div>{{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
            <div>Guru Mata Pelajaran</div>
            <div class="ttd-space"></div>
            <div><strong>{{ $guru }}</strong></div>
        </div>
    </div>

</div>
@endforeach

</body>
</html>