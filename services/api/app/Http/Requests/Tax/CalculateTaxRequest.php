<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

class CalculateTaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gross_income'   => ['required', 'numeric', 'min:0'],
            'taxable_income' => ['required', 'numeric', 'min:0'],
            'deductions'     => ['nullable', 'numeric', 'min:0'],
        ];
    }
}