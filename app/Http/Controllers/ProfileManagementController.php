<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Department;
use App\Models\Course;

class ProfileManagementController extends Controller
{
    // Student Management Methods
    public function getStudents()
    {
        $students = Student::with('department')->get();
        return response()->json($students);
    }

    public function getArchivedStudents()
    {
        $students = Student::onlyTrashed()->with('department')->get();
        $students->each(function ($student) {
            $student->archived_at = $student->deleted_at;
        });
        return response()->json($students);
    }

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|max:20|unique:students',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:department,id',
            'current_semester' => 'required|integer|min:1|max:8',
            'gpa' => 'nullable|numeric|min:0|max:4',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,inactive,graduated,suspended'
        ]);

        Student::create($validated);
        return response()->json(['message' => 'Student profile created successfully!'], 200);
    }

    public function updateStudent(Request $request, $id)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|max:20|unique:students,student_id,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:department,id',
            'current_semester' => 'required|integer|min:1|max:8',
            'gpa' => 'nullable|numeric|min:0|max:4',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,inactive,graduated,suspended'
        ]);

        $student = Student::findOrFail($id);
        $student->update($validated);
        return response()->json(['message' => 'Student profile updated successfully!'], 200);
    }

    public function archiveStudent($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message' => 'Student profile archived successfully']);
    }

    // Department Management Methods
    public function getDepartments()
    {
        $departments = Department::withCount(['students', 'courses'])->get();
        return response()->json($departments);
    }

    public function getArchivedDepartments()
    {
        $departments = Department::onlyTrashed()->withCount(['students', 'courses'])->get();
        $departments->each(function ($department) {
            $department->archived_at = $department->deleted_at;
        });
        return response()->json($departments);
    }

    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:department',
            'description' => 'nullable|string',
            'head_of_department' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20'
        ]);

        Department::create($validated);
        return response()->json(['message' => 'Department created successfully!'], 200);
    }

    public function updateDepartment(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:department,code,' . $id,
            'description' => 'nullable|string',
            'head_of_department' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20'
        ]);

        $department = Department::findOrFail($id);
        $department->update($validated);
        return response()->json(['message' => 'Department updated successfully!'], 200);
    }

    public function archiveDepartment($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(['message' => 'Department archived successfully']);
    }

    // Course Management Methods
    public function getCourses()
    {
        $courses = Course::with('department')->get();
        return response()->json($courses);
    }

    public function getArchivedCourses()
    {
        $courses = Course::onlyTrashed()->with('department')->get();
        $courses->each(function ($course) {
            $course->archived_at = $course->deleted_at;
        });
        return response()->json($courses);
    }

    public function storeCourse(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:15|unique:courses',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:6',
            'semester' => 'required|in:1,2,3,4,5,6,7,8',
            'department_id' => 'required|exists:department,id',
            'instructor' => 'nullable|string|max:255',
            'max_students' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive'
        ]);

        Course::create($validated);
        return response()->json(['message' => 'Course created successfully!'], 200);
    }

    public function updateCourse(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:15|unique:courses,code,' . $id,
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:6',
            'semester' => 'required|in:1,2,3,4,5,6,7,8',
            'department_id' => 'required|exists:department,id',
            'instructor' => 'nullable|string|max:255',
            'max_students' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive'
        ]);

        $course = Course::findOrFail($id);
        $course->update($validated);
        return response()->json(['message' => 'Course updated successfully!'], 200);
    }

    public function archiveCourse($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course archived successfully']);
    }

    // Instructor Management Methods
    public function getInstructors()
    {
        // For now, return empty array since we haven't created instructor model yet
        return response()->json([]);
    }
}
