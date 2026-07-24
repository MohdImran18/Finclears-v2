<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [

            [
                'category' => 'business-registration',
                'title' => 'Private Limited Company Registration',
                'slug' => 'private-limited-company-registration',
                'code' => 'PLC001',
                'price' => 6999,
                'days' => 10,
            ],

            [
                'category' => 'business-registration',
                'title' => 'LLP Registration',
                'slug' => 'llp-registration',
                'code' => 'LLP001',
                'price' => 4999,
                'days' => 7,
            ],

            [
                'category' => 'business-registration',
                'title' => 'One Person Company Registration',
                'slug' => 'opc-registration',
                'code' => 'OPC001',
                'price' => 5999,
                'days' => 8,
            ],

            [
                'category' => 'gst-services',
                'title' => 'GST Registration',
                'slug' => 'gst-registration',
                'code' => 'GST001',
                'price' => 999,
                'days' => 3,
            ],

            [
                'category' => 'gst-services',
                'title' => 'GST Return Filing',
                'slug' => 'gst-return-filing',
                'code' => 'GST002',
                'price' => 499,
                'days' => 1,
            ],

            [
                'category' => 'trademark',
                'title' => 'Trademark Registration',
                'slug' => 'trademark-registration',
                'code' => 'TM001',
                'price' => 1499,
                'days' => 2,
            ],

            [
                'category' => 'income-tax',
                'title' => 'Income Tax Return Filing',
                'slug' => 'income-tax-return-filing',
                'code' => 'ITR001',
                'price' => 999,
                'days' => 1,
            ],

            [
                'category' => 'compliance',
                'title' => 'Annual ROC Filing',
                'slug' => 'annual-roc-filing',
                'code' => 'ROC001',
                'price' => 3999,
                'days' => 7,
            ],

        ];

        foreach ($services as $item) {

            $category = ServiceCategory::where(
                'slug',
                $item['category']
            )->first();

            if (!$category) {
                continue;
            }

            Service::updateOrCreate(

                [
                    'slug' => $item['slug'],
                ],

                [
                    'service_category_id' => $category->id,

                    'title' => $item['title'],

                    'slug' => $item['slug'],

                    'code' => $item['code'],

                    'icon' => 'briefcase',

                    'featured_image' => null,

                    'banner_image' => null,

                    'short_description' => $item['title'].' online with FinClears.',

                    'description' => 'Professional '.$item['title'].' service provided by FinClears experts.',

                    'starting_price' => $item['price'],

                    'price_label' => 'Starting From',

                    'processing_days' => $item['days'],

                    'meta_title' => $item['title'],

                    'meta_description' => 'Get '.$item['title'].' online at affordable pricing.',

                    'meta_keywords' => strtolower($item['title']),

                    'is_featured' => true,

                    'is_popular' => true,

                    'status' => true,

                    'sort_order' => 1,

                    'views' => 0,

                    'orders' => 0,
                ]
            );
        }
    }
}