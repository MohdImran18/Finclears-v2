<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'designation_id' => [
                'nullable',
                'integer',
                'exists:designations,id',
            ],

            'employee_code' => [
                'required',
                'string',
                'max:50',
                'unique:employee_profiles,employee_code',
            ],

            'date_of_joining' => [
                'nullable',
                'date',
            ],

            'date_of_birth' => [
                'nullable',
                'date',
            ],

            'gender' => [
                'nullable',
                'string',
                'max:30',
            ],

            'employment_type' => [
                'nullable',
                'string',
                'max:50',
            ],

            'work_location' => [
                'nullable',
                'string',
                'max:120',
            ],

            'reporting_manager_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'personal_email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'personal_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'city' => [
                'nullable',
                'string',
                'max:100',
            ],

            'state' => [
                'nullable',
                'string',
                'max:100',
            ],

            'pincode' => [
                'nullable',
                'string',
                'max:20',
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'emergency_contact_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'emergency_contact_relation' => [
                'nullable',
                'string',
                'max:50',
            ],

            'pan_number' => [
                'nullable',
                'string',
                'max:20',
            ],

            'aadhaar_number' => [
                'nullable',
                'string',
                'max:30',
            ],

            'bank_account_number' => [
                'nullable',
                'string',
                'max:50',
            ],

            'bank_name' => [
                'nullable',
                'string',
                'max:120',
            ],

            'ifsc_code' => [
                'nullable',
                'string',
                'max:20',
            ],

            'account_holder_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in(['active', 'inactive']),
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
