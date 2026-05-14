<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LecteurController;
use App\Http\Controllers\LivreController;
use App\Http\Controllers\ReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('lecteur')->group(function () {
    Route::get('/', [LecteurController::class, 'index']);
    Route::post('/store', [LecteurController::class, 'store']);
    Route::get('/edit/{id}', [LecteurController::class, 'edit']);
    Route::put('/update/{id}', [LecteurController::class, 'update']);
    Route::delete('/delete/{id}', [LecteurController::class, 'destroy']);
});
Route::prefix('livre')->group(function () {
    Route::get('/', [LivreController::class, 'index']);
    Route::get('/all', [LivreController::class, 'getLivre']);
    Route::post('/store', [LivreController::class, 'store']);
    Route::get('/edit/{id}', [LivreController::class, 'edit']);
    Route::put('/update/{id}', [LivreController::class, 'update']);
    Route::delete('/delete/{id}', [LivreController::class, 'destroy']);
});
Route::prefix('reservation')->group(function () {
    Route::get('/', [ReservationController::class, 'index']);
    Route::post('/store', [ReservationController::class, 'store']);
    Route::get('/edit/{id}', [ReservationController::class, 'edit']);
    Route::put('/{id}', [ReservationController::class, 'update']);
    Route::delete('/{id}', [ReservationController::class, 'destroy']);
    Route::put('/annuler/{id}', [ReservationController::class, 'annuler']);
});
 Route::get('/dashboard',[DashboardController::class,'index']);