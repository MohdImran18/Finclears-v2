<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('order_id')
                ->after('id')
                ->constrained('orders')
                ->cascadeOnDelete();

            $table->string('service_name')->after('order_id');

            $table->string('description')->nullable()->after('service_name');

            $table->unsignedInteger('quantity')->default(1)->after('description');

            $table->decimal('unit_price', 12, 2)->default(0)->after('quantity');

            $table->decimal('total_price', 12, 2)->default(0)->after('unit_price');

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropIndex(['order_id']);

            $table->dropColumn([
                'order_id',
                'service_name',
                'description',
                'quantity',
                'unit_price',
                'total_price',
            ]);
        });
    }
};
