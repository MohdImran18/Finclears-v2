<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => [
                'required',
                'string',
                'max:255',
            ],

            'value' => [
                'nullable',
                'string',
            ],

            'type' => [
                'required',
                'in:string,text,boolean,number,json',
            ],

            'group' => [
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'key' => trim((string) $this->key),
            'group' => trim((string) $this->group),
        ]);
    }
}