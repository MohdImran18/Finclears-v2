<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends BaseController
{
    public function __construct(
        protected UserService $service
    ) {
    }

    /**
     * Display users.
     */
    public function index(): JsonResponse
    {
        $users = $this->service->paginate();

        return $this->success(
            new UserCollection($users),
            'Users fetched successfully.'
        );
    }

    /**
     * Store user.
     */
    public function store(
        StoreUserRequest $request
    ): JsonResponse {

        $user = $this->service->create(
            $request->validated()
        );

        return $this->success(
            new UserResource($user),
            'User created successfully.',
            201
        );
    }

    /**
     * Display user.
     */
    public function show(
        int $id
    ): JsonResponse {

        $user = $this->service->find($id);

        return $this->success(
            new UserResource($user),
            'User fetched successfully.'
        );
    }

    /**
     * Update user.
     */
    public function update(
        UpdateUserRequest $request,
        int $id
    ): JsonResponse {

        $user = $this->service->update(
            $id,
            $request->validated()
        );

        return $this->success(
            new UserResource($user),
            'User updated successfully.'
        );
    }

    /**
     * Delete user.
     */
    public function destroy(
        int $id
    ): JsonResponse {

        $this->service->delete($id);

        return $this->success(
            [],
            'User deleted successfully.'
        );
    }
}