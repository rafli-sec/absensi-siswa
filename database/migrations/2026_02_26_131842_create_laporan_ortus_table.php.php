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
            
            $table->string('nama_pengirim', 100);
            $table->string('no_hp_pengirim', 15);
            
            // Tanggal ini yang akan dicocokkan dengan tanggal absen guru
            $table->date('tanggal_izin'); 
            
            $table->enum('jenis_laporan', ['sakit', 'izin', 'pengaduan']);
            $table->text('pesan');
            $table->enum('status', ['menunggu', 'dibaca', 'diproses'])->default('menunggu');
            $table->timestamps();

            // Aturan relasi: Jika data siswa dihapus, laporan ortunya juga ikut terhapus
            $table->foreign('id_siswa')
                  ->references('id_siswa')
                  ->on('siswas')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_ortus');
    }
};