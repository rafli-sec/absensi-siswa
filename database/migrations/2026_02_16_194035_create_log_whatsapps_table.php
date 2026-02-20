<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('log_whatsapps', function (Blueprint $table) {
            $table->bigIncrements('id_log');

            $table->unsignedBigInteger('id_absensi');

            $table->string('no_tujuan', 15);
            $table->text('pesan');
            $table->enum('status_kirim', ['berhasil', 'gagal', 'pending']);
            $table->dateTime('waktu_kirim');

            $table->timestamps();

            $table->foreign('id_absensi')
                  ->references('id_absensi')
                  ->on('absensis')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_whatsapps');
    }
};
