<?php

namespace App\Repositories;

use App\Contracts\Repositories\ItrTypeRepositoryInterface;
use App\Models\ItrType;

class ItrTypeRepository extends BaseRepository implements ItrTypeRepositoryInterface
{
    public function __construct(
        ItrType $model
    ) {
        $this->model = $model;
    }

    public function findByCode(
        string $code
    ): ?ItrType {

        return $this->model
            ->where('code', $code)
            ->first();
    }

    public function getActive(): array
    {
        return $this->model
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->all();
    }
}