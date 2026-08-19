<?php

namespace App\Http\Requests\ITR;

use Illuminate\Foundation\Http\FormRequest;

class StoreItrReturnRequest extends FormRequest
{
    /**
     * Authorize Request
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [

            'company_id' => [
                'nullable',
                'exists:companies,id',
            ],

            'assessment_year' => [
                'required',
                'string',
                'max:20',
            ],

            'financial_year' => [
                'required',
                'string',
                'max:20',
            ],

            'return_type' => [
                'required',
                'string',
            ],

            'tax_regime' => [
                'required',
                'string',
            ],

            'pan' => [
                'required',
                'string',
                'regex:/^[A-Z]{5}[0-9]{4}[A-Z]$/',
            ],

            'aadhaar' => [
                'required',
                'digits:12',
            ],

            'mobile' => [
                'required',
                'digits:10',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'assessment_year.required' => 'Assessment Year is required.',

            'financial_year.required' => 'Financial Year is required.',

            'return_type.required' => 'ITR Type is required.',

            'tax_regime.required' => 'Tax Regime is required.',

            'pan.required' => 'PAN Number is required.',
            'pan.regex' => 'Enter a valid PAN Number (ABCDE1234F).',

            'aadhaar.required' => 'Aadhaar Number is required.',
            'aadhaar.digits' => 'Aadhaar must be exactly 12 digits.',

            'mobile.required' => 'Mobile Number is required.',
            'mobile.digits' => 'Mobile Number must be exactly 10 digits.',

            'email.required' => 'Email Address is required.',
            'email.email' => 'Enter a valid Email Address.',

        ];
    }
}