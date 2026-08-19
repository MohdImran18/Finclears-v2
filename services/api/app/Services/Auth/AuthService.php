<?php

namespace App\Services\Auth;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService extends BaseService
{
    /**
     * Register User
     */
    public function register(array $data): array
    {
        $user = User::create([

            'name' => $data['name'],

            'email' => $data['email'],

            'mobile' => $data['mobile'],

            'password' => Hash::make($data['password']),

        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [

            'user' => new UserResource($user),

            'token' => $token,

        ];
    }

    /**
     * Login User
     */
    public function login(array $credentials): array
    {
        if (! Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [

            'user' => new UserResource($user),

            'token' => $token,

        ];
    }

    /**
     * Logout User
     */
    public function logout(User $user): bool
    {
        $user->currentAccessToken()?->delete();

        return true;
    }

    /**
     * Current User
     */
    public function me(User $user): UserResource
    {
        return new UserResource($user);
    }
}
