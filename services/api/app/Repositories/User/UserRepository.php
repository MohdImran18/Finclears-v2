<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserRepository
{
    /**
     * List Users
     */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['search'])) {

            $search = trim($filters['search']);

            $query->where(function ($q) use ($search) {

                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");

            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query
            ->latest()
            ->paginate(
                $filters['per_page'] ?? 15
            );
    }

    /**
     * Find User
     */
    public function find(int|string $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Create User
     */
    public function create(array $data): User
    {
        if (!empty($data['avatar'])) {

            $data['avatar'] = $data['avatar']->store(
                'users',
                'public'
            );
        }

        $data['password'] = Hash::make(
            $data['password']
        );

        return User::create($data);
    }

    /**
     * Update User
     */
    public function update(User $user, array $data): User
    {
        if (!empty($data['avatar'])) {

            if ($user->avatar) {

                Storage::disk('public')
                    ->delete($user->avatar);
            }

            $data['avatar'] = $data['avatar']->store(
                'users',
                'public'
            );
        }

        if (empty($data['password'])) {

            unset($data['password']);
        } else {

            $data['password'] = Hash::make(
                $data['password']
            );
        }

        $user->update($data);

        return $user->fresh();
    }

    /**
     * Delete User
     */
    public function delete(User $user): bool
    {
        if ($user->avatar) {

            Storage::disk('public')
                ->delete($user->avatar);
        }

        return (bool) $user->delete();
    }
}