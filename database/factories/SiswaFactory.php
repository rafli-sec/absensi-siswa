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
            
            // Kelas acak
            'kelas' => $this->faker->randomElement(['7A', '7B','7C', '8A', '8B','8C', '9A',]), 
            
            // PENTING: Harus 'laki-laki' atau 'perempuan' (Sesuai Gambar DB)
            'jenis_kelamin' => $this->faker->randomElement(['laki-laki', 'perempuan']), 
            
            'alamat' => $this->faker->address(),
            
            // No HP max 15 karakter
            'no_hp_ortu' => substr($this->faker->phoneNumber(), 0, 15), 
            
            // PENTING: Harus 'aktif' atau 'tidak_aktif' (Sesuai Gambar DB)
            'status' => $this->faker->randomElement(['aktif', 'tidak_aktif']), 
        ];
    }
}
