<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeLetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_profile_id' => [
                'required',
                'integer',
                'exists:employee_profiles,id',
            ],

            'letter_template_id' => [
                'nullable',
                'integer',
                'exists:letter_templates,id',
            ],

            'letter_type' => [
                'required',
                'string',
                'max:100',
            ],

            'letter_number' => [
                'nullable',
                'string',
                'max:100',
                'unique:employee_letters,letter_number',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'letter_date' => [
                'required',
                'date',
            ],

            'effective_date' => [
                'nullable',
                'date',
            ],

            'status' => [
                'nullable',
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
