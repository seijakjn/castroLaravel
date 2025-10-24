<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->unsignedBigInteger('department_id');
            $table->enum('position', [
                'instructor',
                'assistant_professor',
                'associate_professor',
                'professor',
                'lecturer',
                'dean',
                'department_head',
                'staff'
            ]);
            $table->date('hire_date');
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('office_location')->nullable();
            $table->string('specialization')->nullable();
            $table->enum('education_level', ['bachelors', 'masters', 'phd', 'doctorate']);
            $table->enum('status', ['active', 'inactive', 'on_leave', 'retired', 'terminated'])->default('active');
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('department');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faculty');
    }
}
