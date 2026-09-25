<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_run_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payroll_run_id')
                ->constrained('payroll_runs')
                ->cascadeOnDelete();

            $table->foreignId('salary_component_id')
                ->nullable()
                ->constrained('salary_components')
                ->nullOnDelete();

            // Snapshot of component at payroll calculation time
            $table->string('component_name', 150);
            $table->string('component_code', 80)->nullable();

            // earning / deduction / reimbursement
            $table->string('type', 30);

            // fixed / percentage / formula / rule_based
            $table->string('calculation_type', 40)->nullable();

            $table->string('calculation_basis', 50)->nullable();

            // Original configured values
            $table->decimal('configured_amount', 15, 2)->nullable();
            $table->decimal('configured_percentage', 8, 4)->nullable();

            // Actual calculated amount for this payroll
            $table->decimal('calculated_amount', 15, 2)->default(0);

            // Useful for performance / attendance / target deductions
            $table->decimal('target_value', 15, 2)->nullable();
            $table->decimal('achievement_value', 15, 2)->nullable();
            $table->decimal('achievement_percentage', 8, 4)->nullable();

            $table->decimal('working_days', 8, 2)->nullable();
            $table->decimal('present_days', 8, 2)->nullable();
            $table->decimal('leave_days', 8, 2)->nullable();
            $table->decimal('lop_days', 8, 2)->nullable();

            // Additional calculation context
            $table->json('calculation_data')->nullable();

            $table->boolean('is_variable')->default(false);
            $table->boolean('is_taxable')->default(false);
            $table->boolean('is_statutory')->default(false);
            $table->boolean('is_reimbursement')->default(false);

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index([
                'payroll_run_id',
                'type',
            ]);

            $table->index([
                'salary_component_id',
                'type',
            ]);

            $table->index([
                'payroll_run_id',
                'is_variable',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_run_items');
    }
};
