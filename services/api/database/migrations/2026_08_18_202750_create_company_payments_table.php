<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->decimal('amount', 12, 2);

            $table->string('currency', 3)->default('INR');

            $table->string('payment_status', 30)->default('pending');

            $table->string('payment_gateway', 50)->default('cashfree');

            $table->string('gateway_order_id')->nullable()->index();

            $table->string('gateway_transaction_id')->nullable()->index();

            $table->text('payment_session_id')->nullable();

            $table->json('gateway_response')->nullable();

            $table->json('metadata')->nullable();

            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->index([
                'company_id',
                'payment_status',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_payments');
    }
};
