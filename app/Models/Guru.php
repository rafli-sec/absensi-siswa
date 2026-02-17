<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Guru extends Model
{
    protected $primaryKey = 'id_guru'; 
    protected $fillable = ['nip', 'nama_guru', 'mapel', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}