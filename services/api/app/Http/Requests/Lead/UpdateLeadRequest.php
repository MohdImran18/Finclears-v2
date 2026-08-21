<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:30',
            ],

            'alternate_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'company_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'service_id' => [
                'nullable',
                'integer',
                'exists:services,id',
            ],

            'source_id' => [
                'nullable',
                'integer',
                'exists:lead_sources,id',
            ],

            'status' => [
                'nullable',
                'in:new,contacted,qualified,proposal,negotiation,converted,lost',
            ],

            'priority' => [
                'nullable',
                'in:low,medium,high,urgent',
            ],

            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'estimated_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            'next_follow_up_at' => [
                'nullable',
                'date',
            ],

            'lost_reason' => [
                'nullable',
                'string',
            ],
        ];
    }
}