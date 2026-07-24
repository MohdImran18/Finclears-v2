<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim((string) $this->email)),
        ]);
    }

    public function rules(): array
    {
        return [

            'token' => [
                'required',
                'string',
            ],

            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
                'confirmed',
                'min:8',
                'max:100',
            ],

        ];
    }

    public function messages(): array
    {
        return [

            'token.required' => 'Reset token is required.',

            'email.required' => 'Email address is required.',

            'email.email' => 'Please enter a valid email address.',

            'password.required' => 'Password is required.',

            'password.confirmed' => 'Password confirmation does not match.',

            'password.min' => 'Password must be at least 8 characters.',

        ];
    }
}