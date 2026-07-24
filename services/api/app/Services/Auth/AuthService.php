<?php

namespace App\Services\Auth;

use App\Contracts\AuthServiceInterface;
use App\Contracts\UserRepositoryInterface;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthService implements AuthServiceInterface
{
    private const TOKEN_NAME = 'auth_token';

    public function __construct(
        protected UserRepositoryInterface $users
    ) {
    }

    /**
     * Register new user.
     */
    public function register(RegisterRequest $request): array
    {
        return DB::transaction(function () use ($request) {

            $user = $this->users->create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
                'status'   => User::STATUS_ACTIVE,
            ]);

            // If using Spatie Permission
            $user->assignRole('client');

            $token = $user
                ->createToken(self::TOKEN_NAME)
                ->plainTextToken;

            return [
                'token' => $token,
                'user'  => $user,
            ];
        });
    }

    /**
     * Login.
     */
    public function login(LoginRequest $request): array
    {
        $user = $this->users->findByEmail(
            $request->email
        );

        if (
            ! $user ||
            ! Hash::check(
                $request->password,
                $user->password
            )
        ) {
            throw new HttpException(
                401,
                'Invalid email or password.'
            );
        }

        if ($user->isBlocked()) {
            throw new HttpException(
                403,
                'Your account has been blocked.'
            );
        }

        if (! $user->isActive()) {
            throw new HttpException(
                403,
                'Your account is inactive.'
            );
        }

        // Business rule:
        // Keep only one active login.

        $user->tokens()->delete();

        $user->update([
            'last_login_at' => now(),
        ]);

        $token = $user
            ->createToken(self::TOKEN_NAME)
            ->plainTextToken;

        return [
            'token' => $token,
            'user'  => $user,
        ];
    }

    /**
     * Current user.
     */
    public function me(
        Request $request
    ): User
    {
        return $request->user();
    }

    /**
     * Logout.
     */
    public function logout(
        Request $request
    ): void
    {
        $request
            ->user()
            ?->currentAccessToken()
            ?->delete();
    }
}