<?php

namespace App\Contracts;

use App\Models\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BlogServiceInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function featured(): Collection;

    public function categories(): Collection;

    public function search(
        string $keyword,
        int $perPage = 10
    ): LengthAwarePaginator;

    public function findBySlug(string $slug): ?Blog;

    public function find(int $id): ?Blog;

    public function adminPaginate(
        int $perPage = 15,
        ?string $search = null,
        ?bool $status = null,
        ?bool $featured = null
    ): LengthAwarePaginator;

    public function create(array $data): Blog;

    public function update(int $id, array $data): Blog;

    public function delete(int $id): bool;
}