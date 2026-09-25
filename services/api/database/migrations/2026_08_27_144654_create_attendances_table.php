<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->foreignId('shift_id')
                ->nullable()
                ->constrained('shifts')
                ->nullOnDelete();

            $table->date('attendance_date');

            $table->dateTime('check_in_at')->nullable();
            $table->dateTime('check_out_at')->nullable();

            $table->unsignedInteger('working_minutes')->default(0);
            $table->unsignedInteger('late_minutes')->default(0);
            $table->unsignedInteger('early_departure_minutes')->default(0);
            $table->unsignedInteger('overtime_minutes')->default(0);

            $table->enum('status', [
                'present',
                'absent',
                'half_day',
                'leave',
                'holiday',
                'week_off',
            ])->default('present');

            $table->string('check_in_source', 50)
                ->nullable();

            $table->string('check_out_source', 50)
                ->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->unique([
                'employee_profile_id',
                'attendance_date',
            ], 'attendance_employee_date_unique');

            $table->index([
                'employee_profile_id',
                'attendance_date',
            ]);

            $table->index([
                'attendance_date',
                'status',
            ]);

            $table->index([
                'shift_id',
                'attendance_date',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};