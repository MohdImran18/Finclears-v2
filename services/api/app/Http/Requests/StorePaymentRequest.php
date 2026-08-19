<?php

namespace App\Http\Requests;

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

            'itr_return_id' => [
                'required',
                'exists:itr_returns,id',
            ],

            'amount' => [
                'required',
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