<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\ApiController;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    public function __construct(
        protected AuthService $authService
    ) {
    }

    /**
     * Register User
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {

            $result = $this->authService->register(
                $request->validated()
            );

            return $this->success(
                $result,
                'Registration successful.',
                201
            );

        } catch (\Throwable $e) {

            return $this->error(
                $e->getMessage(),
                500
            );

        }
    }

    /**
     * Login User
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {

            $result = $this->authService->login(
                $request->validated()
            );

            return $this->success(
                $result,
                'Login successful.'
            );

        } catch (ValidationException $e) {

            return $this->error(
                'Invalid credentials.',
                422
            );

        } catch (\Throwable $e) {

            return $this->error(
                $e->getMessage(),
                500
            );

        }
    }

    /**
     * Logout User
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout(
            $request->user()
        );

        return $this->success(
            null,
            'Logout successful.'
        );
    }

    /**
     * Current Logged-in User
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            $this->authService->me(
                $request->user()
            )
        );
    }
}