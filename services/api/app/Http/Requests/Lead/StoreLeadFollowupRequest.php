<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadFollowupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.edit') === true;
    }

    public function rules(): array
    {
        return [
            'follow_up_at' => [
                'required',
                'date',
            ],

            'type' => [
                'required',
                'in:call,email,whatsapp,meeting,reminder,other',
            ],

            'subject' => [
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
                'nullable',
                'in:pending,completed,cancelled',
            ],
        ];
    }
}