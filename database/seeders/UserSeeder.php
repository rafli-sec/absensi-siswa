<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
User::create([
    'name' => 'Admin Sekolah',
    'email' => 'admin@smp51.sch.id',
    'password' => Hash::make('password'),
    'role' => 'admin'
]);

User::create([
    'name' => 'Guru A',
    'email' => 'guru@smp51.sch.id',
    'password' => Hash::make('password'),
    'role' => 'guru'
]);
    }
}
