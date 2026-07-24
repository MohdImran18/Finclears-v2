<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Authorize the request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim((string) $this->email)),
        ]);
    }

    /**
     * Validation Rules.
     */
    public function rules(): array
    {
        return [

            'email' => [
            'required',
            'email',
            'max:255',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'max:100',
            ],

        ];
    }

    /**
     * Custom Validation Messages.
     */
    public function messages(): array
    {
        return [

            'email.required' => 'Email address is required.',

            'email.email' => 'Please enter a valid email address.',

            'email.max' => 'Email address is too long.',

            'password.required' => 'Password is required.',

            'password.min' => 'Password must be at least 8 characters.',

            'password.max' => 'Password is too long.',

        ];
    }

    /**
     * Custom Attribute Names.
     */
    public function attributes(): array
    {
        return [

            'email' => 'email address',

            'password' => 'password',

        ];
    }
}