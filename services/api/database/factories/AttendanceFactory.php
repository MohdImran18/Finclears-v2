<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\EmployeeProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        return [
            'employee_profile_id' => EmployeeProfile::factory(),
            'attendance_date' => fake()->date(),
            'status' => 'present',
        ];
    }
}