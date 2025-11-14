<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateStudentsTableChangeSemesterToYearLevel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Check if year_level column already exists
        if (!Schema::hasColumn('students', 'year_level')) {
            Schema::table('students', function (Blueprint $table) {
                // Rename current_semester to year_level
                $table->renameColumn('current_semester', 'year_level');
            });
        }

        // Update any existing semester values > 4 to year level 4
        DB::statement('UPDATE students SET year_level = 4 WHERE year_level > 4');
        DB::statement('UPDATE students SET year_level = 1 WHERE year_level < 1');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            // Rename year_level back to current_semester
            $table->renameColumn('year_level', 'current_semester');
        });

        // No need to restore constraints in rollback
    }
}
