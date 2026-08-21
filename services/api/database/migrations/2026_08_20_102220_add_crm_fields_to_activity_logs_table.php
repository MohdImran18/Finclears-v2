<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreignId('lead_id')
                ->nullable()
                ->after('id')
                ->constrained('leads')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->after('lead_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->string('type', 50)
                ->after('user_id');

            $table->string('subject')
                ->nullable()
                ->after('type');

            $table->text('description')
                ->nullable()
                ->after('subject');

            $table->dateTime('activity_at')
                ->nullable()
                ->after('description');

            $table->index(['lead_id', 'activity_at']);
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropForeign(['lead_id']);
            $table->dropForeign(['user_id']);

            $table->dropColumn([
                'lead_id',
                'user_id',
                'type',
                'subject',
                'description',
                'activity_at',
            ]);
        });
    }
};