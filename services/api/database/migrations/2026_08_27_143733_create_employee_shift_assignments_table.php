<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_shift_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->foreignId('shift_id')
                ->constrained('shifts')
                ->restrictOnDelete();

            $table->date('effective_from');
            $table->date('effective_to')->nullable();

            $table->boolean('is_current')->default(true);

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index([
                'employee_profile_id',
                'is_current',
            ]);

            $table->index([
                'shift_id',
                'effective_from',
            ]);

            $table->index(
                ['employee_profile_id', 'effective_from', 'effective_to'],
                'esa_employee_effective_dates_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_shift_assignments');
    }
};