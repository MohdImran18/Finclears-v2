<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'itr_return_uuid' => [
                'required',
                'exists:itr_returns,uuid',
            ],

            'amount' => [
                'nullable',
                'numeric',
                'min:1',
            ],

            'currency' => [
                'nullable',
                'string',
                'max:10',
            ],
        ];
    }
}
