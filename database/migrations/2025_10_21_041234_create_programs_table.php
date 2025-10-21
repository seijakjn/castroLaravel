<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 10)->unique();
            $table->foreignId('department_id')->constrained('department')->onDelete('cascade');
            $table->enum('degree_type', ['certificate', 'diploma', 'bachelor', 'master', 'doctorate']);
            $table->integer('duration_years');
            $table->integer('credits_required');
            $table->text('description')->nullable();
            $table->text('admission_requirements')->nullable();
            $table->decimal('tuition_per_semester', 10, 2)->nullable();
            $table->enum('status', ['active', 'inactive', 'discontinued'])->default('active');
            $table->date('established_date')->nullable();
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
        Schema::dropIfExists('programs');
    }
}
