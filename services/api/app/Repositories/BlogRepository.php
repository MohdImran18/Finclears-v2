<?php

namespace App\Repositories;

use App\Contracts\BlogRepositoryInterface;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogRepository implements BlogRepositoryInterface
{
    /**
     * Paginated blogs.
     */
    public function paginate(
        int $perPage = 10
    ): LengthAwarePaginator {

        return Blog::query()

            ->with([
                'category',
                'tags',
            ])

            ->where('status', true)

            ->latest('published_at')

            ->paginate($perPage);
    }

    /**
     * Featured blogs.
     */
    public function featured(): Collection
    {
        return Blog::query()

            ->with('category')

            ->where('status', true)

            ->where('is_featured', true)

            ->latest('published_at')

            ->take(6)

            ->get();
    }

    /**
     * Blog categories.
     */
    public function categories(): Collection
    {
        return BlogCategory::query()

            ->where('status', true)

            ->orderBy('sort_order')

            ->get();
    }

    /**
     * Search blogs.
     */
    public function search(
        string $keyword,
        int $perPage = 10
    ): LengthAwarePaginator {

        return Blog::query()

            ->with([
                'category',
                'tags',
            ])

            ->where('status', true)

            ->when(
                $keyword,
                function ($query) use ($keyword) {

                    $query->where(function ($q) use ($keyword) {

                        $q->where(
                            'title',
                            'like',
                            "%{$keyword}%"
                        )

                        ->orWhere(
                            'excerpt',
                            'like',
                            "%{$keyword}%"
                        )

                        ->orWhere(
                            'content',
                            'like',
                            "%{$keyword}%"
                        );

                    });

                }
            )

            ->latest('published_at')

            ->paginate($perPage);
    }

    /**
     * Find blog by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Blog {

        return Blog::query()

            ->with([
                'category',
                'tags',
                'comments',
            ])

            ->where('slug', $slug)

            ->where('status', true)

            ->first();
    }
}