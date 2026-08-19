<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssessmentYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('assessment_years')->delete();

        $financialYears = DB::table('financial_years')
            ->pluck('id', 'name');

        $rows = [
            [
                'financial_year' => '2024-25',
                'name' => '2025-26',
                'code' => 'AY2025',
                'start_date' => '2025-04-01',
                'end_date' => '2026-03-31',
                'is_active' => 0,
                'description' => 'Assessment Year 2025-26',
            ],
            [
                'financial_year' => '2025-26',
                'name' => '2026-27',
                'code' => 'AY2026',
                'start_date' => '2026-04-01',
                'end_date' => '2027-03-31',
                'is_active' => 1,
                'description' => 'Current Assessment Year',
            ],
            [
                'financial_year' => '2026-27',
                'name' => '2027-28',
                'code' => 'AY2027',
                'start_date' => '2027-04-01',
                'end_date' => '2028-03-31',
                'is_active' => 0,
                'description' => 'Next Assessment Year',
            ],
        ];

        foreach ($rows as $row) {

            DB::table('assessment_years')->insert([
                'financial_year_id' => $financialYears[$row['financial_year']],
                'name' => $row['name'],
                'code' => $row['code'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'is_active' => $row['is_active'],
                'description' => $row['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
