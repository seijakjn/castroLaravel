<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';

    protected $fillable = [
        'employee_id',
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
        'position',
        'hire_date',
        'salary',
        'office_location',
        'specialization',
        'education_level',
        'status',
        'archived_at'
    ];

    protected $dates = [
        'date_of_birth',
        'hire_date',
        'archived_at',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'archived_at' => 'datetime',
        'salary' => 'decimal:2'
    ];

    // Relationship with Department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Scope for active faculty
    public function scopeActive($query)
    {
        return $query->whereNull('archived_at');
    }

    // Scope for archived faculty
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at');
    }
}
