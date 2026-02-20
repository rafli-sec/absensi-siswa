<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Guru\DashboardController as GuruDashboard;
use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\WhatsappLogController;
use App\Http\Controllers\Guru\AbsensiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Shared Routes (Admin & Guru)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Redirect dashboard utama ke rute spesifik role
    Route::get('dashboard', function () {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('guru.dashboard');
    })->name('dashboard');

    // Monitoring WhatsApp (Bisa diakses keduanya dengan filter di Controller)
    // Filter: Admin lihat semua, Guru lihat miliknya saja
    Route::get('/whatsapp-monitoring', [WhatsappLogController::class, 'index'])->name('whatsapp.index');
});

/*
|--------------------------------------------------------------------------
| Admin Only Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // --- DASHBOARD ---
    Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

    // --- MANAJEMEN GURU ---
    Route::get('/guru', [GuruController::class, 'index'])->name('guru.index');
    Route::get('/guru/create', [GuruController::class, 'create'])->name('guru.create');
    Route::post('/guru', [GuruController::class, 'store'])->name('guru.store');
    Route::get('/guru/{id}', [GuruController::class, 'show'])->name('guru.show');
    Route::get('/guru/{id}/edit', [GuruController::class, 'edit'])->name('guru.edit');
    Route::put('/guru/{id}', [GuruController::class, 'update'])->name('guru.update');
    Route::delete('/guru/{id}', [GuruController::class, 'destroy'])->name('guru.destroy');

    // --- MANAJEMEN SISWA ---
    Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::get('/siswa/create', [SiswaController::class, 'create'])->name('siswa.create');
    Route::post('/siswa', [SiswaController::class, 'store'])->name('siswa.store');
    Route::get('/siswa/{id}/edit', [SiswaController::class, 'edit'])->name('siswa.edit');
    Route::put('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

});

/*
|--------------------------------------------------------------------------
| Guru Only Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'guru'])->prefix('guru')->name('guru.')->group(function () {
    Route::get('/dashboard', [GuruDashboard::class, 'index'])->name('dashboard');
    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');          
    Route::get('/absensi/create', [AbsensiController::class, 'create'])->name('absensi.create');   
    Route::post('/absensi', [AbsensiController::class, 'store'])->name('absensi.store');         
    Route::get('/absensi/show/{kelas}/{tanggal}', [AbsensiController::class, 'show'])->name('absensi.show'); 
    Route::delete('/absensi/{kelas}/{tanggal}', [AbsensiController::class, 'destroy'])->name('absensi.destroy');
    Route::get('/absensi/edit/{kelas}/{tanggal}', [AbsensiController::class, 'edit'])->name('absensi.edit'); 
});

require __DIR__.'/settings.php';