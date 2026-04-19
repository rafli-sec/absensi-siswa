<!DOCTYPE html>
<html>
<head>
    <title>Rekap Absensi Kehadiran Matriks</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 9px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; text-transform: uppercase; }
        .header h2 { margin: 0; font-size: 16px; }
        .info-table { width: 100%; margin-bottom: 15px; font-weight: bold; font-size: 11px; }
        
        table.main-table { width: 100%; border-collapse: collapse; }
        table.main-table th, table.main-table td { 
            border: 1px solid #000; 
            padding: 3px 1px;
            text-align: center; 
            vertical-align: middle;
        }
        .text-left { text-align: left !important; padding-left: 5px !important; white-space: nowrap; }
        .bg-gray { background-color: #f2f2f2; }
        
        .status-h { color: #059669; }
        .status-i { color: #2563eb; }
        .status-s { color: #d97706; }
        .status-a { color: #dc2626; }
        
        .footer { margin-top: 15px; font-size: 9px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Rekap Absensi Kehadiran Siswa</h2>
    </div>

    <table class="info-table">
        <tr>
            <td width="15%">Tahun Ajaran</td><td>: {{ $tahun_ajaran }}</td>
            <td width="15%">Mata Pelajaran</td><td>: {{ $mapel }}</td>
        </tr>
        <tr>
            <td>Semester</td><td>: {{ $semester }}</td>
            <td>Guru</td><td>: {{ $dosen }}</td>
        </tr>
        <tr>
            <td>Kelas</td><td>: {{ $kelas }}</td>
            <td>Bulan</td><td>: {{ strtoupper($bulan_cetak) }}</td>
        </tr>
        <tr>
            <td>Tgl Cetak</td><td>: {{ date('d-M-Y H:i') }}</td>
            <td></td><td></td>
        </tr>
    </table>

    @php
        $totalPertemuan = count($tanggalPertemuan);
    @endphp

    <table class="main-table">
        <thead>
            <tr class="bg-gray">
                <th rowspan="2">No</th>
                <th rowspan="2">NIS</th>
                <th rowspan="2" class="text-left">Nama Siswa</th>
                
                <th colspan="31">Tanggal</th>
                
                <th rowspan="2">H</th>
                <th rowspan="2">I</th>
                <th rowspan="2">S</th>
                <th rowspan="2">A</th>
                <th rowspan="2">%</th>
            </tr>
            <tr class="bg-gray">
                @for ($day = 1; $day <= 31; $day++)
                    <th width="2%">{{ $day }}</th>
                @endfor
            </tr>
        </thead>
        <tbody>
            @foreach($daftarSiswa as $index => $siswa)
                @php
                    $riwayat = $absensi->get($siswa->id_siswa) ?? collect();
                    
                    $h = $riwayat->where('status_kehadiran', 'hadir')->count();
                    $i_count = $riwayat->where('status_kehadiran', 'izin')->count();
                    $s = $riwayat->where('status_kehadiran', 'sakit')->count();
                    $a = $riwayat->where('status_kehadiran', 'alpha')->count();
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $siswa->nis }}</td>
                    <td class="text-left">{{ strtoupper($siswa->nama_siswa) }}</td>
                    
                    @for ($day = 1; $day <= 31; $day++)
                        @php
                            $status = '-';
                            $absen = $riwayat->first(function($item) use ($day) {
                                return (int)\Carbon\Carbon::parse($item->tanggal)->format('j') === $day;
                            });

                            if($absen) {
                                $status = strtoupper(substr($absen->status_kehadiran, 0, 1));
                            }
                        @endphp
                        
                        <td class="status-{{ strtolower($status) }}">
                            @if($status !== '-') <b>{{ $status }}</b> @else - @endif
                        </td>
                    @endfor

                    <td class="bg-gray"><b>{{ $h }}</b></td>
                    <td class="bg-gray"><b>{{ $i_count }}</b></td>
                    <td class="bg-gray"><b>{{ $s }}</b></td>
                    <td class="bg-gray"><b>{{ $a }}</b></td>
                    <td class="bg-gray">
                        <b>{{ $totalPertemuan > 0 ? round(($h / $totalPertemuan) * 100) : 0 }}%</b>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <strong>Keterangan Status:</strong> &nbsp; H: Hadir &nbsp; I: Izin &nbsp; S: Sakit &nbsp; A: Alpha<br>
        * % (Prosentase) dihitung berdasarkan jumlah kehadiran dibagi total pertemuan yang sudah dilaksanakan ({{ $totalPertemuan }} Pertemuan).
    </div>
</body>
</html>