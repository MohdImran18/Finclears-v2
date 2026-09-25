<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSalaryComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $component = $this->route('salaryComponent');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:80',
                'alpha_dash',
                Rule::unique('salary_components', 'code')
                    ->ignore($component)
                    ->withoutTrashed(),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'type' => [
                'sometimes',
                'required',
                Rule::in([
                    'earning',
                    'deduction',
                ]),
            ],

            'calculation_type' => [
                'sometimes',
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
            ],

            'default_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
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