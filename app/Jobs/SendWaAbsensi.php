<?php

namespace App\Jobs;

use App\Models\LogWhatsapp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendWaAbsensi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $logId;
    
    /**
     * Tentukan jumlah percobaan jika job gagal.
     */
    public $tries = 3;

    /**
     * Tentukan waktu tunggu (detik) sebelum mencoba lagi setelah gagal.
     */
    public $backoff = 60;

    public function __construct($log)
    {
        // Simpan ID saja agar data tetap fresh saat diambil di handle()
        $this->logId = $log->id_log;
    }

    public function handle()
    {
        $log = LogWhatsapp::find($this->logId);

        if (!$log) return;

        // Gunakan token dari .env agar lebih aman
        $token = env('TOKEN_FONNTE', '1d6C5ACV1JAahRYeSAN9');

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target'      => $log->no_tujuan,
                'message'     => $log->pesan,
                'delay'       => '5-10', // Gunakan delay server-side Fonnte (Lebih Aman)
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                $log->update([
                    'status_kirim' => 'berhasil',
                    'waktu_kirim'  => now()
                ]);
            } else {
                Log::error("Fonnte Error: " . $response->body());
                $log->update(['status_kirim' => 'gagal']);
                
                // Memicu retry jika gagal dari sisi server Fonnte
                $this->release(60); 
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp Job Exception: " . $e->getMessage());
            $this->fail($e);
        }
    }
}