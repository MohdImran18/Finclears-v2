<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_performance_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id');

            // Rule identification
            $table->string('name', 150);
            $table->string('code', 80);

            // sales / collection / revenue / leads / custom
            $table->string('metric_type', 40);

            // monthly / quarterly / yearly / custom
            $table->string('period_type', 30)->default('monthly');

            // Target configuration
            $table->decimal('target_value', 15, 2)->default(0);
            $table->decimal('minimum_target', 15, 2)->nullable();
            $table->decimal('maximum_target', 15, 2)->nullable();

            // Achievement configuration
            $table->decimal('minimum_achievement_percentage', 8, 4)->nullable();
            $table->decimal('maximum_achievement_percentage', 8, 4)->nullable();

            // Incentive configuration
            // fixed / percentage / slab
            $table->string('incentive_type', 30)->nullable();
            $table->decimal('incentive_value', 15, 2)->nullable();
            $table->json('incentive_slabs')->nullable();

            // Deduction configuration
            // fixed / percentage / slab
            $table->string('deduction_type', 30)->nullable();
            $table->decimal('deduction_value', 15, 2)->nullable();
            $table->json('deduction_slabs')->nullable();

            // Loss deduction configuration
            $table->boolean('loss_deduction_enabled')->default(false);
            $table->string('loss_deduction_type', 30)->nullable();
            $table->decimal('loss_deduction_value', 15, 2)->nullable();

            // Attendance / LOP configuration
            $table->boolean('attendance_deduction_enabled')->default(false);
            $table->string('attendance_deduction_type', 30)->nullable();
            $table->decimal('attendance_deduction_value', 15, 2)->nullable();

            // Limits
            $table->decimal('minimum_incentive', 15, 2)->nullable();
            $table->decimal('maximum_incentive', 15, 2)->nullable();

            $table->decimal('minimum_deduction', 15, 2)->nullable();
            $table->decimal('maximum_deduction', 15, 2)->nullable();

            // Effective period
            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();

            $table->boolean('is_active')->default(true);

            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign key
            $table->foreign(
                'employee_profile_id',
                'epr_employee_profile_fk'
            )
                ->references('id')
                ->on('employee_profiles')
                ->cascadeOnDelete();

            // Short index names for MySQL compatibility
            $table->index(
                ['employee_profile_id', 'is_active'],
                'epr_profile_active_idx'
            );

            $table->index(
                ['metric_type', 'period_type', 'is_active'],
                'epr_metric_period_active_idx'
            );

            $table->index(
                ['effective_from', 'effective_to'],
                'epr_effective_period_idx'
            );

            $table->unique(
                ['employee_profile_id', 'code'],
                'epr_profile_code_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_performance_rules');
    }
};
