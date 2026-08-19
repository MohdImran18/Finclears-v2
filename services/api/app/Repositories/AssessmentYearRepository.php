<?php

namespace App\Repositories;

use App\Contracts\Repositories\AssessmentYearRepositoryInterface;
use App\Models\AssessmentYear;

class AssessmentYearRepository extends BaseRepository implements AssessmentYearRepositoryInterface
{
    public function __construct(
        AssessmentYear $model
    ) {
        $this->model = $model;
    }

    public function findByName(
        string $name
    ): ?AssessmentYear {

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