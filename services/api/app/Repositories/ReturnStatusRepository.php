<?php

namespace App\Repositories;

use App\Contracts\Repositories\ReturnStatusRepositoryInterface;
use App\Models\ReturnStatus;

class ReturnStatusRepository extends BaseRepository implements ReturnStatusRepositoryInterface
{
    public function __construct(
        ReturnStatus $model
    ) {
        $this->model = $model;
    }

    public function findByCode(
        string $code
    ): ?ReturnStatus {

        return $this->model
            ->where('code', $code)
            ->first();
    }
}