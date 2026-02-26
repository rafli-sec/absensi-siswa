<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanOrtu extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_laporan';

    protected $fillable = [
        'id_siswa', 
        'nama_pengirim', 
        'no_hp_pengirim', 
        'tanggal_izin', 
        'jenis_laporan', 
        'pesan', 
        'status'
    ];

    // Relasi balik ke Siswa
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id_siswa');
    }
}