<?php

namespace App\Contracts\Repositories;

use App\Models\ItrType;

interface ItrTypeRepositoryInterface extends RepositoryInterface
{
    public function findByCode(string $code): ?ItrType;

    public function getActive(): array;
}