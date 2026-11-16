<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // This ENUM alteration is specific to MySQL.
        // SQLite uses a compatible string column in the test schema.
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("
            ALTER TABLE users
            MODIFY role ENUM('admin', 'employee', 'client', 'super_admin')
            NOT NULL DEFAULT 'client'
        ");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("
            UPDATE users SET role = 'admin' WHERE role = 'super_admin'
        ");

        DB::statement("
            ALTER TABLE users
            MODIFY role ENUM('admin', 'employee', 'client')
            NOT NULL DEFAULT 'client'
        ");
    }
};