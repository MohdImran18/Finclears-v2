<?php

namespace App\Http\Controllers\Api;

use App\Contracts\ContactServiceInterface;
use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends BaseController
{
    public function __construct(
        protected ContactServiceInterface $contacts
    ) {
    }

    /**
     * Contact Messages
     */
    public function index(Request $request): JsonResponse
    {
        return $this->success([
            'contacts' => ContactResource::collection(
                $this->contacts->paginate(
                    (int) $request->get('per_page', 20)
                )
            ),
        ]);
    }

    /**
     * Store Contact Message
     */
    public function store(
        ContactRequest $request
    ): JsonResponse {

        $contact = $this->contacts->create([

            ...$request->validated(),

            'ip_address' => $request->ip(),

            'user_agent' => $request->userAgent(),

        ]);

        return $this->success([
            'contact' => new ContactResource($contact),
        ], 'Message sent successfully.');
    }

    /**
     * Show Contact Message
     */
    public function show(
        ContactMessage $contact
    ): JsonResponse {

        return $this->success([
            'contact' => new ContactResource($contact),
        ]);
    }

    /**
     * Delete Contact Message
     */
    public function destroy(
        ContactMessage $contact
    ): JsonResponse {

        $this->contacts->delete($contact);

        return $this->success(
            [],
            'Message deleted successfully.'
        );
    }
}