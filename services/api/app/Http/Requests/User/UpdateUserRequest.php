<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Authorize request.
     */
    public function authorize(): bool
    {
        return true;
        // Later:
        // return $this->user()->can('update', $this->route('user'));
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        $userId = $this->route('user') ?? $this->route('id');

        return [

            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],

            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($userId),
            ],

            'password' => [
                'nullable',
                'confirmed',
                Password::defaults(),
            ],

            'role' => [
                'required',
                Rule::in([
                    'admin',
                    'employee',
                    'client',
                ]),
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                    'blocked',
                ]),
            ],

            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'email.unique' =>
                'Email already exists.',

            'phone.unique' =>
                'Phone number already exists.',

            'password.confirmed' =>
                'Password confirmation does not match.',

        ];
    }

    /**
     * Prepare Data
     */
    protected function prepareForValidation(): void
    {
        $this->merge([

            'name' => trim((string) $this->name),

            'email' => strtolower(
                trim((string) $this->email)
            ),

        ]);
    }
}