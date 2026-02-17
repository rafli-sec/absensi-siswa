<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogWhatsapp extends Model
{
    use HasFactory;

    protected $table = 'log_whatsapps';
    protected $primaryKey = 'id_log';

    protected $fillable = [
        'id_absensi',
        'no_tujuan',
        'pesan',
        'status_kirim',
        'waktu_kirim',
    ];

    public $timestamps = true;

    // 🔗 Relasi: LogWhatsapp → Absensi
    public function absensi()
    {
        return $this->belongsTo(Absensi::class, 'id_absensi');
    }
}
