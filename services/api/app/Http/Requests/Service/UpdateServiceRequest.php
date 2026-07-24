<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $service = $this->route('service');

        return [

            'service_category_id' => [
                'required',
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
                Rule::unique('services', 'slug')
                    ->ignore($service),
            ],

            'code' => [
                'nullable',
                'string',
                Rule::unique('services', 'code')
                    ->ignore($service),
            ],

            'icon' => [
                'nullable',
                'string',
            ],

            'featured_image' => [
                'nullable',
                'string',
            ],

            'banner_image' => [
                'nullable',
                'string',
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
            ],

            'price_label' => [
                'nullable',
                'string',
            ],

            'processing_days' => [
                'nullable',
                'integer',
            ],

            'meta_title' => [
                'nullable',
                'string',
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
                'boolean',
            ],

            'is_popular' => [
                'boolean',
            ],

            'status' => [
                'boolean',
            ],

            'sort_order' => [
                'integer',
            ],

        ];
    }
}