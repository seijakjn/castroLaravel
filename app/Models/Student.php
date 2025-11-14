<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'department_id',
        'year_level',
        'gpa',
        'enrollment_date',
        'status'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'enrollment_date' => 'date',
        'gpa' => 'decimal:2'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Enrollment relationships
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function activeCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->wherePivot('status', 'enrolled')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function completedCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->wherePivot('status', 'completed')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function droppedCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->wherePivot('status', 'dropped')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }
}
