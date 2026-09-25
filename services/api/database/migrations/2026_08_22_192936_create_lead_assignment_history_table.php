<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_assignment_history', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lead_id')
                ->constrained('leads')
                ->cascadeOnDelete();

            $table->foreignId('from_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('to_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('changed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('assignment_type', 50)
                ->default('manual');

            $table->text('reason')
                ->nullable();

            $table->timestamps();

            $table->index(['lead_id', 'created_at']);
            $table->index(['to_user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_assignment_history');
    }
};