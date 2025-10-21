<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 15)->unique();
            $table->text('description')->nullable();
            $table->integer('credits');
            $table->enum('semester', ['1', '2', '3', '4', '5', '6', '7', '8']);
            $table->foreignId('department_id')->constrained('department')->onDelete('cascade');
            $table->string('instructor')->nullable();
            $table->integer('max_students')->default(50);
            $table->enum('status', ['active', 'inactive'])->default('active');
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
        Schema::dropIfExists('courses');
    }
}
