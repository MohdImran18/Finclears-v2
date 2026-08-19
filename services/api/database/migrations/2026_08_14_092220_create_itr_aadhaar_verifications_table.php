<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_aadhaar_verifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('itr_return_id')
                ->constrained('itr_returns')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('aadhaar', 255);

            $table->string('reference_id', 100)
                ->nullable();

            $table->string('transaction_id', 100)
                ->nullable();

            $table->string('verification_status', 30)
                ->default('pending');

            $table->string('name', 150)
                ->nullable();

            $table->date('date_of_birth')
                ->nullable();

            $table->string('gender', 20)
                ->nullable();

            $table->text('care_of')
                ->nullable();

            $table->text('full_address')
                ->nullable();

            $table->string('provider', 50)
                ->default('sandbox');

            $table->json('provider_response')
                ->nullable();

            $table->timestamp('verified_at')
                ->nullable();

            $table->timestamps();

            $table->index('itr_return_id');
            $table->index('user_id');
            $table->index('reference_id');
            $table->index('verification_status');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itr_aadhaar_verifications');
    }
};