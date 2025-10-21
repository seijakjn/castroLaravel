<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSemestersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Fall 2024, Spring 2025, etc.
            $table->string('code', 10); // F24, S25, etc.
            $table->year('academic_year');
            $table->enum('term', ['fall', 'spring', 'summer', 'winter']);
            $table->date('start_date');
            $table->date('end_date');
            $table->date('registration_start')->nullable();
            $table->date('registration_end')->nullable();
            $table->date('add_drop_deadline')->nullable();
            $table->date('withdrawal_deadline')->nullable();
            $table->date('final_exams_start')->nullable();
            $table->date('final_exams_end')->nullable();
            $table->boolean('is_current')->default(false);
            $table->enum('status', ['upcoming', 'active', 'completed', 'cancelled'])->default('upcoming');
            $table->softDeletes();
            $table->timestamps();

            // Ensure unique semester codes
            $table->unique(['code', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('semesters');
    }
}
