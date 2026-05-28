<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
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
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware(['role:Admin'])->group(function () {

        Route::middleware('permission:manage lecteur')->prefix('lecteur')->group(function () {
            Route::get('/', [LecteurController::class, 'index']);
            Route::post('/store', [LecteurController::class, 'store']);
            Route::get('/edit/{id}', [LecteurController::class, 'edit']);
            Route::put('/update/{id}', [LecteurController::class, 'update']);
            Route::delete('/delete/{id}', [LecteurController::class, 'destroy']);
        });
        Route::middleware('permission:manage livre')->prefix('livre')->group(function () {
            Route::get('/', [LivreController::class, 'index']);
            Route::get('/all', [LivreController::class, 'getLivre']);
            Route::post('/store', [LivreController::class, 'store']);
            Route::get('/edit/{id}', [LivreController::class, 'edit']);
            Route::put('/update/{id}', [LivreController::class, 'update']);
            Route::delete('/delete/{id}', [LivreController::class, 'destroy']);
        });
        Route::middleware('permission:manage admin')->prefix('admin')->group(function () {
            Route::get('/', [AdminController::class, 'index']);
            Route::post('/store', [AdminController::class, 'store']);
            Route::post('/edit/{id}', [AdminController::class, 'edit']);
            Route::post('/update/{id}', [AdminController::class, 'update']);
        });
        Route::middleware('permission:manage reservation')->prefix('reservation')->group(function () {
            Route::get('/', [ReservationController::class, 'index']);
            Route::post('/store', [ReservationController::class, 'store']);
            Route::get('/edit/{id}', [ReservationController::class, 'edit']);
            Route::put('/{id}', [ReservationController::class, 'update']);
            Route::delete('/{id}', [ReservationController::class, 'destroy']);
        });
    });
    Route::middleware(['role:Lecteur|Admin'])->group(function () {
        Route::middleware('permission:manage dashboard')->get('/dashboard', [DashboardController::class, 'index']);

        Route::prefix('reservation')->group(function () {
            Route::put('/annuler/{id}', [ReservationController::class, 'annuler']);
        });
    });
    Route::middleware(['role:Lecteur'])->group(function () {
        Route::middleware('permission:manage reservationLecteur')->prefix('reservation')->group(function () {
            // route get livre lecteur 
            Route::get('/lecteur', [ReservationController::class, 'lecteur']);
        });
    });
});
