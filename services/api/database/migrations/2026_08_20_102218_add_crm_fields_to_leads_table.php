<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->string('email')->nullable()->after('name');
            $table->string('phone', 30)->after('email');
            $table->string('alternate_phone', 30)->nullable()->after('phone');

            $table->string('company_name')->nullable()->after('alternate_phone');

            $table->foreignId('service_id')
                ->nullable()
                ->after('company_name')
                ->constrained('services')
                ->nullOnDelete();

            $table->foreignId('source_id')
                ->nullable()
                ->after('service_id')
                ->constrained('lead_sources')
                ->nullOnDelete();

            $table->string('status', 30)
                ->default('new')
                ->after('source_id');

            $table->string('priority', 20)
                ->default('medium')
                ->after('status');

            $table->foreignId('assigned_to')
                ->nullable()
                ->after('priority')
                ->constrained('users')
                ->nullOnDelete();

            $table->decimal('estimated_value', 12, 2)
                ->nullable()
                ->after('assigned_to');

            $table->text('notes')
                ->nullable()
                ->after('estimated_value');

            $table->dateTime('next_follow_up_at')
                ->nullable()
                ->after('notes');

            $table->dateTime('converted_at')
                ->nullable()
                ->after('next_follow_up_at');

            $table->text('lost_reason')
                ->nullable()
                ->after('converted_at');

            $table->index('status');
            $table->index('priority');
            $table->index('next_follow_up_at');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropForeign(['source_id']);
            $table->dropForeign(['assigned_to']);

            $table->dropColumn([
                'name',
                'email',
                'phone',
                'alternate_phone',
                'company_name',
                'service_id',
                'source_id',
                'status',
                'priority',
                'assigned_to',
                'estimated_value',
                'notes',
                'next_follow_up_at',
                'converted_at',
                'lost_reason',
            ]);
        });
    }
};