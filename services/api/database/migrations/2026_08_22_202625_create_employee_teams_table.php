<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_teams', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120)->unique();
            $table->string('code', 50)->unique();
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->index(['status', 'name']);
        });

        Schema::create('employee_team_user', function (Blueprint $table) {
            $table->foreignId('employee_team_id')
                ->constrained('employee_teams')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->primary(['employee_team_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_team_user');
        Schema::dropIfExists('employee_teams');
    }
};