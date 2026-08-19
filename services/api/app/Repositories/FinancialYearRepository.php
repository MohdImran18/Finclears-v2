<?php

namespace App\Repositories;

use App\Contracts\Repositories\FinancialYearRepositoryInterface;
use App\Models\FinancialYear;

class FinancialYearRepository extends BaseRepository implements FinancialYearRepositoryInterface
{
    public function __construct(
        FinancialYear $model
    ) {
        $this->model = $model;
    }

    public function findByName(
        string $name
    ): ?FinancialYear {

        return $this->model
            ->where('name', $name)
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