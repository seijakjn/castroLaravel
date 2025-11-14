<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Department;
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Enrollment;

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
            'year_level' => 'required|integer|min:1|max:4',
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
            'year_level' => 'required|integer|min:1|max:4',
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
        $courses = Course::with(['department', 'faculty'])->get();
        return response()->json($courses);
    }

    public function getArchivedCourses()
    {
        $courses = Course::onlyTrashed()->with(['department', 'faculty'])->get();
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
            'year_level' => 'required|in:1,2,3,4',
            'department_id' => 'required|exists:department,id',
            'faculty_id' => 'nullable|exists:faculty,id',
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
            'year_level' => 'required|in:1,2,3,4',
            'department_id' => 'required|exists:department,id',
            'faculty_id' => 'nullable|exists:faculty,id',
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

    // Faculty Management Methods
    public function getFaculty()
    {
        $faculty = Faculty::active()->with('department')->get();
        return response()->json($faculty);
    }

    public function getArchivedFaculty()
    {
        $faculty = Faculty::archived()->with('department')->get();
        return response()->json($faculty);
    }

    public function storeFaculty(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|max:20|unique:faculty',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:faculty',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:department,id',
            'position' => 'required|in:instructor,assistant_professor,associate_professor,professor,lecturer,dean,department_head,staff',
            'hire_date' => 'required|date',
            'salary' => 'nullable|numeric|min:0',
            'office_location' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'education_level' => 'required|in:bachelors,masters,phd,doctorate',
            'status' => 'required|in:active,inactive,on_leave,retired,terminated'
        ]);

        Faculty::create($validated);
        return response()->json(['message' => 'Faculty profile created successfully!'], 200);
    }

    public function updateFaculty(Request $request, $id)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|max:20|unique:faculty,employee_id,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:faculty,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:department,id',
            'position' => 'required|in:instructor,assistant_professor,associate_professor,professor,lecturer,dean,department_head,staff',
            'hire_date' => 'required|date',
            'salary' => 'nullable|numeric|min:0',
            'office_location' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'education_level' => 'required|in:bachelors,masters,phd,doctorate',
            'status' => 'required|in:active,inactive,on_leave,retired,terminated'
        ]);

        $faculty = Faculty::findOrFail($id);
        $faculty->update($validated);
        return response()->json(['message' => 'Faculty profile updated successfully!'], 200);
    }

    public function archiveFaculty($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->archived_at = now();
        $faculty->save();
        return response()->json(['message' => 'Faculty profile archived successfully']);
    }

    // Student Profile Management Methods (for individual student use)
    public function getStudentProfile($studentId)
    {
        try {
            $student = Student::with('department')->where('student_id', $studentId)->first();

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            return response()->json($student);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch student profile'], 500);
        }
    }

    public function updateStudentProfile(Request $request, $studentId)
    {
        try {
            $student = Student::where('student_id', $studentId)->first();

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:students,email,' . $student->id,
                'phone' => 'nullable|string|max:20',
                'date_of_birth' => 'nullable|date',
                'address' => 'nullable|string',
                'department_id' => 'nullable|exists:department,id',
                'year_level' => 'nullable|integer|min:1|max:4',
                'gpa' => 'nullable|numeric|min:0|max:4'
            ]);

            $student->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully!',
                'student' => $student->fresh('department')
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    // Instructor Management Methods (Legacy)
    public function getInstructors()
    {
        // For now, return empty array since we haven't created instructor model yet
        return response()->json([]);
    }

    // Get faculty members eligible to be department heads
    public function getDepartmentHeadCandidates()
    {
        // Get faculty members who are specifically designated as department heads
        $candidates = Faculty::where('position', 'department_head')
            ->where('status', 'active')
            ->select('id', 'first_name', 'last_name', 'position', 'department_id')
            ->with('department:id,name')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        // Format the response to include full name
        $candidates->each(function ($candidate) {
            $candidate->full_name = $candidate->first_name . ' ' . $candidate->last_name;
            $candidate->display_name = $candidate->full_name;
        });

        return response()->json($candidates);
    }

    // Course Enrollment Methods
    public function getStudentEnrollments($studentId)
    {
        $enrollments = Enrollment::with(['course', 'course.department'])
            ->where('student_id', $studentId)
            ->where('status', 'enrolled')
            ->get();

        return response()->json($enrollments);
    }

    public function enrollStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'semester' => 'required|string',
            'academic_year' => 'required|integer',
            'section' => 'nullable|string'
        ]);

        // Check if student is already enrolled in this course for this semester/year
        $existingEnrollment = Enrollment::where('student_id', $validated['student_id'])
            ->where('course_id', $validated['course_id'])
            ->where('semester', $validated['semester'])
            ->where('academic_year', $validated['academic_year'])
            ->first();

        if ($existingEnrollment) {
            return response()->json(['message' => 'Student is already enrolled in this course for this semester'], 409);
        }

        $enrollment = Enrollment::create([
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'semester' => $validated['semester'],
            'academic_year' => $validated['academic_year'],
            'section' => $validated['section'] ?? null,
            'status' => 'enrolled',
            'enrollment_date' => now(),
        ]);

        $enrollment->load(['course', 'course.department']);

        return response()->json([
            'message' => 'Successfully enrolled in course!',
            'enrollment' => $enrollment
        ], 201);
    }

    public function unenrollStudent(Request $request, $enrollmentId)
    {
        $enrollment = Enrollment::findOrFail($enrollmentId);

        // Verify the student owns this enrollment (if needed)
        if ($request->has('student_id') && $enrollment->student_id != $request->student_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrollment->update(['status' => 'dropped']);

        return response()->json(['message' => 'Successfully unenrolled from course!'], 200);
    }

    public function getAvailableCourses(Request $request)
    {
        $departmentId = $request->get('department_id');
        $yearLevel = $request->get('year_level');
        $studentId = $request->get('student_id');

        $query = Course::with(['department', 'faculty'])
            ->where('status', 'active');

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        if ($yearLevel) {
            $query->where('year_level', $yearLevel);
        }

        $courses = $query->get();

        // If student_id is provided, mark which courses they're already enrolled in
        if ($studentId) {
            $enrolledCourseIds = Enrollment::where('student_id', $studentId)
                ->where('status', 'enrolled')
                ->pluck('course_id')
                ->toArray();

            $courses->each(function ($course) use ($enrolledCourseIds) {
                $course->is_enrolled = in_array($course->id, $enrolledCourseIds);
            });
        }

        return response()->json($courses);
    }

    // Test endpoint to demonstrate new relationships
    public function testStudentCourseRelationships($studentId)
    {
        $student = Student::with(['enrollments.course', 'activeCourses', 'completedCourses', 'droppedCourses'])
                          ->findOrFail($studentId);

        $data = [
            'student' => [
                'id' => $student->id,
                'name' => $student->full_name,
                'student_id' => $student->student_id,
                'department' => $student->department->name ?? 'N/A'
            ],
            'enrollment_summary' => [
                'total_enrollments' => $student->enrollments->count(),
                'active_courses' => $student->activeCourses->count(),
                'completed_courses' => $student->completedCourses->count(),
                'dropped_courses' => $student->droppedCourses->count()
            ],
            'active_courses' => $student->activeCourses->map(function ($course) {
                return [
                    'course_id' => $course->id,
                    'course_name' => $course->name,
                    'course_code' => $course->code,
                    'credits' => $course->credits,
                    'semester' => $course->pivot->semester,
                    'academic_year' => $course->pivot->academic_year,
                    'section' => $course->pivot->section,
                    'enrollment_date' => $course->pivot->enrollment_date,
                    'instructor' => $course->instructor_name
                ];
            }),
            'course_details' => $student->activeCourses->map(function ($course) {
                return [
                    'course' => $course->name,
                    'enrolled_count' => $course->enrolled_count,
                    'available_spaces' => $course->available_spaces,
                    'is_full' => $course->is_full
                ];
            })
        ];

        return response()->json($data);
    }
}
