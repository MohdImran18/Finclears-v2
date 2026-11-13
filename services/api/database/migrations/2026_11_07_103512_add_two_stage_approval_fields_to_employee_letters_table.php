<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_letters', function (Blueprint $table) {

            // HR Manager approval audit
            $table->foreignId('hr_approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('hr_approved_at')->nullable();
            $table->text('hr_approval_remarks')->nullable();

            // HR Manager rejection audit
            $table->foreignId('hr_rejected_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('hr_rejected_at')->nullable();
            $table->text('hr_rejection_remarks')->nullable();

            // Admin final approval audit
            $table->foreignId('admin_approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('admin_approved_at')->nullable();
            $table->text('admin_approval_remarks')->nullable();

            // Admin rejection audit
            $table->foreignId('admin_rejected_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('admin_rejected_at')->nullable();
            $table->text('admin_rejection_remarks')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('employee_letters', function (Blueprint $table) {

            $table->dropConstrainedForeignId('hr_approved_by');
            $table->dropConstrainedForeignId('hr_rejected_by');
            $table->dropConstrainedForeignId('admin_approved_by');
            $table->dropConstrainedForeignId('admin_rejected_by');

            $table->dropColumn([
                'hr_approved_at',
                'hr_approval_remarks',
                'hr_rejected_at',
                'hr_rejection_remarks',
                'admin_approved_at',
                'admin_approval_remarks',
                'admin_rejected_at',
                'admin_rejection_remarks',
            ]);
        });
    }
};
