<?php

use App\Http\Controllers\Api\LocationController;
use Illuminate\Support\Facades\Route;

// Public location API endpoints - no authentication required
Route::prefix('locations')->group(function () {
    Route::get('/',                     [LocationController::class, 'index']);
    Route::get('/states',               [LocationController::class, 'statesOnly']);
    Route::get('/states/{id}/cities',   [LocationController::class, 'citiesByState']);
});
