<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentProgramTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_program', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->date('enrollment_date');
            $table->date('expected_graduation_date')->nullable();
            $table->date('actual_graduation_date')->nullable();
            $table->enum('status', ['active', 'completed', 'dropped', 'transferred'])->default('active');
            $table->decimal('cumulative_gpa', 3, 2)->nullable();
            $table->integer('credits_completed')->default(0);
            $table->boolean('is_primary_program')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Prevent duplicate active enrollments in the same program
            $table->unique(['student_id', 'program_id'], 'unique_student_program');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_program');
    }
}
