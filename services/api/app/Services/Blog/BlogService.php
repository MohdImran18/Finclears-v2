<?php

namespace App\Services\Blog;

use App\Contracts\BlogRepositoryInterface;
use App\Contracts\BlogServiceInterface;
use App\Models\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogService implements BlogServiceInterface
{
    public function __construct(
        protected BlogRepositoryInterface $blogs
    ) {
    }

    /**
     * Paginated blogs.
     */
    public function paginate(
        int $perPage = 10
    ): LengthAwarePaginator
    {
        return $this->blogs->paginate($perPage);
    }

    /**
     * Featured blogs.
     */
    public function featured(): Collection
    {
        return $this->blogs->featured();
    }

    /**
     * Blog categories.
     */
    public function categories(): Collection
    {
        return $this->blogs->categories();
    }

    /**
     * Search blogs.
     */
    public function search(
        string $keyword,
        int $perPage = 10
    ): LengthAwarePaginator
    {
        return $this->blogs->search(
            $keyword,
            $perPage
        );
    }

    /**
     * Find blog by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Blog
    {
        return $this->blogs->findBySlug($slug);
    }
}