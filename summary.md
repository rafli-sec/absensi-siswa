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
  - `mapel` (string, 50, nullable)
  - `jam_ke` (integer, default: 1)
  - `tanggal` (date)
  - `status_kehadiran` (enum: 'hadir', 'izin', 'sakit', 'alpha')
  - `waktu_input` (time)
  - `timestamps`

- **Relasi**:
  - `id_siswa` -> `siswas.id_siswa` (cascadeOnDelete)
  - `id_guru` -> `gurus.id_guru` (cascadeOnDelete)

- **Index**:
  - `tanggal`, `id_guru`, `mapel` (untuk mempercepat pencarian rekap)

---

### 5. 2026_02_16_194035_create_log_whatsapps_table.php
- **Tabel**: `log_whatsapps`
- **Deskripsi**: Membuat tabel untuk log pengiriman WhatsApp
- **Kolom**:
  - `id_log` (bigIncrements)
  - `id_absensi` (unsignedBigInteger, foreignKey -> absensis.id_absensi)
  - `no_tujuan` (string, 15)
  - `pesan` (text)
  - `status_kirim` (enum: 'berhasil', 'gagal', 'pending')
  - `waktu_kirim` (dateTime)
  - `timestamps`

- **Relasi**:
  - `id_absensi` -> `absensis.id_absensi` (cascadeOnDelete)

---

## Route & Controller

### Web Routes (routes/web.php)

#### Public & Dashboard
| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/` | - | Halaman welcome |
| GET | `/dashboard` | - | Redirect ke dashboard berdasarkan role (admin → /admin/dashboard, guru → /guru/dashboard) |
| GET | `/admin/dashboard` | - | Dashboard admin (middleware: auth, verified, admin) |
| GET | `/guru/dashboard` | - | Dashboard guru (middleware: auth, verified, guru) |

#### Admin - Guru Management
| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/admin/guru` | `GuruController@index` | List data guru (Inertia) |
| GET | `/admin/guru/create` | `GuruController@create` | Form tambah guru |
| POST | `/admin/guru` | `GuruController@store` | Simpan data guru |
| GET | `/admin/guru/{id}` | `GuruController@show` | Detail data guru |
| GET | `/admin/guru/{id}/edit` | `GuruController@edit` | Form edit guru |
| PUT | `/admin/guru/{id}` | `GuruController@update` | Update data guru |
| DELETE | `/admin/guru/{id}` | `GuruController@destroy` | Hapus data guru |

#### Admin - Siswa Management
| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/admin/siswa` | `SiswaController@index` | List data siswa |
| GET | `/admin/siswa/create` | `SiswaController@create` | Form tambah siswa |
| POST | `/admin/siswa` | `SiswaController@store` | Simpan data siswa |
| GET | `/admin/siswa/{id}/edit` | `SiswaController@edit` | Form edit siswa |
| PUT | `/admin/siswa/{id}` | `SiswaController@update` | Update data siswa |
| DELETE | `/admin/siswa/{id}` | `SiswaController@destroy` | Hapus data siswa |

#### Guru - Absensi Management
| Method | Endpoint | Controller | Fungsi |
|--------|----------|------------|-------|
| GET | `/guru/absensi` | `AbsensiController@index` | Riwayat absensi berdasarkan guru yang login |
| GET | `/guru/absensi/create` | `AbsensiController@create` | Form input absensi (pilih kelas, tanggal, mapel, jam ke) |
| POST | `/guru/absensi` | `AbsensiController@store` | Simpan absensi & antrekan WhatsApp otomatis |
| GET | `/guru/absensi/edit/{kelas}/{tanggal}` | `AbsensiController@edit` | Form edit absensi (ubah kehadiran siswa) |

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

## Fitur Tambahan

### WhatsApp Notification (SendWaAbsensi Job)
- **File**: `app/Jobs/SendWaAbsensi.php`
- **Trigger**: Ketika siswa TIDAK HADIR (status: izin, sakit, alpha)
- **Proses**:
  1. Saat absensi disimpan, jika siswa tidak hadir, data masuk ke tabel `log_whatsapps` dengan status 'pending'
  2. Job `SendWaAbsensi` dikirim ke queue
  3. Job mengeksekusi HTTP POST ke API Fonnte untuk mengirim WhatsApp
  4. Setelah dikirim, status diupdate menjadi 'berhasil' atau 'gagal'
  5. Ada jeda 5 detik antar job untuk menghindari rate limit
- **Pesan**: Otomatisformat: "Pemberitahuan: Siswa *{nama_siswa}* tercatat *{status}* pada Mapel {mapel} (Jam ke-{jam_ke})."

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

---

## Catatan

- Primary key menggunakan `bigIncrements` dengan nama kustom (`id_guru`, `id_siswa`, `id_absensi`, `id_log`)
- Semua relasi menggunakan `cascadeOnDelete`
- Status kehadiran: hadir, izin, sakit, alpha
- Status siswa: aktif, tidak_aktif
- Role user: admin, guru
- Dua controller guru: `App\Http\Controllers\Admin\GuruController` (Inertia) dan `App\Http\Controllers\Api\Admin\GuruController` (API)
- Absensi memiliki kolom `mapel` dan `jam_ke` untuk informasi pelajaran dan jam ke-
- Notifikasi WhatsApp otomatis dikirim ke orang tua/wali siswa ketika siswa tidak hadir
