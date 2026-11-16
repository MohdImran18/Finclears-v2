<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_daily_consents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('work_date');

            $table->string('policy_version', 50);

            $table->enum('status', [
                'pending',
                'accepted',
                'declined',
                'withdrawn',
            ])->default('pending');

            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('withdrawn_at')->nullable();

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            $table->unique(
                ['user_id', 'work_date', 'policy_version'],
                'employee_daily_consent_unique'
            );

            $table->index(
                ['user_id', 'work_date', 'status'],
                'employee_daily_consent_lookup'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_daily_consents');
    }
};