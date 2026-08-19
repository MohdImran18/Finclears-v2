<?php

namespace App\Contracts\Repositories;

use App\Models\ReturnStatus;

interface ReturnStatusRepositoryInterface extends RepositoryInterface
{
    public function findByCode(string $code): ?ReturnStatus;
}