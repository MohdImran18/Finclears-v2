<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Temporarily keep the legacy "paid" value
        // while adding the new canonical PaymentStatus values.
        DB::statement("
            ALTER TABLE companies
            MODIFY payment_status ENUM(
                'pending',
                'initiated',
                'processing',
                'success',
                'paid',
                'failed',
                'refunded',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");

        // Step 2: Convert existing legacy "paid" records
        // to the canonical "success" status.
        DB::table('companies')
            ->where('payment_status', 'paid')
            ->update([
                'payment_status' => 'success',
            ]);

        // Step 3: Remove the legacy "paid" value.
        DB::statement("
            ALTER TABLE companies
            MODIFY payment_status ENUM(
                'pending',
                'initiated',
                'processing',
                'success',
                'failed',
                'refunded',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        // Temporarily add legacy "paid" back.
        DB::statement("
            ALTER TABLE companies
            MODIFY payment_status ENUM(
                'pending',
                'initiated',
                'processing',
                'success',
                'paid',
                'failed',
                'refunded',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");

        // Convert success back to the legacy paid value.
        DB::table('companies')
            ->where('payment_status', 'success')
            ->update([
                'payment_status' => 'paid',
            ]);

        // Restore the original enum.
        DB::statement("
            ALTER TABLE companies
            MODIFY payment_status ENUM(
                'pending',
                'paid',
                'failed',
                'refunded'
            ) NOT NULL DEFAULT 'pending'
        ");
    }
};
