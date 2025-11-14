<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'credits',
        'year_level',
        'department_id',
        'faculty_id',
        'instructor', // Keep for backward compatibility during transition
        'max_students',
        'status'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    // Helper method to get instructor name (prioritizes faculty relationship)
    public function getInstructorNameAttribute()
    {
        if ($this->faculty) {
            return $this->faculty->first_name . ' ' . $this->faculty->last_name;
        }
        return $this->instructor ?: 'TBA';
    }

    // Enrollment relationships
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function activeStudents()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->wherePivot('status', 'enrolled')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function completedStudents()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->wherePivot('status', 'completed')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    public function droppedStudents()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->wherePivot('status', 'dropped')
                    ->withPivot('semester', 'academic_year', 'status', 'grade', 'letter_grade', 'enrollment_date', 'completion_date', 'section', 'notes')
                    ->withTimestamps();
    }

    // Computed attributes
    public function getEnrolledCountAttribute()
    {
        return $this->enrollments()->where('status', 'enrolled')->count();
    }

    public function getAvailableSpacesAttribute()
    {
        return $this->max_students - $this->enrolled_count;
    }

    public function getIsFullAttribute()
    {
        return $this->enrolled_count >= $this->max_students;
    }
}
