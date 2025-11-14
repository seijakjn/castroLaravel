<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrollment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'course_id',
        'semester',
        'academic_year',
        'section',
        'status',
        'grade',
        'letter_grade',
        'enrollment_date',
        'completion_date',
        'notes'
    ];

    protected $dates = [
        'enrollment_date',
        'completion_date',
        'deleted_at'
    ];

    /**
     * Relationship with Student
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relationship with Course
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
