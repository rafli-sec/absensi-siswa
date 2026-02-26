<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Absensi;
use App\Models\Siswa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AbsensiCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $guru = User::factory()->create([
            'role' => 'guru',
            'email' => 'guru@test.com',
        ]);
        $guru->markEmailAsVerified();
        
        $this->actingAs($guru);
    }

    public function test_guru_can_view_absensi_list()
    {
        $response = $this->get('/guru/absensi');
        $response->assertStatus(200);
    }

    public function test_guru_can_view_create_absensi()
    {
        $response = $this->get('/guru/absensi/create');
        $response->assertStatus(200);
    }

    public function test_guru_can_create_absensi()
    {
        $siswa = Siswa::factory()->create();
        
        $absensiData = [
            'kelas' => 'X',
            'tanggal' => '2024-01-15',
            'siswa_id' => $siswa->id,
            'status' => 'hadir',
            'keterangan' => '',
        ];

        $response = $this->post('/guru/absensi', $absensiData);
        $response->assertRedirect();
    }
}
