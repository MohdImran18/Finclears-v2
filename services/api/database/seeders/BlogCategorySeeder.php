<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogCategory;
use Illuminate\Support\Str;

class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [

            'Income Tax',

            'GST',

            'Company Registration',

            'Trademark',

            'Compliance',

            'Startup',

            'Accounting',

            'MSME',

        ];

        foreach ($categories as $category) {

            BlogCategory::updateOrCreate(

                [
                    'slug' => Str::slug($category),
                ],

                [
                    'name' => $category,

                    'description' => $category.' Articles',

                    'status' => true,

                    'is_featured' => true,

                    'sort_order' => 1,
                ]
            );
        }
    }
}