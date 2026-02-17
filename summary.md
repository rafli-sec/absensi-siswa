# Rangkuman Migrasi Database & Route

Dokumen ini berisi rangkuman migration dan route yang ada di proyek ini.

## Daftar Migration

### 1. 0001_01_01_000000_create_users_table.php
- **Tabel**: `users`
- **Deskripsi**: Membuat tabel users untuk autentikasi
- **Kolom**:
  - `id` (bigIncrements)
  - `name` (string)
  - `email` (string, unique)
  - `email_verified_at` (timestamp, nullable)
  - `password` (string)
  - `role` (enum: 'admin', 'guru', default: 'guru')
  - `remember_token` (string)
  - `timestamps`

- **Tabel**: `password_reset_tokens`
  - `email` (string, primary)
  - `token` (string)
  - `created_at` (timestamp, nullable)

- **Tabel**: `sessions`
  - `id` (string, primary)
  - `user_id` (foreignId, nullable)
  - `ip_address` (string, 45)
  - `user_agent` (text, nullable)
  - `payload` (longText)
  - `last_activity` (integer)

---

### 2. 2026_02_16_193955_create_gurus_table.php
- **Tabel**: `gurus`
- **Deskripsi**: Membuat tabel untuk data guru
- **Kolom**:
  - `id_guru` (bigIncrements)
  - `nip` (string, 30, unique)
  - `nama_guru` (string, 100)
  - `mapel` (string, 50)
  - `timestamps`

---

### 3. 2026_02_16_193959_create_siswas_table.php
- **Tabel**: `siswas`
- **Deskripsi**: Membuat tabel untuk data siswa
- **Kolom**:
  - `id_siswa` (bigIncrements)
  - `nis` (string, 20, unique)
  - `nama_siswa` (string, 100)
  - `kelas` (string, 20)
  - `no_hp_ortu` (string, 15)
  - `status` (enum: 'aktif', 'tidak_aktif', default: 'aktif')
  - `timestamps`

---

### 4. 2026_02_16_194003_create_absensis_table.php
- **Tabel**: `absensis`
- **Deskripsi**: Membuat tabel untuk data absensi siswa
- **Kolom**:
  - `id_absensi` (bigIncrements)
  - `id_siswa` (unsignedBigInteger, foreignKey -> siswas.id_siswa)
  - `id_guru` (unsignedBigInteger, foreignKey -> gurus.id_guru)
  - `tanggal` (date)
  - `status_kehadiran` (enum: 'hadir', 'izin', 'sakit', 'alpha')
  - `waktu_input` (time)
  - `timestamps`

- **Relasi**:
  - `id_siswa` -> `siswas.id_siswa` (cascadeOnDelete)
  - `id_guru` -> `gurus.id_guru` (cascadeOnDelete)

---

### 5. 2026_02_16_194035_create_log_whatsapps_table.php
- **Tabel**: `log_whatsapps`
- **Deskripsi**: Membuat tabel untuk log pengiriman WhatsApp
- **Kolom**:
  - `id_log` (bigIncrements)
  - `id_absensi` (unsignedBigInteger, foreignKey -> absensis.id_absensi)
  - `no_tujuan` (string, 15)
  - `pesan` (text)
  - `status_kirim` (enum: 'berhasil', 'gagal')
  - `waktu_kirim` (dateTime)
  - `timestamps`

- **Relasi**:
  - `id_absensi` -> `absensis.id_absensi` (cascadeOnDelete)

---

## Route & Controller

### Web Routes (routes/web.php)

| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/` | - | Halaman welcome |
| GET | `/dashboard` | - | Redirect ke dashboard berdasarkan role (admin → /admin/dashboard, guru → /guru/dashboard) |
| GET | `/admin/dashboard` | - | Dashboard admin (middleware: auth, verified, admin) |
| GET | `/guru/dashboard` | - | Dashboard guru (middleware: auth, verified, guru) |
| GET | `/admin/user-guru` | `UserGuruController@index` | List akun guru |
| POST | `/admin/user-guru` | `UserGuruController@store` | Buat akun guru |
| GET | `/admin/user-guru/{id}` | `UserGuruController@show` | Detail akun guru |
| PUT | `/admin/user-guru/{id}` | `UserGuruController@update` | Update akun guru |
| DELETE | `/admin/user-guru/{id}` | `UserGuruController@destroy` | Hapus akun guru |
| GET | `/admin/guru` | `GuruController@index` | List data guru (Inertia) |
| POST | `/admin/guru` | `GuruController@store` | Simpan data guru |
| GET | `/admin/guru/{id}` | `GuruController@show` | Detail data guru |
| PUT | `/admin/guru/{id}` | `GuruController@update` | Update data guru |
| DELETE | `/admin/guru/{id}` | `GuruController@destroy` | Hapus data guru |

### API Routes (routes/api.php)

| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/api/user` | - | Get current user (middleware: auth:sanctum) |
| GET | `/api/admin/user-guru` | `UserGuruController@index` | List akun guru |
| POST | `/api/admin/user-guru` | `UserGuruController@store` | Buat akun guru |
| GET | `/api/admin/user-guru/{id}` | `UserGuruController@show` | Detail akun guru |
| PUT | `/api/admin/user-guru/{id}` | `UserGuruController@update` | Update akun guru |
| DELETE | `/api/admin/user-guru/{id}` | `UserGuruController@destroy` | Hapus akun guru |
| GET | `/api/admin/guru` | `GuruController@index` | List data guru |
| POST | `/api/admin/guru` | `GuruController@store` | Simpan data guru |
| GET | `/api/admin/guru/{id}` | `GuruController@show` | Detail data guru |
| PUT | `/api/admin/guru/{id}` | `GuruController@update` | Update data guru |
| DELETE | `/api/admin/guru/{id}` | `GuruController@destroy` | Hapus data guru |

### Settings Routes (routes/settings.php)

| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/settings/profile` | `ProfileController@edit` | Edit profil |
| PATCH | `/settings/profile` | `ProfileController@update` | Update profil |
| DELETE | `/settings/profile` | `ProfileController@destroy` | Hapus profil (middleware: auth, verified) |
| GET | `/settings/password` | `PasswordController@edit` | Edit password |
| PUT | `/settings/password` | `PasswordController@update` | Update password |
| GET | `/settings/appearance` | - | Tampilan appearance |
| GET | `/settings/two-factor` | `TwoFactorAuthenticationController@show` | Two-factor auth |

---

## Diagram Relasi

```
users (otentikasi)
    │
    └── role: 'admin' | 'guru'

gurus ──────► absensis ◄────── siswas
                │
                └──► log_whatsapps
```

## Catatan

- Primary key menggunakan `bigIncrements` dengan nama kustom (`id_guru`, `id_siswa`, `id_absensi`, `id_log`)
- Semua relasi menggunakan `cascadeOnDelete`
- Status kehadiran: hadir, izin, sakit, alpha
- Status siswa: aktif, tidak_aktif
- Role user: admin, guru
- Dua controller guru: `App\Http\Controllers\Admin\GuruController` (Inertia) dan `App\Http\Controllers\Api\Admin\GuruController` (API)

