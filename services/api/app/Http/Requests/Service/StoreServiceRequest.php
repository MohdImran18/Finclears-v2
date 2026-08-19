<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_category_id' => [
                'required',
                'integer',
                'exists:service_categories,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:services,slug',
            ],

            'code' => [
                'nullable',
                'string',
                'max:100',
                'unique:services,code',
            ],

            'icon' => [
                'nullable',
                'string',
                'max:255',
            ],

            'featured_image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'banner_image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'short_description' => [
                'required',
                'string',
            ],

            'description' => [
                'required',
                'string',
            ],

            'starting_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'price_label' => [
                'nullable',
                'string',
                'max:100',
            ],

            'processing_days' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'meta_description' => [
                'nullable',
                'string',
            ],

            'meta_keywords' => [
                'nullable',
                'string',
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],

            'is_popular' => [
                'sometimes',
                'boolean',
            ],

            'status' => [
                'sometimes',
                'boolean',
            ],

            'sort_order' => [
                'sometimes',
                'integer',
                'min:0',
            ],
        ];
    }
}