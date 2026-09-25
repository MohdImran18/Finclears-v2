<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salary_structures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            // Salary structure identification
            $table->string('structure_name', 150);
            $table->string('salary_type', 30)->default('monthly');
            $table->string('pay_frequency', 30)->default('monthly');
            $table->string('currency', 10)->default('INR');

            // Salary period
            $table->date('effective_from');
            $table->date('effective_to')->nullable();

            // Main salary figures
            $table->decimal('basic_salary', 15, 2)->default(0);
            $table->decimal('gross_salary', 15, 2)->default(0);
            $table->decimal('monthly_ctc', 15, 2)->default(0);
            $table->decimal('annual_ctc', 15, 2)->default(0);

            // Variable salary limits
            $table->decimal('monthly_variable_target', 15, 2)->nullable();
            $table->decimal('annual_variable_target', 15, 2)->nullable();

            // Approval / lifecycle
            $table->string('status', 30)->default('draft');
            $table->boolean('is_current')->default(false);

            // Optional notes
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(
                ['employee_profile_id', 'status'],
                'emp_salary_status_idx'
            );

            $table->index(
                ['employee_profile_id', 'effective_from'],
                'emp_salary_effective_idx'
            );

            $table->index(
                ['employee_profile_id', 'is_current'],
                'emp_salary_current_idx'
            );

            $table->index('effective_from');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salary_structures');
    }
};
