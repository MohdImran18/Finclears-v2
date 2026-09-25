<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.edit') === true;
    }

    public function rules(): array
    {
        return [
            'comment' => [
                'required',
                'string',
                'min:1',
                'max:10000',
            ],
        ];
    }
}