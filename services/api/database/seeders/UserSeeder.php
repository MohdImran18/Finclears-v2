<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'superadmin@finclears.com',
            ],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Super Admin',
                'phone' => '9999999999',
                'password' => Hash::make('Password@123'),
                'role' => User::ROLE_SUPER_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        User::factory()->count(3)->admin()->create();

        User::factory()->count(10)->employee()->create();

        User::factory()->count(20)->client()->create();
    }
}