<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0 0 5px 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 0; font-size: 12px; }
        .info-table { width: 100%; margin-bottom: 20px; font-weight: bold; }
        .info-table td { padding: 3px 0; }
        
        table.main-table { width: 100%; border-collapse: collapse; }
        table.main-table th, table.main-table td { 
            border: 1px solid #000; 
            padding: 8px 5px; 
            text-align: center; 
        }
        table.main-table th { background-color: #f2f2f2; text-transform: uppercase; font-size: 11px; }
        .text-left { text-align: left !important; padding-left: 10px !important; }
        .footer { margin-top: 30px; font-size: 10px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $title }}</h2>
        <p>Mata Pelajaran: {{ strtoupper($mapel) }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="20%">Nama Guru</td><td width="30%">: {{ $guru }}</td>
            <td width="20%">Tanggal Cetak</td><td width="30%">: {{ $tanggal }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th width="10%">No</th>
                <th width="30%">Kelas</th>
                <th width="15%">Total Hadir</th>
                <th width="15%">Total Izin</th>
                <th width="15%">Total Sakit</th>
                <th width="15%">Total Alpha</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @forelse($rekap as $kelas => $items)
            <tr>
                <td>{{ $no++ }}</td>
                <td class="text-left">Kelas {{ $kelas }}</td>
                <td>{{ $items->where('status_kehadiran', 'hadir')->count() }}</td>
                <td>{{ $items->where('status_kehadiran', 'izin')->count() }}</td>
                <td>{{ $items->where('status_kehadiran', 'sakit')->count() }}</td>
                <td>{{ $items->where('status_kehadiran', 'alpha')->count() }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6">Belum ada data absensi untuk mata pelajaran ini.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini digenerate secara otomatis oleh sistem Rekap Absensi.
    </div>
</body>
</html>