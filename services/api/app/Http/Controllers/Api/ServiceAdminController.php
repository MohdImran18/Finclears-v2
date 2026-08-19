<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceAdminController extends BaseController
{
    /**
     * Admin Service List
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min(
            max((int) $request->get('per_page', 15), 1),
            100
        );

        $services = Service::query()
            ->with([
                'category',
                'benefits',
                'processes',
                'documents',
                'pricing',
                'faqs',
            ])
            ->when(
                $request->filled('q'),
                function ($query) use ($request) {
                    $keyword = trim(
                        $request->string('q')->toString()
                    );

                    $query->where(function ($q) use ($keyword) {
                        $q->where(
                            'title',
                            'like',
                            "%{$keyword}%"
                        )
                        ->orWhere(
                            'slug',
                            'like',
                            "%{$keyword}%"
                        )
                        ->orWhere(
                            'code',
                            'like',
                            "%{$keyword}%"
                        );
                    });
                }
            )
            ->when(
                $request->has('status'),
                function ($query) use ($request) {
                    $query->where(
                        'status',
                        filter_var(
                            $request->get('status'),
                            FILTER_VALIDATE_BOOLEAN,
                            FILTER_NULL_ON_FAILURE
                        )
                    );
                }
            )
            ->when(
                $request->has('is_featured'),
                function ($query) use ($request) {
                    $query->where(
                        'is_featured',
                        filter_var(
                            $request->get('is_featured'),
                            FILTER_VALIDATE_BOOLEAN
                        )
                    );
                }
            )
            ->when(
                $request->has('is_popular'),
                function ($query) use ($request) {
                    $query->where(
                        'is_popular',
                        filter_var(
                            $request->get('is_popular'),
                            FILTER_VALIDATE_BOOLEAN
                        )
                    );
                }
            )
            ->when(
                $request->filled('service_category_id'),
                function ($query) use ($request) {
                    $query->where(
                        'service_category_id',
                        (int) $request->get('service_category_id')
                    );
                }
            )
            ->orderBy('sort_order')
            ->latest('id')
            ->paginate($perPage);

        return $this->success([
            'services' => ServiceResource::collection($services),
        ]);
    }

    /**
     * Admin Service Details
     */
    public function show(int $service): JsonResponse
    {
        $item = Service::query()
            ->with([
                'category',
                'benefits',
                'processes',
                'documents',
                'pricing',
                'faqs',
            ])
            ->find($service);

        if (!$item) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        return $this->success([
            'service' => new ServiceResource($item),
        ]);
    }

    /**
     * Create Service
     */
    public function store(
        StoreServiceRequest $request
    ): JsonResponse {
        $service = Service::create(
            $request->validated()
        );

        $service->load([
            'category',
            'benefits',
            'processes',
            'documents',
            'pricing',
            'faqs',
        ]);

        return $this->success(
            [
                'service' => new ServiceResource($service),
            ],
            'Service created successfully.',
            201
        );
    }

    /**
     * Update Service
     */
    public function update(
        UpdateServiceRequest $request,
        int $service
    ): JsonResponse {
        $item = Service::find($service);

        if (!$item) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $item->update(
            $request->validated()
        );

        $item->load([
            'category',
            'benefits',
            'processes',
            'documents',
            'pricing',
            'faqs',
        ]);

        return $this->success(
            [
                'service' => new ServiceResource($item),
            ],
            'Service updated successfully.'
        );
    }

    /**
     * Delete Service
     */
    public function destroy(int $service): JsonResponse
    {
        $item = Service::find($service);

        if (!$item) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $item->delete();

        return $this->success(
            [],
            'Service deleted successfully.'
        );
    }
}