<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [

            'uuid' => (string) Str::uuid(),

            'name' => fake()->name(),

            'email' => fake()->unique()->safeEmail(),

            'phone' => fake()->unique()->numerify('98########'),

            'password' => Hash::make('Password@123'),

            'role' => User::ROLE_CLIENT,

            'status' => User::STATUS_ACTIVE,

            'email_verified_at' => now(),

            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => [

            'role' => User::ROLE_ADMIN,

        ]);
    }

    public function superAdmin(): static
    {
        return $this->state(fn () => [

            'role' => User::ROLE_SUPER_ADMIN,

        ]);
    }

    public function employee(): static
    {
        return $this->state(fn () => [

            'role' => User::ROLE_EMPLOYEE,

        ]);
    }

    public function client(): static
    {
        return $this->state(fn () => [

            'role' => User::ROLE_CLIENT,

        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [

            'status' => User::STATUS_INACTIVE,

        ]);
    }
}