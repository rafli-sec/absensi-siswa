<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensis';
    protected $primaryKey = 'id_absensi';

    protected $fillable = [
        'id_siswa',
        'id_guru',
        'tanggal',
        'status_kehadiran',
        'waktu_input',
    ];

    public function siswa()
    {
        // Tambahkan 'id_siswa' sebagai parameter ketiga (owner key)
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id_siswa');
    }

    public function guru()
    {
        // Tambahkan 'id_guru' sebagai parameter ketiga (owner key)
        return $this->belongsTo(Guru::class, 'id_guru', 'id_guru');
    }

    public function logWhatsapps()
    {
        return $this->hasMany(LogWhatsapp::class, 'id_absensi', 'id_absensi');
    }
}