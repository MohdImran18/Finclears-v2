<?php

namespace App\Repositories;

use App\Contracts\ServiceRepositoryInterface;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ServiceRepository implements ServiceRepositoryInterface
{
    /**
     * Paginated services.
     */
    public function paginate(
        int $perPage = 12
    ): LengthAwarePaginator {

        return Service::query()

            ->with([
                'category',
                'benefits',
                'processes',
                'documents',
                'pricing',
                'faqs',
            ])

            ->where('status', true)

            ->latest()

            ->paginate($perPage);
    }

    /**
     * Featured services.
     */
    public function featured(): Collection
    {
        return Service::query()

            ->with('category')

            ->where('status', true)

            ->where('is_featured', true)

            ->latest()

            ->take(8)

            ->get();
    }

    /**
     * Service categories.
     */
    public function categories(): Collection
    {
        return ServiceCategory::query()

            ->where('status', true)

            ->orderBy('sort_order')

            ->get();
    }

    /**
     * Search services.
     */
    public function search(
        string $keyword,
        int $perPage = 12
    ): LengthAwarePaginator {

        return Service::query()

            ->with([
                'category',
                'benefits',
                'processes',
                'documents',
                'pricing',
                'faqs',
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
                            'short_description',
                            'like',
                            "%{$keyword}%"
                        )

                        ->orWhere(
                            'description',
                            'like',
                            "%{$keyword}%"
                        );

                    });

                }
            )

            ->latest()

            ->paginate($perPage);
    }

    /**
     * Find service by slug.
     */
    public function findBySlug(
        string $slug
    ): ?Service {

        return Service::query()

            ->with([
                'category',
                'benefits',
                'processes',
                'documents',
                'pricing',
                'faqs',
            ])

            ->where('slug', $slug)

            ->where('status', true)

            ->first();
    }
}