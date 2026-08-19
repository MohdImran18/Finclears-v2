<?php

namespace App\Http\Requests\ITR;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItrReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => [
                'nullable',
                'exists:companies,id',
            ],

            'assessment_year' => [
                'sometimes',
                'string',
            ],

            'financial_year' => [
                'sometimes',
                'string',
            ],

            'return_type' => [
                'sometimes',
            ],

            'tax_regime' => [
                'sometimes',
            ],

            'status' => [
                'sometimes',
            ],

            'gross_income' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'total_deductions' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'taxable_income' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'tax_liability' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'interest_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'late_fee' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'relief_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'rebate_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            /*
             * Tax Credits / Payments
             */
            'tds_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'tcs_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'advance_tax' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'self_assessment_tax' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'refund_amount' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'net_payable' => [
                'sometimes',
                'numeric',
                'min:0',
            ],
        ];
    }
}