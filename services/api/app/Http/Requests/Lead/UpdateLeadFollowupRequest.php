<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadFollowupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.edit') === true;
    }

    public function rules(): array
    {
        return [
            'follow_up_at' => [
                'sometimes',
                'required',
                'date',
            ],

            'type' => [
                'sometimes',
                'required',
                'in:call,email,whatsapp,meeting,reminder,other',
            ],

            'subject' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:10000',
            ],

            'status' => [
                'sometimes',
                'required',
                'in:pending,completed,cancelled',
            ],

            'completed_at' => [
                'nullable',
                'date',
            ],
        ];
    }
}