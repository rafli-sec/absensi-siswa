# Rangkuman Project Absensi Sekolah + WhatsApp Notification

## 📋 Deskripsi Project

Project ini adalah aplikasi sistem informasi absensi sekolah berbasis web yang dibangun dengan **Laravel 12** (backend) dan **React** (frontend menggunakan Inertia.js). Sistem ini memungkinkan guru untuk melakukan absensi siswa dan mengirimkan notifikasi WhatsApp otomatis kepada orang tua/wali ketika siswa tidak hadir.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Backend | Laravel 12 |
| Frontend | React + TypeScript + Inertia.js |
| Database | MySQL |
| Authentication | Laravel Fortify |
| API | Laravel Sanctum |
| Queue/Jobs | Laravel Queue |
| WhatsApp API | Fonnte |
| Build Tool | Vite |
| Styling | Tailwind CSS |

---

## 📦 Cara Install & Menjalankan Project

### 1. Clone & Install Dependencies

```bash
# Clone project
git clone <repository-url> munarah-skripsi
cd munarah-skripsi

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy .env file
cp .env.example .env
```

### 2. Setup Database

```bash
# Generate application key
php artisan key:generate

# Setup database (pastikan sudah buat database di MySQL/XAMPP)
# Edit file .env sesuai konfigurasi database Anda:
# DB_DATABASE=munarah_skripsi
# DB_USERNAME=root
# DB_PASSWORD=

# Jalankan migration
php artisan migrate

# Seed data (opsional - untuk testing)
php artisan db:seed
```

### 3. Konfigurasi WhatsApp (Fonnte)

Buka file `.env` dan tambahkan:

```env
TOKEN_FONNTE=your_fonnte_token_here
```

**Cara mendapatkan token Fonnte:**
1. Daftar di https://fonnte.com
2. Login dan masuk ke dashboard
3. Ambil API Token dari pengaturan

### 4. Menjalankan Aplikasi

```bash
# Terminal 1: Jalankan queue worker (WAJIB untuk Kirim WhatsApp)
php artisan queue:work

# Terminal 2: Jalankan development server
npm run dev
# atau
php artisan serve
```

Buka browser: http://localhost:8000

---

## 🗄️ Struktur Database

### Tabel Utama

#### 1. `users` - Akun Login
| Kolom | Tipe | Keterangan |
|-------|------|-------------|
| id | bigint | Primary key |
| name | string | Nama user |
| email | string | Email (unik) |
| password | string | Password terenkripsi |
| role | enum | 'admin' atau 'guru' |
| two_factor_confirmed_at | timestamp | Untuk 2FA |

#### 2. `gurus` - Data Guru
| Kolom | Tipe | Keterangan |
|-------|------|-------------|
| id_guru | bigint | Primary key (自增) |
| nip | string(30) | NIP Guru (unik) |
| nama_guru | string(100) | Nama Guru |
| mapel | string(50) | Mata Pelajaran |
| user_id | bigint | Foreign key ke users |
| timestamps | timestamps | created_at, updated_at |

#### 3. `siswas` - Data Siswa
| Kolom | Tipe | Keterangan |
|-------|------|-------------|
| id_siswa | bigint | Primary key (自增) |
| nis | string(20) | NIS Siswa (unik) |
| nama_siswa | string(100) | Nama Siswa |
| kelas | string(20) | Kelas siswa |
| alamat | text | Alamat siswa |
| jenis_kelamin | enum | 'laki-laki' atau 'perempuan' |
| no_hp_ortu | string(15) | No. HP Orang Tua |
| status | enum | 'aktif' atau 'tidak_aktif' |
| timestamps | timestamps | created_at, updated_at |

#### 4. `absensis` - Data Absensi
| Kolom | Tipe | Keterangan |
|-------|------|-------------|
| id_absensi | bigint | Primary key (自增) |
| id_siswa | bigint | Foreign key ke siswas |
| id_guru | bigint | Foreign key ke gurus |
| mapel | string(50) | Mata Pelajaran (nullable) |
| jam_ke | integer | Jam ke- (default 1) |
| tanggal | date | Tanggal absensi |
| status_kehadiran | enum | 'hadir', 'izin', 'sakit', 'alpha' |
| waktu_input | time | Waktu input absensi |
| timestamps | timestamps | created_at, updated_at |

**Index:** `['tanggal', 'id_guru', 'mapel']`

#### 5. `log_whatsapps` - Log Pengiriman WhatsApp
| Kolom | Tipe | Keterangan |
|-------|------|-------------|
| id_log | bigint | Primary key (自增) |
| id_absensi | bigint | Foreign key ke absensis |
| no_tujuan | string(15) | No. HP tujuan |
| pesan | text | Isi pesan WhatsApp |
| status_kirim | enum | 'berhasil', 'gagal', 'pending' |
| waktu_kirim | datetime | Waktu pengiriman (nullable) |
| timestamps | timestamps | created_at, updated_at |

