<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absensis', function (Blueprint $table) {
            $table->bigIncrements('id_absensi');
            $table->unsignedBigInteger('id_siswa');
            $table->unsignedBigInteger('id_guru');
            
            // Kolom Tambahan untuk fleksibilitas guru mengajar double mapel/jam
            $table->string('mapel', 50)->nullable(); // Menyimpan nama mata pelajaran
            $table->integer('jam_ke')->default(1);   // Menyimpan sesi jam pelajaran (1, 2, dst)
            
            $table->date('tanggal');
            $table->enum('status_kehadiran', ['hadir', 'izin', 'sakit', 'alpha']);
            $table->time('waktu_input');
            $table->timestamps();

            // Foreign Key Constraints
            $table->foreign('id_siswa')
                  ->references('id_siswa')
                  ->on('siswas')
                  ->cascadeOnDelete();

            $table->foreign('id_guru')
                  ->references('id_guru')
                  ->on('gurus')
                  ->cascadeOnDelete();
                  
            // Index opsional untuk mempercepat pencarian rekap
            $table->index(['tanggal', 'id_guru', 'mapel']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};