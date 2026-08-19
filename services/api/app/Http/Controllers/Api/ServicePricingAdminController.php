<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServicePricingRequest;
use App\Http\Requests\Service\UpdateServicePricingRequest;
use App\Models\Service;
use App\Models\ServicePricing;
use Illuminate\Http\JsonResponse;

class ServicePricingAdminController extends Controller
{
    /**
     * List pricing plans for a service.
     */
    public function index(Service $service): JsonResponse
    {
        $pricing = $service->pricing()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Service pricing fetched successfully.',
            'data' => [
                'pricing' => $pricing,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Create pricing plan.
     */
    public function store(
        StoreServicePricingRequest $request,
        Service $service
    ): JsonResponse {
        $pricing = $service->pricing()->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service pricing created successfully.',
            'data' => [
                'pricing' => $pricing,
            ],
            'meta' => [],
        ], 201);
    }

    /**
     * Show pricing plan.
     */
    public function show(
        Service $service,
        ServicePricing $pricing
    ): JsonResponse {
        abort_unless(
            $pricing->service_id === $service->id,
            404
        );

        return response()->json([
            'success' => true,
            'message' => 'Service pricing fetched successfully.',
            'data' => [
                'pricing' => $pricing,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Update pricing plan.
     */
    public function update(
        UpdateServicePricingRequest $request,
        Service $service,
        ServicePricing $pricing
    ): JsonResponse {
        abort_unless(
            $pricing->service_id === $service->id,
            404
        );

        $pricing->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service pricing updated successfully.',
            'data' => [
                'pricing' => $pricing->fresh(),
            ],
            'meta' => [],
        ]);
    }

    /**
     * Delete pricing plan.
     */
    public function destroy(
        Service $service,
        ServicePricing $pricing
    ): JsonResponse {
        abort_unless(
            $pricing->service_id === $service->id,
            404
        );

        $pricing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service pricing deleted successfully.',
            'data' => [],
            'meta' => [],
        ]);
    }
}