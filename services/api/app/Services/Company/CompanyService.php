<?php

namespace App\Services\Company;

use App\Contracts\CompanyRepositoryInterface;
use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CompanyService
{
    public function __construct(
        protected CompanyRepositoryInterface $companies
    ) {
    }

    public function paginate(
        int $perPage = 15,
        array $filters = []
    ): LengthAwarePaginator {
        return $this->companies->paginate(
            $perPage,
            $filters
        );
    }

    public function find(
        int|string $id
    ): Company {

        $company = $this->companies->find($id);

        if (!$company) {
            throw new NotFoundHttpException(
                'Company not found.'
            );
        }

        return $company;
    }

    public function create(
        array $data
    ): Company {

        return DB::transaction(function () use ($data) {

            $data['uuid'] = (string) Str::uuid();

            $data['status'] ??= Company::STATUS_DRAFT;

            return $this->companies->create($data);

        });

    }

    public function update(
        int|string $id,
        array $data
    ): Company {

        return DB::transaction(function () use ($id, $data) {

            return $this->companies->update(
                $this->find($id),
                $data
            );

        });

    }

    public function delete(
        int|string $id
    ): bool {

        return $this->companies->delete(
            $this->find($id)
        );

    }
}