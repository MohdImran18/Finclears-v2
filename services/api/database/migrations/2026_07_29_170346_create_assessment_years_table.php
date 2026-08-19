<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessment_years', function (Blueprint $table) {

            $table->id();

            // Relationship with Financial Year
            $table->foreignId('financial_year_id')
                ->constrained('financial_years')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Example: 2026-27
            $table->string('name', 20);

            // Example: AY2026
            $table->string('code', 10)->unique();

            // Assessment Year Start & End
            $table->date('start_date');
            $table->date('end_date');

            // Active AY
            $table->boolean('is_active')->default(false);

            // Optional Description
            $table->text('description')->nullable();

            // Audit
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('financial_year_id');
            $table->index('is_active');
            $table->index('start_date');
            $table->index('end_date');

            // Prevent duplicate AY for same FY
            $table->unique(
                ['financial_year_id', 'name'],
                'fy_assessment_year_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_years');
    }
};