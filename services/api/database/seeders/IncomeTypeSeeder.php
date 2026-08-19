<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncomeTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Salary Income',
                'code' => 'SALARY',
                'description' => 'Income from salary and employment',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'House Property',
                'code' => 'HOUSE_PROPERTY',
                'description' => 'Income from house property and rental income',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Business / Profession',
                'code' => 'BUSINESS',
                'description' => 'Income from business or profession',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Capital Gains',
                'code' => 'CAPITAL_GAIN',
                'description' => 'Short-term and long-term capital gains',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Other Sources',
                'code' => 'OTHER_SOURCES',
                'description' => 'Interest, dividend and other income',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            DB::table('income_types')->updateOrInsert(
                ['code' => $type['code']],
                array_merge($type, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
