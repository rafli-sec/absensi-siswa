<?php

namespace App\Jobs;

use App\Models\LogWhatsapp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendWaAbsensi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $dataWa;

    public function __construct($dataWa)
    {
        $this->dataWa = $dataWa;
    }

    public function handle()
    {
        // AMBIL DATA DARI LOG
        $log = LogWhatsapp::find($this->dataWa->id_log);

        // KIRIM KE FONNTE
        $response = Http::withHeaders([
            'Authorization' => '1d6C5ACV1JAahRYeSAN9', // Ganti dengan token Anda
        ])->post('https://api.fonnte.com/send', [
            'target' => $log->no_tujuan,
            'message' => $log->pesan,
        ]);

        if ($response->successful()) {
            $log->update([
                'status_kirim' => 'berhasil',
                'waktu_kirim' => now()
            ]);
        } else {
            $log->update(['status_kirim' => 'gagal']);
        }

        // JEDA 5 DETIK SEBELUM JOB BERIKUTNYA DIAMBIL
        sleep(5);
    }
}