<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Absensi;
use App\Models\LogWhatsapp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuruCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@test.com',
        ]);
        $admin->markEmailAsVerified();
        
        $this->actingAs($admin);
    }

    public function test_admin_can_view_guru_list()
    {
        $response = $this->get('/admin/guru');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_guru()
    {
        $guruData = [
            'nama' => 'John Doe',
            'nip' => '1234567890',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '1990-01-01',
            'alamat' => 'Jl. Test',
            'no_hp' => '081234567890',
        ];

        $response = $this->post('/admin/guru', $guruData);
        $response->assertRedirect('/admin/guru');
        $this->assertDatabaseHas('gurus', ['nama' => 'John Doe']);
    }

    public function test_admin_can_update_guru()
    {
        $guru = Guru::factory()->create();
        
        $response = $this->put("/admin/guru/{$guru->id}", [
            'nama' => 'Updated Name',
            'nip' => $guru->nip,
            'jenis_kelamin' => $guru->jenis_kelamin,
            'tanggal_lahir' => $guru->tanggal_lahir,
            'alamat' => $guru->alamat,
            'no_hp' => $guru->no_hp,
        ]);
        
        $this->assertDatabaseHas('gurus', ['nama' => 'Updated Name']);
    }

    public function test_admin_can_delete_guru()
    {
        $guru = Guru::factory()->create();
        
        $response = $this->delete("/admin/guru/{$guru->id}");
        
        $this->assertDatabaseMissing('gurus', ['id' => $guru->id]);
    }
}
