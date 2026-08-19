<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReturnStatusSeeder extends Seeder
{
    public function run(): void
    {
        if (! \Schema::hasTable('return_statuses')) {
            return;
        }

        DB::table('return_statuses')->delete();

        DB::table('return_statuses')->insert([
            [
                'name' => 'Draft',
                'code' => 'draft',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Submitted',
                'code' => 'submitted',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Verified',
                'code' => 'verified',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Processed',
                'code' => 'processed',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
