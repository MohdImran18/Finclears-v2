<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payroll_run_items', function (Blueprint $table) {
            $table->unsignedInteger('display_order')
                ->default(0)
                ->after('is_reimbursement');

            $table->index(
                ['payroll_run_id', 'display_order'],
                'payroll_run_items_run_display_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::table('payroll_run_items', function (Blueprint $table) {
            $table->dropIndex('payroll_run_items_run_display_idx');
            $table->dropColumn('display_order');
        });
    }
};
