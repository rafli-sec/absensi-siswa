<?php

namespace App\Console\Commands;

use App\Jobs\SendWaAbsensi;
use App\Models\Absensi;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\LogWhatsapp;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestWaJob extends Command
{
    protected $signature = 'test:wa-job 
                            {phone : Nomor HP tujuan (contoh: 081234567890)}
                            {name : Nama siswa untuk pesan}';

    protected $description = 'Test sending WhatsApp via Queue Job';

    public function handle()
    {
        $phone = $this->argument('phone');
        $name = $this->argument('name');

        $this->info("🧪 Memulai test WhatsApp Job...");
        $this->info("📱 Nomor tujuan: {$phone}");
        $this->info("👤 Nama siswa: {$name}");

        // ============================================
        // LANGKAH 1: CEK DATA GURU (untuk id_guru)
        // ============================================
        $guru = Guru::first();
        
        if (!$guru) {
            // Buat data guru dummy jika belum ada
            $this->warn("⚠️ Data guru tidak ditemukan, membuat data dummy...");
            $guru = Guru::create([
                'nip' => '1234567890',
                'nama_guru' => 'Guru Test',
                'mapel' => 'Matematika'
            ]);
            $this->info("✅ Guru created: {$guru->nama_guru} (ID: {$guru->id_guru})");
        }

        // ============================================
        // LANGKAH 2: CEK DATA SISWA (untuk id_siswa)
        // ============================================
        $siswa = Siswa::where('no_hp_ortu', $phone)->first();
        
        if (!$siswa) {
            // Buat data siswa dummy jika belum ada
            $this->warn("⚠️ Data siswa tidak ditemukan, membuat data dummy...");
            $siswa = Siswa::create([
                'nis' => '999999',
                'nama_siswa' => $name,
                'kelas' => '7A',
                'alamat' => 'Jl. Test No. 123',
                'no_hp_ortu' => $phone,
                'status' => 'aktif',
                'jenis_kelamin' => 'laki-laki'
            ]);
            $this->info("✅ Siswa created: {$siswa->nama_siswa} (ID: {$siswa->id_siswa})");
        }

        // ============================================
        // LANGKAH 3: BUAT DATA ABSENSI
        // ============================================
        $tanggal = now()->format('Y-m-d');
        
        $absensi = Absensi::updateOrCreate(
            [
                'id_siswa' => $siswa->id_siswa,
                'tanggal' => $tanggal,
                'mapel' => 'Matematika',
                'jam_ke' => 1,
            ],
            [
                'id_guru' => $guru->id_guru,
                'status_kehadiran' => 'sakit', // Sakit akan memicu WA
                'waktu_input' => now()->toTimeString(),
            ]
        );

        $this->info("✅ Absensi created/updated (ID: {$absensi->id_absensi})");

        // ============================================
        // LANGKAH 4: INSERT KE TABEL LOG_WHATSAPPS
        // ============================================
        $pesan = "*PEMBERITAHUAN SEKOLAH*\n\n" .
                 "Yth. Wali Murid,\n" .
                 "Siswa a.n: *{$name}*\n" .
                 "Kelas: 7A\n" .
                 "Status Hari Ini: *SAKIT* 💊\n\n" .
                 "Mohon konfirmasinya jika ada kesalahan.\n" .
                 "_Waktu lapor: " . now()->format('H:i:s') . "_";

        $logWa = LogWhatsapp::create([
            'id_absensi' => $absensi->id_absensi,
            'no_tujuan' => $phone,
            'pesan' => $pesan,
            'status_kirim' => 'pending', // Status awal
        ]);

        $this->info("✅ Log WhatsApp created (ID: {$logWa->id_log}, Status: {$logWa->status_kirim})");

        // ============================================
        // LANGKAH 5: DISPATCH JOB KE QUEUE
        // ============================================
        $this->info("📤 Dispatching job ke queue...");
        
        SendWaAbsensi::dispatch($logWa);
        
        $this->info("✅ Job dispatched ke queue!");
        $this->info("");
        $this->info("📋 INSTRUKSI SELANJUTNYA:");
        $this->info("1. Jalankan queue worker:");
        $this->info("   php artisan queue:work");
        $this->info("");
        $this->info("2. Atau untuk one-time process:");
        $this->info("   php artisan queue:listen");
        $this->info("");
        $this->info("3. Cek status di tabel 'log_whatsapps' kolom 'status_kirim'");
        $this->info("   Seharusnya berubah dari 'pending' → 'berhasil' atau 'gagal'");
        
        return 0;
    }
}

