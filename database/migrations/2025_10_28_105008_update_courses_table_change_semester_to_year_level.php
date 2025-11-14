<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateCoursesTableChangeSemesterToYearLevel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Drop the existing enum constraint
            $table->dropColumn('semester');

            // Add the new year_level column with enum constraint for 1-4
            $table->enum('year_level', ['1', '2', '3', '4'])->after('credits');
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
            // Drop the year_level column
            $table->dropColumn('year_level');

            // Restore the original semester column
            $table->enum('semester', ['1', '2', '3', '4', '5', '6', '7', '8'])->after('credits');
        });
    }
}
