<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    /**
     * Authorize the request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules.
     */
    public function rules(): array
    {
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
                'min:0',
            ],

        ];
    }
}