### Relasi Antar Tabel

```
users (otentikasi)
    │
    ├── role: 'admin'
    └── role: 'guru'
         │
         └──► gurus (one-to-one via user_id)
              │
              └──► absensis (one-to-many)
                        │
                        └──► log_whatsapps (one-to-many)

siswas
    │
    └──► absensis (one-to-many)
```

---

## 📡 Struktur API

### API Routes (`routes/api.php`)

#### Admin User-Guru API
```
GET    /api/admin/user-guru          - List semua user guru
POST   /api/admin/user-guru          - Buat user guru baru
GET    /api/admin/user-guru/{id}     - Detail user guru
PUT    /api/admin/user-guru/{id}     - Update user guru
DELETE /api/admin/user-guru/{id}     - Hapus user guru
```

#### Admin Guru API
```
GET    /api/admin/guru               - List semua guru
POST   /api/admin/guru               - Buat guru baru
GET    /api/admin/guru/{id}          - Detail guru
PUT    /api/admin/guru/{id}          - Update guru
DELETE /api/admin/guru/{id}          - Hapus guru
```

---

## 🌐 Struktur Web Routes

### Public Routes
```
GET /                 - Halaman welcome (dengan opsi registrasi)
```

### Shared Routes (Authenticated)
```
GET /dashboard        - Redirect ke dashboard berdasarkan role
GET /whatsapp-monitoring - Monitoring WhatsApp (admin & guru)
```

### Admin Routes (Prefix: /admin)
```
GET    /admin/dashboard          - Dashboard Admin
GET    /admin/guru              - List Guru
GET    /admin/guru/create       - Form tambah Guru
POST   /admin/guru              - Simpan Guru baru
GET    /admin/guru/{id}         - Detail Guru
GET    /admin/guru/{id}/edit    - Form edit Guru
PUT    /admin/guru/{id}         - Update Guru
DELETE /admin/guru/{id}         - Hapus Guru

GET    /admin/siswa             - List Siswa
GET    /admin/siswa/create      - Form tambah Siswa
POST   /admin/siswa             - Simpan Siswa baru
GET    /admin/siswa/{id}/edit   - Form edit Siswa
PUT    /admin/siswa/{id}        - Update Siswa
DELETE /admin/siswa/{id}        - Hapus Siswa
```

### Guru Routes (Prefix: /guru)
```
GET    /guru/dashboard          - Dashboard Guru
GET    /guru/absensi            - List Absensi
GET    /guru/absensi/create    - Form buat Absensi
POST   /guru/absensi            - Simpan Absensi
GET    /guru/absensi/show/{kelas}/{tanggal} - Detail Absensi
GET    /guru/absensi/edit/{kelas}/{tanggal} - Form edit Absensi
DELETE /guru/absensi/{kelas}/{tanggal} - Hapus Absensi
```

---

## 🔔 Cara Kerja WhatsApp Notification

### Flowchart

```
1. Guru Input Absensi
         │
         ▼
2. Simpan ke tabel absensis
   (Status: hadir/izin/sakit/alpha)
         │
         ▼
3. Cek Status Kehadiran
   ├── Jika "hadir" → TIDAK dikirim WhatsApp
   │
   └── Jika "izin/sakit/alpha" →
              │
              ▼
         Simpan ke tabel log_whatsapps
              │
              ▼
         Status: "pending"
              │
              ▼
         Dispatch Job ke Queue
              │
              ▼
         Queue Worker memproses
         (php artisan queue:work)
              │
              ▼
         Kirim via API Fonnte
              │
              ▼
         Update status: berhasil / gagal
```

### Pesan WhatsApp

Pesan yang dikirimkan ke orang tua:
```
Assalamu'alaikum Wr. Wb.

Yth. Orang Tua/Wali Siswa

Dengan ini kami informasikan bahwa anak Anda:
📌 Nama: [nama_siswa]
📌 Kelas: [kelas]
📌 Tanggal: [tanggal]
📌 Status: [status_kehadiran]

Mohon perhatiannya.

Wassalamu'alaikum Wr. Wb.
```

---

## 💻 Cara Penggunaan Fitur

### Login Akun

```
Admin: admin@smp51.sch.id / password
Guru:  guru@smp51.sch.id / password
```

### 1. Setup Data Siswa

Pastikan siswa memiliki nomor HP orang tua/wali:
- Login sebagai Admin
- Buka menu Siswa
- Tambah/Edit siswa dengan mengisi kolom "No. HP Orang Tua"

### 2. Input Absensi

1. Login sebagai Guru
2. Buka menu Absensi Siswa
3. Pilih Kelas, Mata Pelajaran, Jam Ke, Tanggal
4. Daftar siswa akan muncul
5. Ubah status kehadiran:
   - **Hadir** = Tidak dikirimkan WhatsApp
   - **Izin/Sakit/Alpha** = Akan dikirimkan WhatsApp ke orang tua

