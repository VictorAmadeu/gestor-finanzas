<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\GastoController;

Route::get('/ingresos', [IngresoController::class, 'index']);
Route::post('/ingresos', [IngresoController::class, 'store']);
Route::put('/ingresos/{id}', [IngresoController::class, 'update']);
Route::delete('/ingresos/{id}', [IngresoController::class, 'destroy']);

Route::get('/gastos', [GastoController::class, 'index']);
Route::post('/gastos', [GastoController::class, 'store']);
Route::put('/gastos/{id}', [GastoController::class, 'update']);
Route::delete('/gastos/{id}', [GastoController::class, 'destroy']);