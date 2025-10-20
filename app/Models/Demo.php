<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Demo extends Model
{
    use HasFactory;

    // Explicitly specify the table name
    protected $table = 'demo';

    protected $fillable = ['first_name', 'last_name'];
}