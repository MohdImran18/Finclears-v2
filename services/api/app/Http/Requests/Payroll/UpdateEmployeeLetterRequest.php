<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeLetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $letterId = $this->route('id');

        return [
            'letter_template_id' => [
                'nullable',
                'integer',
                'exists:letter_templates,id',
            ],

            'letter_type' => [
                'sometimes',
                'string',
                'max:100',
            ],

            'letter_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('employee_letters', 'letter_number')
                    ->ignore($letterId),
            ],

            'title' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'letter_date' => [
                'sometimes',
                'date',
            ],

            'effective_date' => [
                'nullable',
                'date',
            ],

            'status' => [
                'sometimes',
                'string',
                'in:draft,generated,pending_approval,approved,issued,cancelled',
            ],

            'rendered_content' => [
                'nullable',
                'string',
            ],

            'field_values' => [
                'nullable',
                'array',
            ],

            'field_values.*' => [
                'nullable',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
