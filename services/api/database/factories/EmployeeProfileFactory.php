<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Designation;
use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeProfileFactory extends Factory
{
    protected $model = EmployeeProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'department_id' => null,
            'designation_id' => null,
            'employee_code' => 'EMP' . fake()->unique()->numerify('#####'),
            'date_of_joining' => fake()->date(),
            'date_of_birth' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'employment_type' => 'full_time',
            'work_location' => fake()->city(),
            'reporting_manager_id' => null,
            'personal_email' => fake()->unique()->safeEmail(),
            'personal_phone' => fake()->numerify('9#########'),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'pincode' => fake()->numerify('######'),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->numerify('9#########'),
            'emergency_contact_relation' => 'parent',
            'pan_number' => null,
            'aadhaar_number' => null,
            'bank_account_number' => null,
            'bank_name' => null,
            'ifsc_code' => null,
            'account_holder_name' => null,
            'status' => 'active',
            'notes' => null,
        ];
    }
}
