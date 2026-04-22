<!DOCTYPE html>
<html>
<head>
    <title>Rekap Absensi Semester</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #000; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        
        .header { text-align: center; margin-bottom: 20px; line-height: 1.5; }
        .header h3 { margin: 0; font-size: 14px; }
        
        .info-table { width: 100%; margin-bottom: 10px; font-weight: bold; font-size: 11px; }
        .info-table td { padding: 2px; }

        table.main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
        table.main-table th, table.main-table td { 
            border: 1px solid #000; 
            padding: 4px 2px; 
            text-align: center; 
            vertical-align: middle;
        }
        table.main-table th { background-color: #f2f2f2; font-size: 9px; }
        
        .bg-yellow { background-color: #fff9c4; } /* Warna highlight seperti di gambar */
    </style>
</head>
<body>

    <div class="header">
        <h3>UPT SPF SMP NEGERI 51 MAKASSAR</h3>
        <h3>Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235</h3>
        <h3>PROSENTASE KETIDAK HADIRAN SISWA</h3>
        <h3>TAHUN PELAJARAN {{ $tahun_ajaran }}</h3>
    </div>

    <table class="info-table">
        <tr>
            <td width="10%">KELAS</td><td width="40%">: {{ $kelas }}</td>
            <td width="15%">SEMESTER</td><td width="35%">: {{ $semester }}</td>
        </tr>
        <tr>
            <td>WALI KELAS</td><td>: {{ strtoupper($guru) }}</td> <td></td><td></td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th rowspan="2" width="3%">NO</th>
                <th rowspan="2" width="6%">NO INDUK</th>
                <th rowspan="2" width="20%">NAMA</th>
                <th rowspan="2" width="3%">L/P</th>
                
                <th colspan="{{ count($bulanList) * 3 }}">JUMLAH KETIDAK HADIRAN</th>
                
                <th colspan="3">JUMLAH</th>
                <th rowspan="2" width="4%" class="bg-yellow">JML<br>TOTAL</th>
                <th rowspan="2" width="5%">Prosentase<br>Hadir (%)</th>
            </tr>
            <tr>
                @foreach($bulanList as $namaBulan)
                    <th colspan="3">{{ $namaBulan }}</th>
                @endforeach
                
                <th>S</th><th>I</th><th>A</th>
            </tr>
            <tr>
                <th colspan="4"></th> @foreach($bulanList as $namaBulan)
                    <th>S</th><th>I</th><th class="bg-yellow">A</th>
                @endforeach
                <th colspan="5"></th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @foreach($rekapMatriks as $siswa)
            <tr>
                <td>{{ $no++ }}</td>
                <td>{{ $siswa['nis'] }}</td>
                <td class="text-left font-bold">&nbsp;{{ strtoupper($siswa['nama_siswa']) }}</td>
                <td>{{ $siswa['jk'] }}</td>

                @foreach($bulanList as $numBulan => $namaBulan)
                    @php 
                        $rek = $siswa['rekap_bulan'][$numBulan]; 
                    @endphp
                    <td>{{ $rek['S'] > 0 ? $rek['S'] : '' }}</td>
                    <td>{{ $rek['I'] > 0 ? $rek['I'] : '' }}</td>
                    <td class="bg-yellow">{{ $rek['A'] > 0 ? $rek['A'] : '' }}</td>
                @endforeach

                <td class="font-bold">{{ $siswa['total_s'] > 0 ? $siswa['total_s'] : '0' }}</td>
                <td class="font-bold">{{ $siswa['total_i'] > 0 ? $siswa['total_i'] : '0' }}</td>
                <td class="font-bold bg-yellow">{{ $siswa['total_a'] > 0 ? $siswa['total_a'] : '0' }}</td>
                
                <td class="font-bold bg-yellow">{{ $siswa['total_jml'] > 0 ? $siswa['total_jml'] : '0' }}</td>
                <td class="font-bold">{{ $siswa['persentase'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <br><br>
    <table width="100%" style="font-size: 11px;">
        <tr>
            <td width="70%"></td>
            <td width="30%" class="text-center">
                Makassar, {{ date('d - m - Y') }}<br>
                Guru Pembimbing / Wali Kelas<br><br><br><br>
                <b><u>{{ strtoupper($guru) }}</u></b><br>
                Nip. ...........................
            </td>
        </tr>
    </table>

</body>
</html>  lo..lo.