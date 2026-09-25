<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dateTime('ownership_started_at')
                ->nullable()
                ->after('assigned_to');

            $table->dateTime('ownership_expires_at')
                ->nullable()
                ->after('ownership_started_at');

            $table->string('ownership_status', 30)
                ->default('unassigned')
                ->after('ownership_expires_at');

            $table->index([
                'assigned_to',
                'ownership_status',
                'ownership_expires_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex([
                'assigned_to',
                'ownership_status',
                'ownership_expires_at',
            ]);

            $table->dropColumn([
                'ownership_started_at',
                'ownership_expires_at',
                'ownership_status',
            ]);
        });
    }
};