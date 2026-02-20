<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make waktu_kirim nullable (initially unknown when message is pending)
        DB::statement("ALTER TABLE log_whatsapps MODIFY COLUMN waktu_kirim DATETIME NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE log_whatsapps MODIFY COLUMN waktu_kirim DATETIME NOT NULL");
    }
};

