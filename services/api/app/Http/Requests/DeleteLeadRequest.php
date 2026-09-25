<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.delete') === true;
    }

    public function rules(): array
    {
        return [
            'reason' => [
                'required',
                'string',
                'min:5',
                'max:1000',
            ],
        ];
    }
}