<?php

namespace App\Http\Controllers\Api;

use App\Contracts\NewsletterServiceInterface;
use App\Http\Requests\NewsletterRequest;
use App\Http\Resources\NewsletterResource;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends BaseController
{
    public function __construct(
        protected NewsletterServiceInterface $newsletter
    ) {
    }

    /**
     * List Subscribers
     */
    public function index(Request $request): JsonResponse
    {
        return $this->success([
            'subscribers' => NewsletterResource::collection(
                $this->newsletter->paginate(
                    (int) $request->get('per_page', 20)
                )
            ),
        ]);
    }

    /**
     * Subscribe
     */
    public function subscribe(
        NewsletterRequest $request
    ): JsonResponse {

        $subscriber = $this->newsletter->subscribe(
            $request->validated()
        );

        return $this->success([
            'subscriber' => new NewsletterResource(
                $subscriber
            ),
        ], 'Subscribed successfully.');
    }

    /**
     * Show Subscriber
     */
    public function show(
        NewsletterSubscriber $newsletter
    ): JsonResponse {

        return $this->success([
            'subscriber' => new NewsletterResource(
                $newsletter
            ),
        ]);
    }

    /**
     * Delete Subscriber
     */
    public function destroy(
        NewsletterSubscriber $newsletter
    ): JsonResponse {

        $this->newsletter->delete($newsletter);

        return $this->success(
            [],
            'Subscriber deleted successfully.'
        );
    }
}