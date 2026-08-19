<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_payments', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('itr_return_id')
                ->constrained('itr_returns')
                ->cascadeOnDelete();

            $table->string('transaction_id')->nullable();

            $table->decimal('amount', 15, 2);

            $table->decimal('tax_amount', 15, 2)->default(0);

            $table->decimal('interest_amount', 15, 2)->default(0);

            $table->decimal('penalty_amount', 15, 2)->default(0);

            $table->decimal('gateway_fee', 15, 2)->default(0);

            $table->string('currency', 10)->default('INR');

            $table->string('payment_status', 30)->default('pending');

            $table->string('payment_gateway', 50)->nullable();

            $table->string('gateway_transaction_id')->nullable();

            $table->json('gateway_response')->nullable();

            $table->json('metadata')->nullable();

            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('itr_return_id');
            $table->index('payment_status');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itr_payments');
    }
};
