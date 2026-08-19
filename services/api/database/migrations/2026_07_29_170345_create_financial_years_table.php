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
        Schema::create('financial_years', function (Blueprint $table) {

            $table->id();

            // Example: Financial Year 2025-26
            $table->string('name', 20);

            // Example: FY2025
            $table->string('code', 10)->unique();

            // FY Start & End
            $table->date('start_date');
            $table->date('end_date');

            // Active FY
            $table->boolean('is_active')->default(false);

            // Optional Description
            $table->text('description')->nullable();

            // Audit
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('is_active');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_years');
    }
};