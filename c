<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiswaCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@test.com',
        ]);
        $admin->markEmailAsVerified();
        
        $this->actingAs($admin);
    }

    public function test_admin_can_view_siswa_list()
    {
        $response = $this->get('/admin/siswa');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_siswa()
    {
        $siswaData = [
            'nama' => 'Siswa Test',
            'nis' => '12345',
            'kelas' => 'X',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '2010-01-01',
            'alamat' => 'Jl. Test',
            'no_hp_ortu' => '081234567890',
        ];

        $response = $this->post('/admin/siswa', $siswaData);
        $response->assertRedirect('/admin/siswa');
        $this->assertDatabaseHas('siswas', ['nama' => 'Siswa Test']);
    }

    public function test_admin_can_update_siswa()
    {
        $siswa = Siswa::factory()->create();
        
        $response = $this->put("/admin/siswa/{$siswa->id}", [
            'nama' => 'Updated Siswa',
            'nis' => $siswa->nis,
            'kelas' => $siswa->kelas,
            'jenis_kelamin' => $siswa->jenis_kelamin,
            'tanggal_lahir' => $siswa->tanggal_lahir,
            'alamat' => $siswa->alamat,
            'no_hp_ortu' => $siswa->no_hp_ortu,
        ]);
        
        $this->assertDatabaseHas('siswas', ['nama' => 'Updated Siswa']);
    }

    public function test_admin_can_delete_siswa()
    {
        $siswa = Siswa::factory()->create();
        
        $response = $this->delete("/admin/siswa/{$siswa->id}");
        
        $this->assertDatabaseMissing('siswas', ['id' => $siswa->id]);
    }
}
