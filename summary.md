# Rangkuman Project Absensi Sekolah + WhatsApp Notification

## Cara Install & Menjalankan Project

### 1. Clone & Install Dependencies

```
bash
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

```
bash
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

```
env
TOKEN_FONNTE=your_fonnte_token_here
```

**Cara mendapatkan token Fonnte:**
1. Daftar di https://fonnte.com
2. Login dan masuk ke dashboard
3. Ambil API Token dari pengaturan

### 4. Menjalankan Aplikasi

```
bash
# Terminal 1: Jalankan queue worker (WAJIB untuk Kirim WhatsApp)
php artisan queue:work

# Terminal 2: Jalankan development server
npm run dev
# atau
php artisan serve
```

Buka browser: http://localhost:8000

---

## Cara Penggunaan Fitur WhatsApp Notification

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

### 3. Cara Kerja WhatsApp Notification

```
Absensi Disimpan (Status: izin/sakit/alpha)
           ↓
Simpan ke tabel log_whatsapps (status: pending)
           ↓
Dispatch Job ke Queue
           ↓
Queue Worker memproses (php artisan queue:work)
           ↓
Kirim via API Fonnte
           ↓
Update status: berhasil / gagal
```

### 4. Monitoring Kirim WhatsApp

Cek status pengiriman di database:

```
bash
php artisan tinker
# Ketik:
App\Models\LogWhatsapp::latest()->get()
```

Atau cek melalui halaman admin (jika sudah di-setup).

---

## Cara Testing WhatsApp

### Test Langsung (tanpa absensi)

```
bash
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

## Troubleshooting

### WhatsApp tidak terkirim?

1. **Cek Queue Worker**
   
```
bash
   php artisan queue:work
   
```
   Pastikan selalu berjalan saat mengirim absensi

2. **Cek Token Fonnte**
   - Login di fonnte.com
   - Cek apakah token masih aktif
   - Cek saldo Kuota WhatsApp

3. **Cek Log Error**
   
```
bash
   php artisan queue:failed
   
```

4. **Cek Database**
   
```
bash
   php artisan tinker
   App\Models\LogWhatsapp::latest()->get()
   
```
   Lihat kolom `status_kirim` - harusnya "berhasil"

### Error: "Profil Guru tidak ditemukan"

Pastikan user guru sudah memiliki data di tabel `gurus`. Hubungkan dengan cara:
```
bash
php artisan tinker
// Buat relasi user dengan guru
```

---

## Struktur Database

### Tabel Penting

1. **users** - Akun login (role: admin/guru)
2. **gurus** - Data guru
3. **siswas** - Data siswa (termasuk no_hp_ortu)
4. **absensis** - Data absensi siswa
5. **log_whatsapps** - Log pengiriman WhatsApp

### Relasi

```
users (otentikasi)
    │
    └── role: 'admin' | 'guru'

gurus ──────► absensis ◄────── siswas
                │
                └──► log_whatsapps
```

---

## Catatan Penting

1. **Queue Worker WAJIB Running** - Tanpa ini, WhatsApp tidak akan terkirim
2. **Nomor HP format** - Gunakan format: 6281234567890 (dengan 62)
3. **Jeda Pengiriman** - Ada jeda 5 detik antar pesan untuk menghindari spam
4. **Status Tidak Dikirim** - Pesan hanya dikirim jika status kehadiran bukan "hadir"

---

## Command Berguna

```
bash
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
