<?php

namespace App\Repositories;

use App\Contracts\BlogRepositoryInterface;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogRepository implements BlogRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Blog::query()
            ->with([
                'category',
                'tags',
            ])
            ->where('status', true)
            ->latest('published_at')
            ->paginate($perPage);
    }

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

    public function categories(): Collection
    {
        return BlogCategory::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->get();
    }

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
                        $q->where('title', 'like', "%{$keyword}%")
                            ->orWhere('excerpt', 'like', "%{$keyword}%")
                            ->orWhere('content', 'like', "%{$keyword}%");
                    });
                }
            )
            ->latest('published_at')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Blog
    {
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

    public function findById(int $id): ?Blog
    {
        return Blog::query()
            ->with([
                'category',
                'tags',
                'comments',
            ])
            ->find($id);
    }

    public function adminPaginate(
        int $perPage = 15,
        ?string $search = null,
        ?bool $status = null,
        ?bool $featured = null
    ): LengthAwarePaginator {
        return Blog::query()
            ->with([
                'category',
                'tags',
            ])
            ->when(
                $search,
                function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('excerpt', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $status !== null,
                fn ($query) => $query->where('status', $status)
            )
            ->when(
                $featured !== null,
                fn ($query) => $query->where('is_featured', $featured)
            )
            ->latest('created_at')
            ->paginate($perPage);
    }

    public function create(array $data): Blog
    {
        $blog = Blog::create($data);

        return $blog->fresh([
            'category',
            'tags',
        ]);
    }

    public function update(int $id, array $data): Blog
    {
        $blog = Blog::query()->findOrFail($id);

        $blog->update($data);

        return $blog->fresh([
            'category',
            'tags',
        ]);
    }

    public function delete(int $id): bool
    {
        $blog = Blog::query()->findOrFail($id);

        return (bool) $blog->delete();
    }
}