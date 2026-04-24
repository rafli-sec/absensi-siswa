<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Absensi Semester - {{ $mapel }} - Kelas {{ $kelas }}</title>
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
        .total-a { background-color: #ef9a9a;
