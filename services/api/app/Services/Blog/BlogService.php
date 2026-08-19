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

    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return $this->blogs->paginate($perPage);
    }

    public function featured(): Collection
    {
        return $this->blogs->featured();
    }

    public function categories(): Collection
    {
        return $this->blogs->categories();
    }

    public function search(
        string $keyword,
        int $perPage = 10
    ): LengthAwarePaginator {
        return $this->blogs->search(
            $keyword,
            $perPage
        );
    }

    public function findBySlug(string $slug): ?Blog
    {
        return $this->blogs->findBySlug($slug);
    }

    public function find(int $id): ?Blog
    {
        return $this->blogs->findById($id);
    }

    public function adminPaginate(
        int $perPage = 15,
        ?string $search = null,
        ?bool $status = null,
        ?bool $featured = null
    ): LengthAwarePaginator {
        return $this->blogs->adminPaginate(
            $perPage,
            $search,
            $status,
            $featured
        );
    }

    public function create(array $data): Blog
    {
        return $this->blogs->create($data);
    }

    public function update(int $id, array $data): Blog
    {
        return $this->blogs->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->blogs->delete($id);
    }
}