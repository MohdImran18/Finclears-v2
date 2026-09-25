<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('department_id')
                ->constrained('departments')
                ->cascadeOnDelete();

            $table->string('name', 120);
            $table->string('code', 50);

            $table->text('description')->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->unique(['department_id', 'name']);
            $table->unique(['department_id', 'code']);
            $table->index(['status', 'department_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('designations');
    }
};
