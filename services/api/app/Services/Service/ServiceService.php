<?php

namespace App\Services\Service;

use App\Contracts\ServiceRepositoryInterface;
use App\Contracts\ServiceServiceInterface;
use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ServiceService implements ServiceServiceInterface
{
    public function __construct(
        protected ServiceRepositoryInterface $services
    ) {
    }

    /**
     * Paginated services.
     */
    public function paginate(
        int $perPage = 12
    ): LengthAwarePaginator
    {
        return $this->services->paginate($perPage);
    }

    /**
     * Featured services.
     */
    public function featured(): Collection
    {
        return $this->services->featured();
    }

    /**
     * Service categories.
     */
    public function categories(): Collection
    {
        return $this->services->categories();
    }

    /**
     * Search services.
     */
    public function search(
        string $keyword,
        int $perPage = 12
    ): LengthAwarePaginator
    {
        return $this->services->search(
            $keyword,
            $perPage
        );
    }

    /**
     * Find service by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Service
    {
        return $this->services->findBySlug(
            $slug
        );
    }
}