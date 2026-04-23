<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Kelas {{ $kelas }} - {{ $nama_bulan }}</title>
    <style>
        @page { margin: 30mm 35mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9px; color: #1a1a1a; }

        .header { text-align: center; margin-bottom: 14px; }
        .header h2 { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .header h3 { font-size: 11px; font-weight: bold; margin-top: 3px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-bottom: 14px; font-size: 9px; }
        .info-left, .info-right { }
        .info-row { display: flex; margin-bottom: 3px; }
        .info-label { width: 100px; font-weight: bold; }
        .info-value { }

        table { width: 100%; border-collapse: collapse; font-size: 8px; }
        th, td { border: 1px solid #aaa; padding: 4px 5px; text-align: center; vertical-align: middle; }
        
        thead tr:first-child th { background-color: #2c3e50; color: white; font-size: 8px; padding: 5px 4px; }
        thead tr:last-child th { background-color: #34495e; color: white; font-size: 7.5px; padding: 4px 3px; }

        td.nama { text-align: left; padding-left: 6px; white-space: nowrap; }
        td.nis  { font-size: 7.5px; white-space: nowrap; }

        .status-h { background-color: #d4edda; color: #155724; font-weight: bold; }
        .status-s { background-color: #fff3cd; color: #856404; font-weight: bold; }
        .status-i { background-color: #cce5ff; color: #004085; font-weight: bold; }
        .status-a { background-color: #f8d7da; color: #721c24; font-weight: bold; }
        .status-none { color: #aaa; }

        .col-summary-h { background-color: #e8f5e9; font-weight: bold; color: #2e7d32; }
        .col-summary-s { background-color: #fff8e1; color: #f57f17; }
        .col-summary-i { background-color: #e3f2fd; color: #1565c0; }
        .col-summary-a { background-color: #fce4ec; color: #c62828; }
        .col-pct { font-weight: bold; font-size: 8px; }

        .pct-great  { background-color: #c8e6c9; color: #1b5e20; }
        .pct-good   { background-color: #bbdefb; color: #0d47a1; }
        .pct-medium { background-color: #fff9c4; color: #f57f17; }
        .pct-bad    { background-color: #ffcdd2; color: #b71c1c; }

        .row-even { background-color: #fafafa; }
        .col-no   { width: 18px; }
        .col-nis  { width: 58px; }
        .col-nama { min-width: 110px; }
        .col-lp   { width: 18px; }
        .col-day  { width: 16px; }
        .col-sum  { width: 18px; }
        .col-pct-w{ width: 28px; }

        .footer { margin-top: 16px; display: flex; justify-content: space-between; font-size: 9px; }
        .legend { display: flex; gap: 14px; align-items: center; font-size: 8.5px; }
        .legend-item { display: flex; align-items: center; gap: 4px; }
        .legend-box { width: 12px; height: 12px; border: 1px solid #999; }
        .ttd { text-align: center; }
        .ttd-space { margin-top: 40px; }

        .day-no-meeting { background-color: #f0f0f0; color: #ccc; }
    </style>
</head>
<body>

<div class="header">
    <h2>REKAP ABSENSI SISWA</h2>
    <h3>Bulan {{ $nama_bulan }} {{ $tahun_ajaran }}</h3>
</div>

<div class="info-grid">
    <div class="info-left">
        <div class="info-row"><span class="info-label">Tahun Ajaran</span><span>: {{ $tahun_ajaran }}</span></div>
        <div class="info-row"><span class="info-label">Semester</span><span>: {{ $semester }}</span></div>
        <div class="info-row"><span class="info-label">Kelas</span><span>: {{ $kelas }}</span></div>
        <div class="info-row"><span class="info-label">Tgl Cetak</span><span>: {{ \Carbon\Carbon::now()->format('d-M-Y H:i') }}</span></div>
    </div>
    <div class="info-right">
        <div class="info-row"><span class="info-label">Mata Pelajaran</span><span>: {{ $mapel }}</span></div>
        <div class="info-row"><span class="info-label">Guru</span><span>: {{ $guru }}</span></div>
        <div class="info-row"><span class="info-label">Bulan</span><span>: {{ strtoupper($nama_bulan) }} {{ explode('/', $tahun_ajaran)[0] }}</span></div>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th class="col-no" rowspan="2">No</th>
            <th class="col-nis" rowspan="2">NIS</th>
            <th class="col-nama" rowspan="2">Nama Siswa</th>
            <th class="col-lp" rowspan="2">L/P</th>
            <th colspan="{{ $jumlahHari }}">Tanggal</th>
            <th class="col-sum" rowspan="2">H</th>
            <th class="col-sum" rowspan="2">I</th>
            <th class="col-sum" rowspan="2">S</th>
            <th class="col-sum" rowspan="2">A</th>
            <th class="col-pct-w" rowspan="2">%</th>
        </tr>
        <tr>
            @for ($d = 1; $d <= $jumlahHari; $d++)
                <th class="col-day">{{ $d }}</th>
            @endfor
        </tr>
    </thead>
    <tbody>
        @foreach ($detailSiswa as $idx => $item)
        <tr class="{{ $idx % 2 === 1 ? 'row-even' : '' }}">
            <td>{{ $idx + 1 }}</td>
            <td class="nis">{{ $item['nis'] }}</td>
            <td class="nama">{{ $item['nama_siswa'] }}</td>
            <td>{{ $item['jenis_kelamin'] === 'perempuan' ? 'P' : 'L' }}</td>

            @for ($d = 1; $d <= $jumlahHari; $d++)
                @php
                    $tglKey = isset($tanggalHariMap[$d]) ? $tanggalHariMap[$d] : null;
                    $status = $tglKey ? ($item['statusByDate'][$tglKey] ?? null) : null;
                @endphp
                @if (!$tglKey)
                    <td class="day-no-meeting">-</td>
                @elseif ($status === 'hadir')
                    <td class="status-h">H</td>
                @elseif ($status === 'sakit')
                    <td class="status-s">S</td>
                @elseif ($status === 'izin')
                    <td class="status-i">I</td>
                @elseif ($status === 'alpha')
                    <td class="status-a">A</td>
                @else
                    <td class="status-none">-</td>
                @endif
            @endfor

            <td class="col-summary-h">{{ $item['h'] }}</td>
            <td class="col-summary-i">{{ $item['i'] }}</td>
            <td class="col-summary-s">{{ $item['s'] }}</td>
            <td class="col-summary-a">{{ $item['a'] }}</td>
            <td class="col-pct {{ $item['pct'] >= 90 ? 'pct-great' : ($item['pct'] >= 75 ? 'pct-good' : ($item['pct'] >= 60 ? 'pct-medium' : 'pct-bad')) }}">
                {{ $item['pct'] }}%
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    <div class="legend">
        <strong>Keterangan:</strong>
        <div class="legend-item"><div class="legend-box" style="background:#d4edda;"></div> H = Hadir</div>
        <div class="legend-item"><div class="legend-box" style="background:#fff3cd;"></div> S = Sakit</div>
        <div class="legend-item"><div class="legend-box" style="background:#cce5ff;"></div> I = Izin</div>
        <div class="legend-item"><div class="legend-box" style="background:#f8d7da;"></div> A = Alpha/Tanpa Keterangan</div>
        <div class="legend-item"><div class="legend-box" style="background:#f0f0f0;"></div> - = Tidak Ada Pertemuan</div>
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