<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use RuntimeException;

class UserController extends BaseController
{
    public function __construct(
        protected UserService $service
    ) {}

    /**
     * List Users
     */
    public function index(Request $request)
    {
        $users = $this->service->paginate(
            $request->only([
                'search',
                'role',
                'status',
                'per_page',
            ])
        );

        return $this->success(

            new UserCollection($users),

            'Users fetched successfully.'

        );
    }

    /**
     * Create User
     */
    public function store(StoreUserRequest $request)
    {
        $user = $this->service->create(
            $request->validated()
        );

        return $this->created(

            new UserResource($user),

            'User created successfully.'

        );
    }

    /**
     * Show User
     */
    public function show(User $user)
    {
        return $this->success(

            new UserResource($user)

        );
    }

    /**
     * Update User
     */
    public function update(
        UpdateUserRequest $request,
        User $user
    ) {
        $user = $this->service->update(
            $user,
            $request->validated()
        );

        return $this->success(

            new UserResource($user),

            'User updated successfully.'

        );
    }

    /**
     * Delete User
     */
    public function destroy(User $user)
    {
        try {

            $this->service->delete(
                $user,
                request()->user()
            );

            return $this->success(

                null,

                'User deleted successfully.'

            );

        } catch (RuntimeException $e) {

            return $this->error(

                $e->getMessage(),

                422

            );
        }
    }
}