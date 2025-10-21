<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstructorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id', 20)->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->foreignId('department_id')->constrained('department')->onDelete('cascade');
            $table->date('hire_date');
            $table->string('title')->nullable(); // Professor, Associate Professor, etc.
            $table->string('specialization')->nullable();
            $table->enum('status', ['active', 'inactive', 'retired'])->default('active');
            $table->text('bio')->nullable();
            $table->string('office_location')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('instructors');
    }
}
