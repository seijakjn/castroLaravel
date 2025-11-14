<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataController;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/save-data', [DataController::class, 'store']);
Route::put('/update-data/{id}', [DataController::class, 'update']);
Route::delete('/delete-data/{id}', [DataController::class, 'destroy']);
Route::get('/fetch-data', [DataController::class, 'index']);
Route::put('/archive-data/{id}', [DataController::class, 'archive']);

// Profile Management System Routes
use App\Http\Controllers\ProfileManagementController;

// Students
Route::get('/students', [ProfileManagementController::class, 'getStudents']);
Route::get('/students/archived', [ProfileManagementController::class, 'getArchivedStudents']);
Route::post('/students', [ProfileManagementController::class, 'storeStudent']);
Route::put('/students/{id}', [ProfileManagementController::class, 'updateStudent']);
Route::put('/students/{id}/archive', [ProfileManagementController::class, 'archiveStudent']);

// Departments
Route::get('/departments', [ProfileManagementController::class, 'getDepartments']);
Route::get('/departments/archived', [ProfileManagementController::class, 'getArchivedDepartments']);
Route::post('/departments', [ProfileManagementController::class, 'storeDepartment']);
Route::put('/departments/{id}', [ProfileManagementController::class, 'updateDepartment']);
Route::put('/departments/{id}/archive', [ProfileManagementController::class, 'archiveDepartment']);

// Courses
Route::get('/courses', [ProfileManagementController::class, 'getCourses']);
Route::get('/courses/archived', [ProfileManagementController::class, 'getArchivedCourses']);
Route::post('/courses', [ProfileManagementController::class, 'storeCourse']);
Route::put('/courses/{id}', [ProfileManagementController::class, 'updateCourse']);
Route::put('/courses/{id}/archive', [ProfileManagementController::class, 'archiveCourse']);

// Faculty
Route::get('/faculty', [ProfileManagementController::class, 'getFaculty']);
Route::get('/faculty/archived', [ProfileManagementController::class, 'getArchivedFaculty']);
Route::get('/faculty/department-head-candidates', [ProfileManagementController::class, 'getDepartmentHeadCandidates']);
Route::post('/faculty', [ProfileManagementController::class, 'storeFaculty']);
Route::put('/faculty/{id}', [ProfileManagementController::class, 'updateFaculty']);
Route::put('/faculty/{id}/archive', [ProfileManagementController::class, 'archiveFaculty']);

// Student Profile Management
Route::get('/student-profile/{studentId}', [ProfileManagementController::class, 'getStudentProfile']);
Route::put('/student-profile/{studentId}', [ProfileManagementController::class, 'updateStudentProfile']);

// Instructors (Legacy)
Route::get('/instructors', [ProfileManagementController::class, 'getInstructors']);

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Course Enrollment Routes
Route::get('/students/{studentId}/enrollments', [ProfileManagementController::class, 'getStudentEnrollments']);
Route::post('/enrollments', [ProfileManagementController::class, 'enrollStudent']);
Route::put('/enrollments/{enrollmentId}/unenroll', [ProfileManagementController::class, 'unenrollStudent']);
Route::get('/courses/available', [ProfileManagementController::class, 'getAvailableCourses']);

// Test endpoint for student-course relationships
Route::get('/students/{studentId}/relationships', [ProfileManagementController::class, 'testStudentCourseRelationships']);