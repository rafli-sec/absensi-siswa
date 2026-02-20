<?php

use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\SiswaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guru\AbsensiController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Dashboard - redirect berdasarkan role
Route::get('dashboard', function () {
    $user = auth()->user();
    
    if ($user->role === 'admin') {
        return redirect('/admin/dashboard');
    }
    
    return redirect('/guru/dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    });
    
});

Route::middleware(['auth', 'verified', 'guru'])->group(function () {
    Route::get('/guru/dashboard', function () {
        return Inertia::render('guru/dashboard');
    });
});




Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/guru', [GuruController::class, 'index'])->name('guru.index');
    Route::get('/guru/create', [GuruController::class, 'create'])->name('guru.create');
    Route::post('/guru', [GuruController::class, 'store'])->name('guru.store');
    Route::get('/guru/{id}/edit', [GuruController::class, 'edit'])->name('guru.edit'); 
    Route::put('/guru/{id}', [GuruController::class, 'update'])->name('guru.update');
    Route::delete('/guru/{id}', [GuruController::class, 'destroy'])->name('guru.destroy');
    Route::get('/guru/{id}', [GuruController::class, 'show'])->name('guru.show');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::get('/siswa/create', [SiswaController::class, 'create'])->name('siswa.create');
    Route::post('/siswa', [SiswaController::class, 'store'])->name('siswa.store');
    Route::get('/siswa/{id}/edit', [SiswaController::class, 'edit'])->name('siswa.edit');
    Route::put('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

});


// Gunakan alias 'guru' sesuai yang Anda daftarkan di bootstrap/app.php
Route::middleware(['auth', 'verified', 'guru'])->prefix('guru')->name('guru.')->group(function () {
    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');          // Riwayat
    Route::get('/absensi/create', [AbsensiController::class, 'create'])->name('absensi.create');   // Form Input
    Route::post('/absensi', [AbsensiController::class, 'store'])->name('absensi.store');          // Simpan
    Route::get('/absensi/edit/{kelas}/{tanggal}', [AbsensiController::class, 'edit'])->name('absensi.edit'); // Form Edit
});
require __DIR__.'/settings.php';
