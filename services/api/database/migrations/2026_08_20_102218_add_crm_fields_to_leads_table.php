<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'status')) {
                $table->string('status')->nullable()->after('id');
            }

            if (!Schema::hasColumn('leads', 'source_id')) {
                $table->foreignId('source_id')
                    ->nullable()
                    ->after('status')
                    ->constrained('lead_sources')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('leads', 'assigned_to')) {
                $table->foreignId('assigned_to')
                    ->nullable()
                    ->after('source_id')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('leads', 'follow_up_at')) {
                $table->dateTime('follow_up_at')
                    ->nullable()
                    ->after('assigned_to');
            }

            if (!Schema::hasColumn('leads', 'next_follow_up_at')) {
                $table->dateTime('next_follow_up_at')
                    ->nullable()
                    ->after('follow_up_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'next_follow_up_at')) {
                $table->dropColumn('next_follow_up_at');
            }

            if (Schema::hasColumn('leads', 'follow_up_at')) {
                $table->dropColumn('follow_up_at');
            }

            if (Schema::hasColumn('leads', 'assigned_to')) {
                $table->dropForeign(['assigned_to']);
                $table->dropColumn('assigned_to');
            }

            if (Schema::hasColumn('leads', 'source_id')) {
                $table->dropForeign(['source_id']);
                $table->dropColumn('source_id');
            }

            if (Schema::hasColumn('leads', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};