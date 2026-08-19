<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('itr_returns', function (Blueprint $table) {

            $table->string('pan_verification_status', 30)
                ->default('pending')
                ->after('pan');

            $table->timestamp('pan_verified_at')
                ->nullable()
                ->after('pan_verification_status');

            $table->string('pan_transaction_id', 100)
                ->nullable()
                ->after('pan_verified_at');

            $table->index('pan_verification_status');
            $table->index('pan_transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('itr_returns', function (Blueprint $table) {

            $table->dropIndex([
                'pan_verification_status',
            ]);

            $table->dropIndex([
                'pan_transaction_id',
            ]);

            $table->dropColumn([
                'pan_verification_status',
                'pan_verified_at',
                'pan_transaction_id',
            ]);
        });
    }
};