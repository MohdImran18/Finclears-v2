<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalaryComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'code' => [
                'required',
                'string',
                'max:80',
                'alpha_dash',
                Rule::unique('salary_components', 'code')->withoutTrashed(),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'type' => [
                'required',
                Rule::in([
                    'earning',
                    'deduction',
                ]),
            ],

            'calculation_type' => [
                'required',
                Rule::in([
                    'fixed',
                    'percentage',
                    'formula',
                    'rule_based',
                ]),
            ],

            'calculation_basis' => [
                'nullable',
                'string',
                'max:50',
            ],

            'default_value' => [
                'nullable',
                'numeric',
                'min:0',
                'required_if:calculation_type,fixed',
            ],

            'default_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
                'required_if:calculation_type,percentage',
            ],

            'minimum_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'maximum_amount' => [
                'nullable',
                'numeric',
                'min:0',
                'gte:minimum_amount',
            ],

            'is_variable' => [
                'sometimes',
                'boolean',
            ],

            'is_taxable' => [
                'sometimes',
                'boolean',
            ],

            'is_statutory' => [
                'sometimes',
                'boolean',
            ],

            'is_reimbursement' => [
                'sometimes',
                'boolean',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'display_order' => [
                'sometimes',
                'integer',
                'min:0',
            ],
        ];
    }
}