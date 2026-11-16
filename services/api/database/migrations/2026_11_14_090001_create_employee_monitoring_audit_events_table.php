<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_monitoring_audit_events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('actor_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('event', 50);

            $table->string('policy_version', 50)->nullable();

            $table->timestamp('occurred_at');

            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index(
                ['employee_user_id', 'occurred_at'],
                'employee_monitoring_audit_lookup'
            );

            $table->index(
                ['event', 'occurred_at'],
                'employee_monitoring_audit_event_lookup'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_monitoring_audit_events');
    }
};