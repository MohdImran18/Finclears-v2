<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class AssignLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.assign') === true
            || $this->user()?->can('leads.reassign') === true;
    }

    public function rules(): array
    {
        return [
            'assigned_to' => [
                'required',
                'integer',
                'exists:users,id',
            ],

            'reason' => [
                'required',
                'string',
                'max:1000',
            ],

            'assignment_type' => [
                'nullable',
                'in:manual,manager_reassign,escalation',
            ],
        ];
    }
}