<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_leave_balances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->foreignId('leave_type_id')
                ->constrained('leave_types')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('year');

            $table->decimal('opening_balance', 5, 2)->default(0);
            $table->decimal('allocated', 5, 2)->default(0);
            $table->decimal('used', 5, 2)->default(0);
            $table->decimal('pending', 5, 2)->default(0);
            $table->decimal('adjusted', 5, 2)->default(0);

            $table->timestamps();

            $table->unique(
                ['employee_profile_id', 'leave_type_id', 'year'],
                'employee_leave_balance_unique'
            );

            $table->index(['year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_leave_balances');
    }
};