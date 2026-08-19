<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('income_types', function (Blueprint $table) {

            $table->id();

            $table->string('name',100);

            $table->string('code',50)->unique();

            $table->text('description')->nullable();

            $table->unsignedTinyInteger('display_order')->default(1);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index('display_order');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('income_types');
    }
};