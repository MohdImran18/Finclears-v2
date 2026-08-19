<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_type' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_type' => ['required', 'string', 'max:100'],

            'business_activity' => ['nullable', 'string'],
            'authorized_capital' => ['nullable', 'numeric', 'min:0'],
            'paid_up_capital' => ['nullable', 'numeric', 'min:0'],

            'state' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string'],
            'pin_code' => ['required', 'string', 'max:10'],

            'cin' => ['nullable', 'string', 'max:255'],
            'llpin' => ['nullable', 'string', 'max:255'],
            'pan_number' => ['nullable', 'string', 'max:255'],
            'tan_number' => ['nullable', 'string', 'max:255'],
            'gst_number' => ['nullable', 'string', 'max:255'],

            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],

            'status' => [
                'nullable',
                Rule::in(['draft', 'pending']),
            ],

            'payment_status' => [
                'nullable',
                Rule::in(['pending', 'paid', 'failed', 'refunded']),
            ],

            'incorporation_date' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],

            /*
             * Directors / Promoters
             */
            'promoters' => ['nullable', 'array'],

            'promoters.*.name' => ['required', 'string', 'max:255'],
            'promoters.*.email' => ['nullable', 'email', 'max:255'],
            'promoters.*.phone' => ['nullable', 'string', 'max:20'],
            'promoters.*.pan' => ['nullable', 'string', 'max:20'],
            'promoters.*.aadhaar' => ['nullable', 'string', 'max:20'],
            'promoters.*.din' => ['nullable', 'string', 'max:50'],
            'promoters.*.designation' => ['nullable', 'string', 'max:100'],

            /*
             * Shareholders
             */
            'shareholders' => ['nullable', 'array'],

            'shareholders.*.name' => ['required', 'string', 'max:255'],
            'shareholders.*.email' => ['nullable', 'email', 'max:255'],
            'shareholders.*.phone' => ['nullable', 'string', 'max:20'],
            'shareholders.*.pan' => ['nullable', 'string', 'max:20'],
            'shareholders.*.shares' => ['required', 'numeric', 'min:0'],
            'shareholders.*.percentage' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
