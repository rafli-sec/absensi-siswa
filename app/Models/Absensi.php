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
        'mapel',
        'jam_ke',
    ];

    public function siswa()
    {
       
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id_siswa');
    }

    public function guru()
    {
        
        return $this->belongsTo(Guru::class, 'id_guru', 'id_guru');
    }

    public function logWhatsapp()
    {
        
        return $this->hasOne(LogWhatsapp::class, 'id_absensi', 'id_absensi');
    }
}