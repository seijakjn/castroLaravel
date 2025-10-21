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

// Legacy routes (keeping for backward compatibility)
Route::post('/api/save-data', [DataController::class, 'store']);
Route::get('/fetch-data', [DataController::class, 'fetchData']);
Route::get('/fetch-archived-data', [DataController::class, 'fetchArchivedData']);
Route::put('/api/update-data/{id}', [DataController::class, 'update']);

// Profile Management System Routes
// Students
Route::get('/api/students', [ProfileManagementController::class, 'getStudents']);
Route::get('/api/students/archived', [ProfileManagementController::class, 'getArchivedStudents']);
Route::post('/api/students', [ProfileManagementController::class, 'storeStudent']);
Route::put('/api/students/{id}', [ProfileManagementController::class, 'updateStudent']);
Route::put('/api/students/{id}/archive', [ProfileManagementController::class, 'archiveStudent']);

// Departments
Route::get('/api/departments', [ProfileManagementController::class, 'getDepartments']);
Route::get('/api/departments/archived', [ProfileManagementController::class, 'getArchivedDepartments']);
Route::post('/api/departments', [ProfileManagementController::class, 'storeDepartment']);
Route::put('/api/departments/{id}', [ProfileManagementController::class, 'updateDepartment']);
Route::put('/api/departments/{id}/archive', [ProfileManagementController::class, 'archiveDepartment']);

// Courses
Route::get('/api/courses', [ProfileManagementController::class, 'getCourses']);
Route::get('/api/courses/archived', [ProfileManagementController::class, 'getArchivedCourses']);
Route::post('/api/courses', [ProfileManagementController::class, 'storeCourse']);
Route::put('/api/courses/{id}', [ProfileManagementController::class, 'updateCourse']);
Route::put('/api/courses/{id}/archive', [ProfileManagementController::class, 'archiveCourse']);

// Instructors
Route::get('/api/instructors', [ProfileManagementController::class, 'getInstructors']);