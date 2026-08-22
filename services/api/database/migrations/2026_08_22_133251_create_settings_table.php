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
        Schema::table('settings', function (Blueprint $table) {
            $table->string('key')
                ->unique()
                ->after('id');

            $table->text('value')
                ->nullable()
                ->after('key');

            $table->string('type')
                ->default('string')
                ->after('value');

            $table->string('group')
                ->default('general')
                ->after('type');

            $table->text('description')
                ->nullable()
                ->after('group');

            $table->index('group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropIndex(['group']);
            $table->dropUnique(['key']);

            $table->dropColumn([
                'key',
                'value',
                'type',
                'group',
                'description',
            ]);
        });
    }
};