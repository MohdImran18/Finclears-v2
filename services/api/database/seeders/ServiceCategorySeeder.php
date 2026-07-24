<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [

            [
                'name' => 'Business Registration',
                'slug' => 'business-registration',
                'icon' => 'building',
                'image' => null,
                'description' => 'Company and business registration services.',
                'is_featured' => true,
                'status' => true,
                'sort_order' => 1,
            ],

            [
                'name' => 'GST Services',
                'slug' => 'gst-services',
                'icon' => 'receipt',
                'image' => null,
                'description' => 'GST registration and return filing.',
                'is_featured' => true,
                'status' => true,
                'sort_order' => 2,
            ],

            [
                'name' => 'Trademark',
                'slug' => 'trademark',
                'icon' => 'shield',
                'image' => null,
                'description' => 'Trademark registration services.',
                'is_featured' => true,
                'status' => true,
                'sort_order' => 3,
            ],

            [
                'name' => 'Income Tax',
                'slug' => 'income-tax',
                'icon' => 'calculator',
                'image' => null,
                'description' => 'Income tax filing services.',
                'is_featured' => true,
                'status' => true,
                'sort_order' => 4,
            ],

            [
                'name' => 'Compliance',
                'slug' => 'compliance',
                'icon' => 'check-circle',
                'image' => null,
                'description' => 'Business compliance services.',
                'is_featured' => true,
                'status' => true,
                'sort_order' => 5,
            ],

        ];

        foreach ($categories as $category) {

            ServiceCategory::updateOrCreate(
                [
                    'slug' => $category['slug'],
                ],
                $category
            );
        }
    }
}