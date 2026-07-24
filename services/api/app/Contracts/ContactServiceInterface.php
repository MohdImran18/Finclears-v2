<?php

namespace App\Contracts;

use App\Models\ContactMessage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ContactServiceInterface
{
    /**
     * Store Contact Message
     */
    public function create(array $data): ContactMessage;

    /**
     * Paginated Messages
     */
    public function paginate(
        int $perPage = 20
    ): LengthAwarePaginator;

    /**
     * Find Message
     */
    public function find(
        int $id
    ): ?ContactMessage;

    /**
     * Mark as Read
     */
    public function markAsRead(
        ContactMessage $message
    ): ContactMessage;

    /**
     * Delete Message
     */
    public function delete(
        ContactMessage $message
    ): bool;
}