<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_monitoring_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('requester_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 20)->default('pending');
            $table->timestamp('requested_at');
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->string('response_note', 500)->nullable();
            $table->timestamps();

            $table->index(['employee_user_id', 'status']);
            $table->index(['requester_user_id', 'status']);
            $table->index(['status', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_monitoring_sessions');
    }
};
