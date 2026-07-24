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
        Schema::table('users', function (Blueprint $table) {

            $table->string('phone', 20)->nullable()->after('email');

            $table->enum('role', [
                'admin',
                'employee',
                'client'
            ])->default('client')->after('password');

            $table->enum('status', [
                'active',
                'inactive',
                'blocked'
            ])->default('active')->after('role');

            $table->timestamp('last_login_at')->nullable();

            $table->string('avatar')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'phone',
                'role',
                'status',
                'last_login_at',
                'avatar',
            ]);

        });
    }
};