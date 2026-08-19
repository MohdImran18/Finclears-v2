<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinancialYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('financial_years')->delete();

        DB::table('financial_years')->insert([
            [
                'name' => '2024-25',
                'code' => 'FY2024',
                'start_date' => '2024-04-01',
                'end_date' => '2025-03-31',
                'is_active' => 0,
                'description' => 'Financial Year 2024-25',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2025-26',
                'code' => 'FY2025',
                'start_date' => '2025-04-01',
                'end_date' => '2026-03-31',
                'is_active' => 1,
                'description' => 'Current Financial Year',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2026-27',
                'code' => 'FY2026',
                'start_date' => '2026-04-01',
                'end_date' => '2027-03-31',
                'is_active' => 0,
                'description' => 'Next Financial Year',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
