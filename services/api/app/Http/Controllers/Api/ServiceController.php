<?php

namespace App\Http\Controllers\Api;

use App\Contracts\ServiceServiceInterface;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends BaseController
{
    public function __construct(
        protected ServiceServiceInterface $services
    ) {
    }

    /**
     * Service Listing
     */
    public function index(Request $request): JsonResponse
    {
        return $this->success([
            'services' => ServiceResource::collection(
                $this->services->paginate(
                    (int) $request->get('per_page', 12)
                )
            ),
        ]);
    }

    /**
     * Featured Services
     */
    public function featured(): JsonResponse
    {
        return $this->success([
            'services' => ServiceResource::collection(
                $this->services->featured()
            ),
        ]);
    }

    /**
     * Service Categories
     */
    public function categories(): JsonResponse
    {
        return $this->success([
            'categories' => $this->services->categories(),
        ]);
    }

    /**
     * Search Services
     */
    public function search(Request $request): JsonResponse
    {
        return $this->success([
            'services' => ServiceResource::collection(
                $this->services->search(
                    $request->string('q')->toString(),
                    (int) $request->get('per_page', 12)
                )
            ),
        ]);
    }

    /**
     * Service Details
     */
    public function show(string $slug): JsonResponse
    {
        $service = $this->services->findBySlug($slug);

        if (!$service) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        return $this->success([
            'service' => new ServiceResource($service),
        ]);
    }
}