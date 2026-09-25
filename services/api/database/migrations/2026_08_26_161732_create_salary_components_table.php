<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();

            // Display information
            $table->string('name', 150);
            $table->string('code', 80)->unique();
            $table->text('description')->nullable();

            // earning / deduction
            $table->string('type', 30);

            // fixed / percentage / formula / rule_based
            $table->string('calculation_type', 40)->default('fixed');

            // basic_salary / gross_salary / net_salary / sales / target / etc.
            $table->string('calculation_basis', 50)->nullable();

            // Default value used when HR configures a component
            $table->decimal('default_value', 15, 2)->nullable();

            // Used for percentage-based components
            $table->decimal('default_percentage', 8, 4)->nullable();

            // Safety limits
            $table->decimal('minimum_amount', 15, 2)->nullable();
            $table->decimal('maximum_amount', 15, 2)->nullable();

            // Behaviour
            $table->boolean('is_variable')->default(false);
            $table->boolean('is_taxable')->default(false);
            $table->boolean('is_statutory')->default(false);
            $table->boolean('is_reimbursement')->default(false);
            $table->boolean('is_active')->default(true);

            $table->unsignedInteger('display_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active']);
            $table->index(['calculation_type', 'is_active']);
            $table->index(['is_variable', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_components');
    }
};
