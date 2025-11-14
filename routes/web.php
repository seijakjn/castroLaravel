<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ProfileManagementController;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', function () {
    return view('home');
});

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/employee-home', function () {
    return view('employee-home');
});

Route::get('/student-profile', function () {
    return view('student-profile');
});

Route::get('/course-enrollment', function () {
    return view('course-enrollment');
});

// Legacy routes (keeping for backward compatibility)
Route::post('/api/save-data', [DataController::class, 'store']);
Route::get('/fetch-data', [DataController::class, 'fetchData']);
Route::get('/fetch-archived-data', [DataController::class, 'fetchArchivedData']);
Route::put('/api/update-data/{id}', [DataController::class, 'update']);

// Note: Profile Management API routes have been moved to routes/api.php