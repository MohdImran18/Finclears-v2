<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_followups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lead_id')
                ->constrained('leads')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->dateTime('follow_up_at');

            $table->string('type', 50)
                ->default('call');

            $table->string('subject')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->string('status', 30)
                ->default('pending');

            $table->dateTime('completed_at')
                ->nullable();

            $table->timestamps();

            $table->index(['lead_id', 'follow_up_at']);
            $table->index(['user_id', 'follow_up_at']);
            $table->index(['status', 'follow_up_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_followups');
    }
};