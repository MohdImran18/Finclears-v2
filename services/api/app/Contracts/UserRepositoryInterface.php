<?php

namespace App\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(
        int $perPage = 15,
        array $filters = []
    ): LengthAwarePaginator;

    public function find(
        int|string $id
    ): ?User;

    public function findByEmail(
        string $email
    ): ?User;

    public function create(
        array $data
    ): User;

    public function update(
        User $user,
        array $data
    ): User;

    public function delete(
        User $user
    ): bool;

    public function restore(
        int|string $id
    ): bool;
}