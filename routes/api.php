<?php

use App\Http\Controllers\Admin\GuruController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\UserGuruController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('admin')->group(function () {
    Route::get('/user-guru', [UserGuruController::class, 'index']);
    Route::post('/user-guru', [UserGuruController::class, 'store']);
    Route::get('/user-guru/{id}', [UserGuruController::class, 'show']);
    Route::put('/user-guru/{id}', [UserGuruController::class, 'update']);
    Route::delete('/user-guru/{id}', [UserGuruController::class, 'destroy']);
});

Route::prefix('admin')->group(function () {
    Route::get('/guru', [GuruController::class, 'index']);
    Route::post('/guru', [GuruController::class, 'store']);
    Route::get('/guru/{id}', [GuruController::class, 'show']);
    Route::put('/guru/{id}', [GuruController::class, 'update']);
    Route::delete('/guru/{id}', [GuruController::class, 'destroy']);
});
