<?php

namespace App\Contracts\Repositories;

use App\Models\TaxRegime;

interface TaxRegimeRepositoryInterface extends RepositoryInterface
{
    public function findByCode(string $code): ?TaxRegime;

    public function getActive(): array;
}