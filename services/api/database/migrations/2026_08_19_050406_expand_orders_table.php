<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_no')->unique()->after('id');

            $table->foreignId('company_id')
                ->nullable()
                ->after('order_no')
                ->constrained('companies')
                ->nullOnDelete();

            $table->string('service_name')->after('company_id');

            $table->string('customer_name')->nullable()->after('service_name');

            $table->string('customer_email')->nullable()->after('customer_name');

            $table->string('customer_mobile')->nullable()->after('customer_email');

            $table->enum('priority', [
                'low',
                'medium',
                'high',
                'urgent',
            ])->default('medium')->after('customer_mobile');

            $table->enum('status', [
                'draft',
                'pending',
                'assigned',
                'documents_pending',
                'processing',
                'verification',
                'completed',
                'cancelled',
            ])->default('pending')->after('priority');

            $table->decimal('amount', 12, 2)->default(0)->after('status');

            $table->foreignId('assigned_to')
                ->nullable()
                ->after('amount')
                ->constrained('users')
                ->nullOnDelete();

            $table->index(['company_id', 'status']);
            $table->index(['status', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['assigned_to']);

            $table->dropIndex(['company_id', 'status']);
            $table->dropIndex(['status', 'priority']);

            $table->dropColumn([
                'order_no',
                'company_id',
                'service_name',
                'customer_name',
                'customer_email',
                'customer_mobile',
                'priority',
                'status',
                'amount',
                'assigned_to',
            ]);
        });
    }
};
