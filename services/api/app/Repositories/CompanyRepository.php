<?php

namespace App\Repositories;

use App\Contracts\CompanyRepositoryInterface;
use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyRepository implements CompanyRepositoryInterface
{
    protected Company $model;

    public function __construct(Company $model)
    {
        $this->model = $model;
    }

    /**
     * Get paginated companies.
     */
    public function paginate(
        int $perPage = 15,
        array $filters = []
    ): LengthAwarePaginator {

        $query = $this->model->newQuery();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['service_type'])) {
            $query->where('service_type', $filters['service_type']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('company_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('uuid', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Find company by ID.
     */
    public function find(
        int|string $id
    ): ?Company {

        return $this->model->find($id);
    }

    /**
     * Create company.
     */
    public function create(
        array $data
    ): Company {

        return $this->model->create($data);
    }

    /**
     * Update company.
     */
    public function update(
        Company $company,
        array $data
    ): Company {

        $company->update($data);

        return $company->fresh();
    }

    /**
     * Delete company.
     */
    public function delete(
        Company $company
    ): bool {

        return (bool) $company->delete();
    }
}