<?php

namespace App\Contracts;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ServiceServiceInterface
{
    /**
     * Paginated services.
     */
    public function paginate(
        int $perPage = 12
    ): LengthAwarePaginator;

    /**
     * Featured services.
     */
    public function featured(): Collection;

    /**
     * Service categories.
     */
    public function categories(): Collection;

    /**
     * Search services.
     */
    public function search(
        string $keyword,
        int $perPage = 12
    ): LengthAwarePaginator;

    /**
     * Find service by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Service;
}