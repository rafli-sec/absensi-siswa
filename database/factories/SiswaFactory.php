<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SiswaFactory extends Factory
{
    public function definition(): array
    {
        return [
            // NIS unik 5 digit
            'nis' => $this->faker->unique()->numerify('#####'), 
            
            'nama_siswa' => $this->faker->name(),
            
            // Kelas acak sesuai pilihan di SMPN 51 Makassar
            'kelas' => $this->faker->randomElement(['7A', '7B', '7C', '8A', '8B', '8C', '9A']), 
            
            'alamat' => $this->faker->address(),

            // Tambahkan nama orang tua agar tidak error (Sesuai update skema terakhir)
            'nama_ortu' => $this->faker->name(), 
            
            // PENTING: Harus 'laki-laki' atau 'perempuan'
            'jenis_kelamin' => $this->faker->randomElement(['laki-laki', 'perempuan']), 
            
            // Format 628... agar langsung bisa diuji coba dengan fitur WA Fonnte
            'no_hp_ortu' => '628' . $this->faker->numerify('#########'), 
            
            // Status kehadiran/aktif
            'status' => $this->faker->randomElement(['aktif', 'tidak_aktif']), 
        ];
    }
}