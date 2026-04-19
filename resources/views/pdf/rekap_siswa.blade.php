<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0 0 5px 0; font-size: 18px; text-transform: uppercase; }
        
        .box-info { border: 1px solid #000; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .box-info table { width: 100%; font-weight: bold; }
        .box-info td { padding: 4px 0; }
        
        table.main-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.main-table th, table.main-table td { 
            border: 1px solid #000; 
            padding: 8px 5px; 
            text-align: center; 
        }
        table.main-table th { background-color: #f2f2f2; text-transform: uppercase; font-size: 11px; }
        .text-left { text-align: left !important; padding-left: 10px !important; }
        
        .summary { width: 100%; margin-top: 20px; border-collapse: collapse; }
        .summary th, .summary td { border: 1px solid #000; padding: 8px; text-align: center; }
        .summary th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $title }}</h2>
    </div>

    <div class="box-info">
        <table>
            <tr>
                <td width="20%">Nama Siswa</td><td width="40%">: {{ strtoupper($siswa->nama_siswa) }}</td>
                <td width="15%">Guru</td><td width="25%">: {{ $guru }}</td>
            </tr>
            <tr>
                <td>NIS</td><td>: {{ $siswa->nis ?? '-' }}</td>
                <td>Tgl Cetak</td><td>: {{ date('d-m-Y H:i') }}</td>
            </tr>
            <tr>
                <td>Kelas</td><td>: {{ $siswa->kelas }}</td>
                <td></td><td></td>
            </tr>
        </table>
    </div>

    <h4 style="margin-bottom: 5px;">Riwayat Harian</h4>
    <table class="main-table">
        <thead>
            <tr>
                <th width="10%">No</th>
                <th width="25%">Tanggal</th>
                <th width="35%">Mata Pelajaran</th>
                <th width="15%">Jam Ke-</th>
                <th width="15%">Status</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @forelse($riwayat as $r)
            <tr>
                <td>{{ $no++ }}</td>
                <td>{{ \Carbon\Carbon::parse($r->tanggal)->format('d F Y') }}</td>
                <td class="text-left">{{ $r->mapel }}</td>
                <td>{{ $r->jam_ke }}</td>
                <td>
                    @if($r->status_kehadiran == 'hadir') <strong style="color: green;">HADIR</strong>
                    @elseif($r->status_kehadiran == 'izin') <strong style="color: blue;">IZIN</strong>
                    @elseif($r->status_kehadiran == 'sakit') <strong style="color: orange;">SAKIT</strong>
                    @else <strong style="color: red;">ALPHA</strong>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5">Belum ada riwayat absensi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <table class="summary">
        <tr>
            <th colspan="4">Akumulasi Total Kehadiran</th>
        </tr>
        <tr>
            <td><strong>Hadir:</strong> {{ $riwayat->where('status_kehadiran', 'hadir')->count() }}</td>
            <td><strong>Izin:</strong> {{ $riwayat->where('status_kehadiran', 'izin')->count() }}</td>
            <td><strong>Sakit:</strong> {{ $riwayat->where('status_kehadiran', 'sakit')->count() }}</td>
            <td><strong>Alpha:</strong> {{ $riwayat->where('status_kehadiran', 'alpha')->count() }}</td>
        </tr>
    </table>
</body>
</html>