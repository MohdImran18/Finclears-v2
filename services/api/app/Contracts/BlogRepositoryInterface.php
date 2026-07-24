<?php

namespace App\Contracts;

use App\Models\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BlogRepositoryInterface
{
    /**
     * Paginated blogs.
     */
    public function paginate(
        int $perPage = 10
    ): LengthAwarePaginator;

    /**
     * Featured blogs.
     */
    public function featured(): Collection;

    /**
     * Blog categories.
     */
    public function categories(): Collection;

    /**
     * Search blogs.
     */
    public function search(
        string $keyword,
        int $perPage = 10
    ): LengthAwarePaginator;

    /**
     * Find blog by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Blog;
}