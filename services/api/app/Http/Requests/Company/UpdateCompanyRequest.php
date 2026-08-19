<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_type' => ['sometimes', 'required', 'string', 'max:100'],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'company_type' => ['sometimes', 'required', 'string', 'max:100'],

            'business_activity' => ['nullable', 'string'],

            'authorized_capital' => ['nullable', 'numeric', 'min:0'],
            'paid_up_capital' => ['nullable', 'numeric', 'min:0'],

            'state' => ['sometimes', 'required', 'string', 'max:100'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'address' => ['sometimes', 'required', 'string'],
            'pin_code' => ['sometimes', 'required', 'string', 'max:10'],

            'cin' => ['nullable', 'string', 'max:255'],
            'llpin' => ['nullable', 'string', 'max:255'],
            'pan_number' => ['nullable', 'string', 'max:255'],
            'tan_number' => ['nullable', 'string', 'max:255'],
            'gst_number' => ['nullable', 'string', 'max:255'],

            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],

            'status' => [
                'sometimes',
                Rule::in([
                    'draft',
                    'pending',
                    'approved',
                    'rejected',
                    'completed',
                ]),
            ],

            'payment_status' => [
                'sometimes',
                Rule::in(['pending', 'paid', 'failed', 'refunded']),
            ],

            'incorporation_date' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
        ];
    }
}
