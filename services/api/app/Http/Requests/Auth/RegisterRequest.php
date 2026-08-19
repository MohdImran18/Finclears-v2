<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => ['required','string','max:255'],

            'email' => ['required','email','unique:users,email'],

            'mobile' => ['required','digits:10','unique:users,mobile'],

            'password' => ['required','confirmed','min:8'],

        ];
    }
}
