<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi {{ $rekapData['siswa']['nama_siswa'] }} - Semester {{ $semester }}</title>
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
        .info-table td:first-child { width: 20%; font-weight: bold; background: #f1f5f9; }
        
        .main-table { width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 20px; }
        .main-table th, .main-table td { border: 1px solid #94a3b8; padding: 6px 4px; text-align: center; vertical-align: middle; }
        .main-table th { background-color: #e2e8f0; font-weight: bold; }
        .main-table .text-left { text-align: left; }
        .main-table .font-bold { font-weight: bold; }
        
        .bg-emerald { background-color: #d1fae5; }
        .bg-amber { background-color: #fed7aa; }
        .bg-rose { background-color: #ffe4e6; }
        .bg-blue { background-color: #dbeafe; }
        
        .ringkasan-card { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px; 
            gap: 10px;
        }
        .ringkasan-item { 
            flex: 1; 
            padding: 15px 10px; 
            border-radius: 12px; 
            text-align: center;
        }
        .ringkasan-item .value { font-size: 28px; font-weight: bold; }
        .ringkasan-item .label { font-size: 9px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
        
        .signature { width: 100%; margin-top: 30px; }
        .signature td { padding-top: 40px; text-align: center; font-size: 10px; }
        
        .predikat-badge { 
            display: inline-block;
            padding: 4px 12px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: bold;
        }
        .predikat-sangat-baik { background: #d1fae5; color: #065f46; }
        .predikat-baik { background: #dbeafe; color: #1e40af; }
        .predikat-cukup { background: #fed7aa; color: #9a3412; }
        .predikat-kurang { background: #ffe4e6; color: #9f1239; }
    </style>
</head>
<body>

    {{-- HEADER --}}
    <div class="school-info">
        <h3>UPT SPF SMP NEGERI 51 MAKASSAR</h3>
        <p>Jl. Tamangapa Raya V No.48 C, Kec. Manggala, Makassar. Pos: 90235</p>
        <p>Email: uptspfsmpn51makassar@gmail.com</p>
        <p><strong>LAPORAN REKAP ABSENSI PER SISWA</strong></p>
        <p>Semester {{ $semester }} - Tahun Ajaran {{ $tahun_ajaran }}</p>
    </div>

    {{-- IDENTITAS SISWA --}}
    <table class="info-table">
        <tr>
            <td>Nama Siswa</td>
            <td colspan="3"><strong>{{ $rekapData['siswa']['nama_siswa'] }}</strong></td>
            <td>NIS</td>
            <td colspan="3"><strong>{{ $rekapData['siswa']['nis'] }}</strong></td>
        </tr>
        <tr>
            <td>Kelas</td>
            <td colspan="3"><strong>{{ $rekapData['siswa']['kelas'] }}</strong></td>
            <td>Jenis Kelamin</td>
            <td colspan="3"><strong>{{ $rekapData['siswa']['jenis_kelamin'] === 'perempuan' ? 'Perempuan' : 'Laki-laki' }}</strong></td>
        </tr>
        <tr>
            <td>No. HP Orang Tua</td>
            <td colspan="3"><strong>{{ $rekapData['siswa']['no_hp_ortu'] ?? '-' }}</strong></td>
            <td>Wali Kelas</td>
            <td colspan="3"><strong>{{ $guru }}</strong></td>
        </tr>
    </table>

    {{-- RINGKASAN KEHADIRAN --}}
    <div class="ringkasan-card">
        <div class="ringkasan-item" style="background: #d1fae5;">
            <div class="value">{{ $rekapData['total_hadir'] }}</div>
            <div class="label">Hadir</div>
        </div>
        <div class="ringkasan-item" style="background: #fed7aa;">
            <div class="value">{{ $rekapData['total_sakit'] }}</div>
            <div class="label">Sakit</div>
        </div>
        <div class="ringkasan-item" style="background: #dbeafe;">
            <div class="value">{{ $rekapData['total_izin'] }}</div>
            <div class="label">Izin</div>
        </div>
        <div class="ringkasan-item" style="background: #ffe4e6;">
            <div class="value">{{ $rekapData['total_alpha'] }}</div>
            <div class="label">Alpha</div>
        </div>
        <div class="ringkasan-item" style="background: #e0e7ff;">
            <div class="value">{{ $rekapData['persentase'] }}%</div>
            <div class="label">Persentase Hadir</div>
        </div>
    </div>

    {{-- PREDIKAT --}}
    <div style="text-align: center; margin-bottom: 20px;">
        @php
            $persentase = $rekapData['persentase'];
            if ($persentase >= 90) {
                $predikatClass = 'predikat-sangat-baik';
                $predikatText = 'SANGAT BAIK';
                $keterangan = 'Kehadiran sangat memuaskan, pertahankan!';
            } elseif ($persentase >= 75) {
                $predikatClass = 'predikat-baik';
                $predikatText = 'BAIK';
                $keterangan = 'Kehadiran baik, tingkatkan lagi!';
            } elseif ($persentase >= 60) {
                $predikatClass = 'predikat-cukup';
                $predikatText = 'CUKUP';
                $keterangan = 'Perlu perhatian, tingkatkan kehadiran!';
            } else {
                $predikatClass = 'predikat-kurang';
                $predikatText = 'KURANG';
                $keterangan = 'Kehadiran rendah, perlu bimbingan khusus!';
            }
        @endphp
        <span class="predikat-badge {{ $predikatClass }}">{{ $predikatText }}</span>
        <p style="font-size: 9px; margin-top: 5px; color: #64748b;">{{ $keterangan }}</p>
    </div>

    {{-- TABEL REKAP PER MAPEL --}}
    <table class="main-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="35%">Mata Pelajaran</th>
                <th width="10%">Hadir</th>
                <th width="10%">Sakit</th>
                <th width="10%">Izin</th>
                <th width="10%">Alpha</th>
                <th width="10%">% Hadir</th>
                <th width="10%">Pertemuan</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @foreach($rekapData['rekap_mapel'] as $mapel)
                @php
                    $persentaseMapel = $mapel['persentase'];
                    if ($persentaseMapel >= 90) $bgColor = 'bg-emerald';
                    elseif ($persentaseMapel >= 75) $bgColor = 'bg-blue';
                    elseif ($persentaseMapel >= 60) $bgColor = '';
                    else $bgColor = 'bg-rose';
                @endphp
                <tr>
                    <td>{{ $no++ }}</td>
                    <td class="text-left">{{ $mapel['mapel'] }}</td>
                    <td class="bg-emerald">{{ $mapel['hadir'] }}</td>
                    <td class="bg-amber">{{ $mapel['sakit'] }}</td>
                    <td class="bg-blue">{{ $mapel['izin'] }}</td>
                    <td class="bg-rose">{{ $mapel['alpha'] }}</td>
                    <td class="font-bold {{ $bgColor }}">{{ $persentaseMapel }}%</td>
                    <td>{{ $mapel['total_pertemuan'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- CATATAN --}}
    <div style="margin-top: 15px; padding: 10px; background: #f8fafc; border-radius: 8px; font-size: 9px;">
        <strong>📌 Catatan:</strong>
        <ul style="margin-left: 20px; margin-top: 5px;">
            <li>Persentase kehadiran dihitung dari total pertemuan efektif per mata pelajaran</li>
            <li>Status Alpha = Tidak hadir tanpa keterangan</li>
            <li>Laporan orang tua yang sudah divalidasi akan terhitung sebagai Sakit/Izin</li>
        </ul>
    </div>

    {{-- REKOMENDASI --}}
    @if($persentase < 75)
        <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; font-size: 9px;">
            <strong>⚠️ Rekomendasi:</strong> Kehadiran siswa perlu ditingkatkan. Disarankan komunikasi dengan orang tua/wali untuk mengetahui kendala yang dihadapi.
        </div>
    @elseif($persentase >= 90)
        <div style="margin-top: 15px; padding: 10px; background: #d1fae5; border-radius: 8px; border-left: 4px solid #10b981; font-size: 9px;">
            <strong>✅ Apresiasi:</strong> Kehadiran sangat baik! Pertahankan prestasi ini.
        </div>
    @endif

    {{-- FOOTER TANDA TANGAN --}}
    <div style="margin-top: 30px;">
        <table class="signature">
            <tr>
                <td width="40%">
                    <div style="text-align: center;">
                        Mengetahui,<br>
                        Orang Tua/Wali<br><br><br><br>
                        <strong><u>__________________</u></strong>
                    </div>
                </td>
                <td width="20%"></td>
                <td width="40%" class="text-center">
                    Surabaya, {{ date('d F Y') }}<br>
                    Wali Kelas<br><br><br><br>
                    <strong><u>{{ $guru }}</u></strong><br>
                    NIP. __________________
                </td>
            </tr>
        </table>
    </div>

</body>
</html>