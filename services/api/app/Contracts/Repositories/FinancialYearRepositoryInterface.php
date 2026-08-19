<?php

namespace App\Contracts\Repositories;

use App\Models\FinancialYear;

interface FinancialYearRepositoryInterface extends RepositoryInterface
{
    public function findByName(string $name): ?FinancialYear;

    public function getActive(): array;
}