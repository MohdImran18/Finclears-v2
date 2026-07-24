<?php

namespace App\Services\User;

use App\Models\User;
use App\Repositories\User\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UserService
{
    public function __construct(
        protected UserRepository $repository
    ) {
    }

    /**
     * List Users
     */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->paginate($filters);
    }

    /**
     * Find User
     */
    public function find(int|string $id): User
    {
        return $this->repository->find($id);
    }

    /**
     * Create User
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {

            return $this->repository->create($data);

        });
    }

    /**
     * Update User
     */
    public function update(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {

            return $this->repository->update($user, $data);

        });
    }

    /**
     * Delete User
     */
    public function delete(User $user, ?User $loggedInUser = null): bool
    {
        if ($loggedInUser && $loggedInUser->id === $user->id) {
            throw new RuntimeException(
                'You cannot delete your own account.'
            );
        }

        if ($user->role === User::ROLE_ADMIN) {

            $adminCount = User::where(
                'role',
                User::ROLE_ADMIN
            )->count();

            if ($adminCount <= 1) {
                throw new RuntimeException(
                    'At least one administrator must remain.'
                );
            }
        }

        return DB::transaction(function () use ($user) {

            return $this->repository->delete($user);

        });
    }
}