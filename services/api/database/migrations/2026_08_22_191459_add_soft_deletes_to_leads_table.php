<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'deleted_at')) {
                $table->softDeletes();
            }

            if (!Schema::hasColumn('leads', 'deletion_reason')) {
                $table->text('deletion_reason')
                    ->nullable()
                    ->after('lost_reason');
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'deletion_reason')) {
                $table->dropColumn('deletion_reason');
            }

            if (Schema::hasColumn('leads', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};