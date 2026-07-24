<?php

namespace App\Contracts;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CompanyRepositoryInterface
{
    public function paginate(
        int $perPage=15,
        array $filters=[]
    ):LengthAwarePaginator;

    public function find(
        int|string $id
    ):?Company;

    public function create(
        array $data
    ):Company;

    public function update(
        Company $company,
        array $data
    ):Company;

    public function delete(
        Company $company
    ):bool;
}