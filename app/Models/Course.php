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
        'semester',
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
}
