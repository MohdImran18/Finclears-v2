<?php

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function paginate(
        int $perPage = 15,
        array $filters = []
    ): LengthAwarePaginator {

        $query = User::query();

        if (!empty($filters['search'])) {

            $query->where(function ($q) use ($filters) {

                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%")
                    ->orWhere('phone', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        return $query
            ->orderBy($sort, $direction)
            ->paginate($perPage);
    }

    public function find(
        int|string $id
    ): ?User {

        return User::find($id);
    }

    public function findByEmail(
        string $email
    ): ?User {

        return User::where('email', $email)->first();
    }

    public function create(
        array $data
    ): User {

        return User::create($data);
    }

    public function update(
        User $user,
        array $data
    ): User {

        $user->update($data);

        return $user->refresh();
    }

    public function delete(
        User $user
    ): bool {

        return (bool) $user->delete();
    }

    public function restore(
        int|string $id
    ): bool {

        $user = User::withTrashed()->findOrFail($id);

        return $user->restore();
    }
}