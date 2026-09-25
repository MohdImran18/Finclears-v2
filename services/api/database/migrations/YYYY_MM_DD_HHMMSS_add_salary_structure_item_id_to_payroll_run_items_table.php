<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payroll_run_items', function (Blueprint $table) {
            $table->foreignId('employee_salary_structure_item_id')
                ->nullable()
                ->after('salary_component_id')
                ->constrained('employee_salary_structure_items')
                ->nullOnDelete();

            $table->index(
                'employee_salary_structure_item_id',
                'payroll_run_items_structure_item_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::table('payroll_run_items', function (Blueprint $table) {
            $table->dropForeign([
                'employee_salary_structure_item_id',
            ]);

            $table->dropIndex(
                'payroll_run_items_structure_item_idx'
            );

            $table->dropColumn(
                'employee_salary_structure_item_id'
            );
        });
    }
};
