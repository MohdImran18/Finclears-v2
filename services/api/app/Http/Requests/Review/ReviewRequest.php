<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => ['nullable', 'string'],

            'pan' => ['nullable', 'string'],

            'aadhaar' => ['nullable', 'string'],

            'mobile' => ['nullable', 'string'],

            'email' => ['nullable', 'email'],

            'salary' => ['nullable', 'numeric'],

            'house_property' => ['nullable', 'numeric'],

            'other_sources' => ['nullable', 'numeric'],

            'gross_income' => ['required', 'numeric'],

            'deductions' => ['nullable', 'numeric'],

            'taxable_income' => ['required', 'numeric'],

            '80c' => ['nullable', 'numeric'],

            '80d' => ['nullable', 'numeric'],

            '80ccd' => ['nullable', 'numeric'],

            '80tta' => ['nullable', 'numeric'],

        ];
    }
}