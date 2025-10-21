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
        'instructor',
        'max_students',
        'status'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
