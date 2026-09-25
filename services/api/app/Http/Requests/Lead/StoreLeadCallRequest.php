<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadCallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.edit') === true;
    }

    public function rules(): array
    {
        return [
            'call_type' => [
                'required',
                'in:incoming,outgoing,missed,callback,whatsapp,other',
            ],

            'started_at' => [
                'required',
                'date',
            ],

            'ended_at' => [
                'nullable',
                'date',
                'after_or_equal:started_at',
            ],

            'duration_seconds' => [
                'nullable',
                'integer',
                'min:0',
                'max:86400',
            ],

            'outcome' => [
                'nullable',
                'string',
                'max:100',
            ],

            'discussion' => [
                'required',
                'string',
                'max:20000',
            ],

            'next_action' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'follow_up_at' => [
                'nullable',
                'date',
            ],
        ];
    }
}