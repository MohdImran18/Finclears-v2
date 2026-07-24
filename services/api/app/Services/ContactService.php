<?php

namespace App\Services;

use App\Contracts\ContactServiceInterface;
use App\Models\ContactMessage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactService implements ContactServiceInterface
{
    /**
     * Store Contact Message
     */
    public function create(array $data): ContactMessage
    {
        return ContactMessage::create($data);
    }

    /**
     * Paginated Messages
     */
    public function paginate(
        int $perPage = 20
    ): LengthAwarePaginator
    {
        return ContactMessage::latest()
            ->paginate($perPage);
    }

    /**
     * Find Message
     */
    public function find(
        int $id
    ): ?ContactMessage
    {
        return ContactMessage::find($id);
    }

    /**
     * Mark As Read
     */
    public function markAsRead(
        ContactMessage $message
    ): ContactMessage
    {
        $message->update([
            'status' => 'read',
        ]);

        return $message;
    }

    /**
     * Delete Message
     */
    public function delete(
        ContactMessage $message
    ): bool
    {
        return $message->delete();
    }
}