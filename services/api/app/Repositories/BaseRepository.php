<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

use App\Contracts\Repositories\RepositoryInterface;

abstract class BaseRepository implements RepositoryInterface
{
    /**
     * Model Instance
     */
    protected Model $model;

    /**
     * Repository Constructor
     */
    public function __construct(
        Model $model
    ) {
        $this->model = $model;
    }

    /**
     * Get All Records
     */
    public function all(
        array $columns = ['*']
    ): Collection {
        return $this->model->get($columns);
    }

    /**
     * Paginate Records
     */
    public function paginate(
        int $perPage = 15
    ): LengthAwarePaginator {
        return $this->model->paginate($perPage);
    }

    /**
     * Find Record
     */
    public function find(
        int|string $id
    ): ?Model {
        return $this->model->find($id);
    }

    /**
     * Find Or Fail
     */
    public function findOrFail(
        int|string $id
    ): Model {
        return $this->model->findOrFail($id);
    }

    /**
     * Create Record
     */
    public function create(
        array $data
    ): Model {
        return $this->model->create($data);
    }

    /**
     * Update Record
     */
    public function update(
        int|string $id,
        array $data
    ): bool {
        return $this->findOrFail($id)
            ->update($data);
    }

    /**
     * Delete Record
     */
    public function delete(
        int|string $id
    ): bool {
        return (bool) $this->findOrFail($id)
            ->delete();
    }

    /**
     * Restore Record
     */
    public function restore(
        int|string $id
    ): bool {
        return (bool) $this->model
            ->onlyTrashed()
            ->findOrFail($id)
            ->restore();
    }

    /**
     * Force Delete Record
     */
    public function forceDelete(
        int|string $id
    ): bool {
        return (bool) $this->model
            ->onlyTrashed()
            ->findOrFail($id)
            ->forceDelete();
    }
}