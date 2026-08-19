<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItrTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('itr_types')->delete();

        DB::table('itr_types')->insert([

            [
                'code' => 'ITR-1',
                'name' => 'ITR-1 (Sahaj)',
                'description' => 'Individuals having salary, one house property and other income.',
                'eligibility' => 'Resident Individual',
                'applicable_to' => 'Salary',
                'display_order' => 1,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-2',
                'name' => 'ITR-2',
                'description' => 'Individuals and HUF not having business income.',
                'eligibility' => 'Individual/HUF',
                'applicable_to' => 'Capital Gain',
                'display_order' => 2,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-3',
                'name' => 'ITR-3',
                'description' => 'Individuals having business or professional income.',
                'eligibility' => 'Business/Profession',
                'applicable_to' => 'Business',
                'display_order' => 3,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-4',
                'name' => 'ITR-4 (Sugam)',
                'description' => 'Presumptive Income Scheme.',
                'eligibility' => 'Small Business',
                'applicable_to' => 'Presumptive',
                'display_order' => 4,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-5',
                'name' => 'ITR-5',
                'description' => 'Partnership Firms, LLPs and Others.',
                'eligibility' => 'Firm/LLP',
                'applicable_to' => 'Firm',
                'display_order' => 5,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-6',
                'name' => 'ITR-6',
                'description' => 'Companies.',
                'eligibility' => 'Company',
                'applicable_to' => 'Company',
                'display_order' => 6,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 'ITR-7',
                'name' => 'ITR-7',
                'description' => 'Trusts, Political Parties and Charitable Institutions.',
                'eligibility' => 'Trust',
                'applicable_to' => 'Trust',
                'display_order' => 7,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
