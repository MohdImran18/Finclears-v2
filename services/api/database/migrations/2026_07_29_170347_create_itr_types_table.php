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
        Schema::create('itr_types', function (Blueprint $table) {

            $table->id();

            // Example: ITR-1
            $table->string('code', 20)->unique();

            // Example: Sahaj
            $table->string('name', 100);

            // Description
            $table->text('description')->nullable();

            // Eligibility
            $table->text('eligibility')->nullable();

            // Applicable For
            $table->string('applicable_to', 255)->nullable();

            // Display Order
            $table->unsignedTinyInteger('display_order')->default(1);

            // Active Status
            $table->boolean('is_active')->default(true);

            // Audit
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('code');
            $table->index('is_active');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itr_types');
    }
};