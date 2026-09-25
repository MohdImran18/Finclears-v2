<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100);
            $table->string('code', 50)->unique();

            $table->time('start_time');
            $table->time('end_time');

            $table->unsignedInteger('break_duration_minutes')->default(0);
            $table->unsignedInteger('grace_period_minutes')->default(0);

            $table->decimal('minimum_working_hours', 5, 2)->default(0);

            $table->boolean('overtime_eligible')->default(false);

            $table->decimal('overtime_after_hours', 5, 2)->nullable();

            $table->boolean('cross_midnight')->default(false);

            $table->boolean('is_active')->default(true);

            $table->text('description')->nullable();

            $table->timestamps();

            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};