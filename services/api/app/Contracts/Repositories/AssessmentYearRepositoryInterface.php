<?php

namespace App\Contracts\Repositories;

use App\Models\AssessmentYear;

interface AssessmentYearRepositoryInterface extends RepositoryInterface
{
    public function findByName(string $name): ?AssessmentYear;

    public function getActive(): array;
}