<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $category = BlogCategory::first();

        if (!$category) {
            return;
        }

        for ($i = 1; $i <= 10; $i++) {

            Blog::updateOrCreate(

                [
                    'slug' => 'sample-blog-'.$i,
                ],

                [

                    'blog_category_id' => $category->id,

                    'title' => 'Sample Blog '.$i,

                    'featured_image' => null,

                    'excerpt' => 'This is a sample blog excerpt.',

                    'content' => str_repeat(
                        'This is sample blog content. ',
                        50
                    ),

                    'reading_time' => '5 min',

                    'author_name' => 'FinClears',

                    'published_at' => now(),

                    'meta_title' => 'Sample Blog '.$i,

                    'meta_description' => 'SEO Description',

                    'meta_keywords' => 'tax,gst,company',

                    'is_featured' => $i <= 3,

                    'status' => true,

                ]
            );
        }
    }
}