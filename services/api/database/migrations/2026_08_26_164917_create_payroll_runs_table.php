<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->foreignId('employee_salary_structure_id')
                ->nullable()
                ->constrained('employee_salary_structures')
                ->nullOnDelete();

            // Payroll period
            $table->unsignedSmallInteger('payroll_year');
            $table->unsignedTinyInteger('payroll_month');

            $table->date('period_start');
            $table->date('period_end');

            // Salary
            $table->decimal('basic_salary', 15, 2)->default(0);
            $table->decimal('fixed_earnings', 15, 2)->default(0);
            $table->decimal('variable_earnings', 15, 2)->default(0);

            // Performance
            $table->decimal('performance_incentive', 15, 2)->default(0);
            $table->decimal('performance_deduction', 15, 2)->default(0);

            // Additional payments
            $table->decimal('reimbursement_amount', 15, 2)->default(0);
            $table->decimal('pending_payment_amount', 15, 2)->default(0);
            $table->decimal('other_payment_amount', 15, 2)->default(0);

            // Gross
            $table->decimal('gross_pay', 15, 2)->default(0);

            // Deductions
            $table->decimal('loss_deduction', 15, 2)->default(0);
            $table->decimal('attendance_deduction', 15, 2)->default(0);
            $table->decimal('statutory_deduction', 15, 2)->default(0);
            $table->decimal('other_deduction', 15, 2)->default(0);

            $table->decimal('total_deductions', 15, 2)->default(0);

            // Final salary
            $table->decimal('net_payable', 15, 2)->default(0);

            // Attendance snapshot
            $table->decimal('working_days', 8, 2)->default(0);
            $table->decimal('present_days', 8, 2)->default(0);
            $table->decimal('leave_days', 8, 2)->default(0);
            $table->decimal('lop_days', 8, 2)->default(0);

            // Performance snapshot
            $table->decimal('target_value', 15, 2)->default(0);
            $table->decimal('achievement_value', 15, 2)->default(0);
            $table->decimal('achievement_percentage', 8, 4)->default(0);

            // Payroll status
            $table->string('status', 30)->default('draft');

            // Approval / payment
            $table->timestamp('calculated_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('payment_reference', 150)->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // One payroll record per employee per month
            $table->unique(
                [
                    'employee_profile_id',
                    'payroll_year',
                    'payroll_month',
                ],
                'employee_payroll_period_unique'
            );

            $table->index(
                [
                    'payroll_year',
                    'payroll_month',
                    'status',
                ],
                'payroll_period_status_index'
            );

            $table->index(
                [
                    'employee_profile_id',
                    'status',
                ],
                'employee_payroll_status_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_runs');
    }
};
