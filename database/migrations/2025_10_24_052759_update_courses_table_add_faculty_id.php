<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCoursesTableAddFacultyId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Add faculty_id as a foreign key to faculty table
            $table->unsignedBigInteger('faculty_id')->nullable()->after('department_id');
            $table->foreign('faculty_id')->references('id')->on('faculty')->onDelete('set null');

            // Keep the instructor column for now to preserve existing data
            // We'll remove it in a future migration after data migration if needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Drop the foreign key constraint and column
            $table->dropForeign(['faculty_id']);
            $table->dropColumn('faculty_id');
        });
    }
}
