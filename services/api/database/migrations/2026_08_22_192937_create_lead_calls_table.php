<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_calls', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lead_id')
                ->constrained('leads')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('call_type', 30)
                ->default('outgoing');

            $table->dateTime('started_at')
                ->nullable();

            $table->dateTime('ended_at')
                ->nullable();

            $table->unsignedInteger('duration_seconds')
                ->default(0);

            $table->string('outcome', 100)
                ->nullable();

            $table->text('discussion')
                ->nullable();

            $table->text('next_action')
                ->nullable();

            $table->dateTime('follow_up_at')
                ->nullable();

            $table->timestamps();

            $table->index(['lead_id', 'started_at']);
            $table->index(['user_id', 'started_at']);
            $table->index(['outcome']);
            $table->index(['follow_up_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_calls');
    }
};