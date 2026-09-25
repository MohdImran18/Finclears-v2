<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salary_structure_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_salary_structure_id');

            $table->foreignId('salary_component_id');

            // Employee-specific calculation configuration
            $table->string('calculation_type', 40)->default('fixed');
            $table->string('calculation_basis', 50)->nullable();

            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('percentage', 8, 4)->nullable();

            $table->text('formula')->nullable();
            $table->json('rule_config')->nullable();

            $table->decimal('minimum_amount', 15, 2)->nullable();
            $table->decimal('maximum_amount', 15, 2)->nullable();

            $table->boolean('is_variable')->default(false);
            $table->boolean('is_taxable')->default(false);
            $table->boolean('is_statutory')->default(false);
            $table->boolean('is_reimbursement')->default(false);
            $table->boolean('is_enabled')->default(true);

            $table->unsignedInteger('display_order')->default(0);

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->foreign(
                'employee_salary_structure_id',
                'ess_item_structure_fk'
            )
                ->references('id')
                ->on('employee_salary_structures')
                ->cascadeOnDelete();

            $table->foreign(
                'salary_component_id',
                'ess_item_component_fk'
            )
                ->references('id')
                ->on('salary_components')
                ->restrictOnDelete();

            $table->index(
                ['employee_salary_structure_id', 'is_enabled'],
                'ess_item_structure_enabled_idx'
            );

            $table->index(
                ['salary_component_id', 'is_enabled'],
                'ess_item_component_enabled_idx'
            );

            $table->index(
                ['calculation_type', 'is_variable'],
                'ess_item_calc_variable_idx'
            );

            $table->unique(
                ['employee_salary_structure_id', 'salary_component_id'],
                'ess_item_structure_component_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salary_structure_items');
    }
};
