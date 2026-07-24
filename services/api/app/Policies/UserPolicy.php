<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * View users list.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            User::ROLE_SUPER_ADMIN,
            User::ROLE_ADMIN,
        ]);
    }

    /**
     * View single user.
     */
    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id
            || in_array($user->role, [
                User::ROLE_SUPER_ADMIN,
                User::ROLE_ADMIN,
            ]);
    }

    /**
     * Create user.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            User::ROLE_SUPER_ADMIN,
            User::ROLE_ADMIN,
        ]);
    }

    /**
     * Update user.
     */
    public function update(User $user, User $model): bool
    {
        if ($user->role === User::ROLE_SUPER_ADMIN) {
            return true;
        }

        if ($user->role === User::ROLE_ADMIN) {
            return $model->role !== User::ROLE_SUPER_ADMIN;
        }

        return $user->id === $model->id;
    }

    /**
     * Delete user.
     */
    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return false;
        }

        return in_array($user->role, [
            User::ROLE_SUPER_ADMIN,
            User::ROLE_ADMIN,
        ]);
    }

    /**
     * Restore user.
     */
    public function restore(User $user): bool
    {
        return $user->role === User::ROLE_SUPER_ADMIN;
    }

    /**
     * Permanently delete user.
     */
    public function forceDelete(User $user): bool
    {
        return $user->role === User::ROLE_SUPER_ADMIN;
    }
}