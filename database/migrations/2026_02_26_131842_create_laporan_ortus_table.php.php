<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_ortus', function (Blueprint $table) {
            $table->id('id_laporan');
            
            // Relasi ke tabel siswa (SANGAT PENTING untuk Smart System)
            $table->unsignedBigInteger('id_siswa');
            
            // TAMBAHAN: Kolom untuk mencatat ID Guru yang memvalidasi (ACC) laporan
            // Dibuat nullable karena saat ortu baru melapor, belum ada guru yang ACC
            $table->unsignedBigInteger('id_guru')->nullable();
            
            $table->string('nama_pengirim', 100);
            $table->string('no_hp_pengirim', 15);
            
            // Tanggal ini yang akan dicocokkan dengan tanggal absen guru
            $table->date('tanggal_izin'); 
            
            $table->enum('jenis_laporan', ['sakit', 'izin', 'pengaduan']);
            $table->text('pesan');
            $table->enum('status', ['ditolak', 'diterima'])->nullable();
            $table->timestamps();

            // Aturan relasi 1: Jika data siswa dihapus, laporan ortunya juga ikut terhapus
            $table->foreign('id_siswa')
                  ->references('id_siswa')
                  ->on('siswas')
                  ->cascadeOnDelete();
                  
            // Aturan relasi 2: Jika data guru dihapus, laporan tetap ada tapi id_guru jadi null
            $table->foreign('id_guru')
                  ->references('id_guru')
                  ->on('gurus')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_ortus');
    }
};