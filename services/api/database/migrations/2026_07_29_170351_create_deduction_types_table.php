<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deduction_types', function (Blueprint $table) {

            $table->id();

            $table->string('section',50);

            $table->string('name',255);

            $table->decimal('maximum_limit',15,2)->nullable();

            $table->text('description')->nullable();

            $table->unsignedTinyInteger('display_order')->default(1);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index('section');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deduction_types');
    }
};