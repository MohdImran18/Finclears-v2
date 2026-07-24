<?php

namespace App\Contracts;

use App\Models\NewsletterSubscriber;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NewsletterServiceInterface
{
    /**
     * Subscribe Email
     */
    public function subscribe(
        array $data
    ): NewsletterSubscriber;

    /**
     * Paginated Subscribers
     */
    public function paginate(
        int $perPage = 20
    ): LengthAwarePaginator;

    /**
     * Find Subscriber
     */
    public function find(
        int $id
    ): ?NewsletterSubscriber;

    /**
     * Delete Subscriber
     */
    public function delete(
        NewsletterSubscriber $subscriber
    ): bool;
}