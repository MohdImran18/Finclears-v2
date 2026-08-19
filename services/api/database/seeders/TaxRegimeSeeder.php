<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxRegimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tax_regimes')->delete();

        DB::table('tax_regimes')->insert([

            [
                'name' => 'Old Tax Regime',
                'code' => 'old',
                'description' => 'Income Tax Act old regime with deductions and exemptions.',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'New Tax Regime',
                'code' => 'new',
                'description' => 'Income Tax Act new regime under Section 115BAC.',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
