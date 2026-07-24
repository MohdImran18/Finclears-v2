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

            ServiceCategorySeeder::class,

            ServiceSeeder::class,

            ServiceBenefitSeeder::class,

            ServiceProcessSeeder::class,

            ServiceDocumentSeeder::class,

            ServicePricingSeeder::class,

            ServiceFaqSeeder::class,

            BlogCategorySeeder::class,

            BlogSeeder::class,


        ]);
    }
}