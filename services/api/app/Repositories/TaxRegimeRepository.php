<?php

namespace App\Repositories;

use App\Contracts\Repositories\TaxRegimeRepositoryInterface;
use App\Models\TaxRegime;

class TaxRegimeRepository extends BaseRepository implements TaxRegimeRepositoryInterface
{
    public function __construct(
        TaxRegime $model
    ) {
        $this->model = $model;
    }

    public function findByCode(
        string $code
    ): ?TaxRegime {

        return $this->model
            ->where('code', $code)
            ->first();
    }

    public function getActive(): array
    {
        return $this->model
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->all();
    }
}