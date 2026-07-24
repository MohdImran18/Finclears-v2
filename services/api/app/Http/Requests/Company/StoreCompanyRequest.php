<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'user_id'=>['required','exists:users,id'],

            'service_type'=>['required','string','max:100'],

            'company_name'=>['required','string','max:255'],

            'company_type'=>['required','string','max:100'],

            'business_activity'=>['nullable','string'],

            'authorized_capital'=>['required','numeric'],

            'paid_up_capital'=>['required','numeric'],

            'state'=>['required'],

            'city'=>['required'],

            'address'=>['required'],

            'pin_code'=>['required']

        ];
    }
}