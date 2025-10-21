<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnrollmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('semester');
            $table->year('academic_year');
            $table->string('section')->nullable();
            $table->enum('status', ['enrolled', 'dropped', 'completed', 'failed'])->default('enrolled');
            $table->decimal('grade', 3, 2)->nullable(); // 0.00 to 4.00 GPA
            $table->string('letter_grade', 2)->nullable(); // A+, A, B+, etc.
            $table->date('enrollment_date');
            $table->date('completion_date')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Prevent duplicate enrollments
            $table->unique(['student_id', 'course_id', 'semester', 'academic_year'], 'unique_enrollment');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
}
