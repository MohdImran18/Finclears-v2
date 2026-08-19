<?php

namespace App\Contracts\Repositories;

use App\Models\ItrReturn;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ItrReturnRepositoryInterface
{
    public function findByUuid(string $uuid): ?ItrReturn;

    public function getUserReturns(int $userId): LengthAwarePaginator;

    public function getDraftReturns(): LengthAwarePaginator;

    public function getSubmittedReturns(): LengthAwarePaginator;

    public function getByAssessmentYear(string $assessmentYear): LengthAwarePaginator;

    public function all();

    public function paginate(int $perPage = 15);

    public function find(int|string $id);

    public function findOrFail(int|string $id);

    public function create(array $data);

    public function update(int|string $id, array $data);

    public function delete(int|string $id);
}