6. Klik "Simpan Absensi"

### 3. Monitoring Kirim WhatsApp

Cek status pengiriman di database:

```bash
php artisan tinker
# Ketik:
App\Models\LogWhatsapp::latest()->get()
```

Atau cek melalui halaman `/whatsapp-monitoring`.

---

## 🧪 Cara Testing WhatsApp

### Test Langsung (tanpa absensi)

```bash
# Jalankan command test
php artisan test:wa-job "6282271615967" "Nama Siswa Test"

# Di terminal lain, pastikan queue worker berjalan:
php artisan queue:work
```

### Test Kirim dari Aplikasi

1. Login sebagai Guru
2. Buat absensi dengan status selain "hadir"
3. Pastikan queue worker sedang berjalan
4. Pesan WhatsApp akan otomatis terkirim

---

## ⚙️ Konfigurasi Penting

### File `.env`

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=munarah_skripsi
DB_USERNAME=root
DB_PASSWORD=

# WhatsApp (Fonnte)
TOKEN_FONNTE=your_fonnte_token_here

# Application
APP_NAME="Absensi Sekolah"
APP_URL=http://localhost:8000
```

### Queue Configuration

Pastikan queue driver sudah设置为 database di `.env`:

```env
QUEUE_CONNECTION=database
```

---

## 🔧 Troubleshooting

### WhatsApp tidak terkirim?

1. **Cek Queue Worker**
   ```bash
   php artisan queue:work
   ```
   Pastikan selalu berjalan saat mengirim absensi

2. **Cek Token Fonnte**
   - Login di fonnte.com
   - Cek apakah token masih aktif
   - Cek saldo Kuota WhatsApp

3. **Cek Log Error**
   ```bash
   php artisan queue:failed
   ```

4. **Cek Database**
   ```bash
   php artisan tinker
   App\Models\LogWhatsapp::latest()->get()
   ```
   Lihat kolom `status_kirim` - harusnya "berhasil"

### Error: "Profil Guru tidak ditemukan"

Pastikan user guru sudah memiliki data di tabel `gurus`. Hubungkan dengan cara:
```bash
php artisan tinker
// Buat relasi user dengan guru
```

---

## 📁 Struktur Folder Penting

```
app/
├── Console/
│   └── Commands/
│       └── TestWaJob.php          # Command untuk test WhatsApp
├── Http/
│   ├── Controllers/
│   │   ├── Admin/                 # Controller untuk Admin
│   │   │   ├── DashboardController.php
│   │   │   ├── GuruController.php
│   │   │   ├── SiswaController.php
│   │   │   └── WhatsappLogController.php
│   │   ├── Api/
│   │   │   └── Admin/             # API Controller
│   │   │       ├── GuruController.php
│   │   │       └── UserGuruController.php
│   │   ├── Guru/                  # Controller untuk Guru
│   │   │   ├── AbsensiController.php
│   │   │   └── DashboardController.php
│   │   └── Settings/              # Controller Settings
│   ├── Middleware/
│   │   ├── IsAdmin.php
│   │   └── IsGuru.php
│   └── Requests/
├── Jobs/
│   └── SendWaAbsensi.php          # Job untuk kirim WhatsApp
└── Models/
    ├── Absensi.php
    ├── Guru.php
    ├── LogWhatsapp.php
    ├── Siswa.php
    └── User.php

resources/
└── js/
    ├── components/                 # Komponen React
    │   └── ui/
    ├── pages/
    │   ├── admin/                 # Halaman Admin
    │   │   ├── dashboard.tsx
    │   │   ├── guru/
    │   │   └── siswa/
    │   ├── auth/                  # Halaman Auth
    │   ├── guru/                  # Halaman Guru
    │   │   ├── dashboard.tsx
    │   │   └── absensi/
    │   ├── settings/              # Halaman Settings
    │   └── whatsapp/              # Halaman Monitoring WA
    └── routes/                    # Konfigurasi Routes

routes/
├── api.php                       # API Routes
├── web.php                       # Web Routes
└── settings.php                  # Settings Routes
```

---

## 📝 Command Berguna

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Jalankan queue worker
php artisan queue:work

# Lihat failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Tinker (interaksi database)
php artisan tinker

# Migration
php artisan migrate
php artisan migrate:rollback
php artisan migrate:fresh
```

---

## 📌 Catatan Penting

1. **Queue Worker WAJIB Running** - Tanpa ini, WhatsApp tidak akan terkirim
2. **Nomor HP format** - Gunakan format: 6281234567890 (dengan 62)
3. **Jeda Pengiriman** - Ada jeda 5 detik antar pesan untuk menghindari spam
4. **Status Tidak Dikirim** - Pesan hanya dikirim jika status kehadiran bukan "hadir"
5. **Laravel Fortify** - Sistem authentication menggunakan Fortify dengan fitur 2FA
6. **Laravel Sanctum** - Untuk API token-based authentication

