<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([

            /*
            |--------------------------------------------------------------------------
            | ITR Master Data
            |--------------------------------------------------------------------------
            */

            FinancialYearSeeder::class,

            AssessmentYearSeeder::class,

            ItrTypeSeeder::class,

            TaxRegimeSeeder::class,

            ReturnStatusSeeder::class,

            IncomeTypeSeeder::class,

            /*
            |--------------------------------------------------------------------------
            | Services
            |--------------------------------------------------------------------------
            */

            ServiceCategorySeeder::class,

            ServiceSeeder::class,

            ServiceBenefitSeeder::class,

            ServiceProcessSeeder::class,

            ServiceDocumentSeeder::class,

            ServicePricingSeeder::class,

            ServiceFaqSeeder::class,

            /*
            |--------------------------------------------------------------------------
            | Blog
            |--------------------------------------------------------------------------
            */

            BlogCategorySeeder::class,

            BlogSeeder::class,

            /*
            |--------------------------------------------------------------------------
            | Optional
            |--------------------------------------------------------------------------
            */

            // UserSeeder::class,
            // ContactSeeder::class,
            // NewsletterSeeder::class,

        ]);
    }
}
