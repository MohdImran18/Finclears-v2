<?php

namespace App\Services;

use App\Contracts\NewsletterServiceInterface;
use App\Models\NewsletterSubscriber;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NewsletterService implements NewsletterServiceInterface
{
    /**
     * Subscribe
     */
    public function subscribe(
    array $data
): NewsletterSubscriber {

    return NewsletterSubscriber::updateOrCreate(

        [
            'email' => $data['email'],
        ],

        [
            'status' => true,

            'subscribed_at' => now(),

            'unsubscribed_at' => null,
        ]

    );

}

    /**
     * List
     */
    public function paginate(
        int $perPage = 20
    ): LengthAwarePaginator {

        return NewsletterSubscriber::latest()
            ->paginate($perPage);
    }

    /**
     * Find
     */
    public function find(
        int $id
    ): ?NewsletterSubscriber {

        return NewsletterSubscriber::find($id);
    }

    /**
     * Delete
     */
    public function delete(
        NewsletterSubscriber $subscriber
    ): bool {

        return $subscriber->delete();
    }
}