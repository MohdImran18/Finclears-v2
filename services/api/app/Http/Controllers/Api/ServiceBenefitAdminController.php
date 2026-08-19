<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceBenefitRequest;
use App\Http\Requests\Service\UpdateServiceBenefitRequest;
use App\Models\Service;
use App\Models\ServiceBenefit;
use Illuminate\Http\JsonResponse;

class ServiceBenefitAdminController extends BaseController
{
    /**
     * List service benefits.
     */
    public function index(int $service): JsonResponse
    {
        $serviceModel = Service::find($service);

        if (!$serviceModel) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $benefits = $serviceModel->benefits()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'benefits' => $benefits,
        ]);
    }

    /**
     * Create service benefit.
     */
    public function store(
        StoreServiceBenefitRequest $request,
        int $service
    ): JsonResponse {
        $serviceModel = Service::find($service);

        if (!$serviceModel) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $data = $request->validated();

        $data['service_id'] = $serviceModel->id;

        $benefit = ServiceBenefit::create($data);

        return $this->success(
            [
                'benefit' => $benefit,
            ],
            'Service benefit created successfully.',
            201
        );
    }

    /**
     * Show service benefit.
     */
    public function show(
        int $service,
        int $benefit
    ): JsonResponse {
        $serviceModel = Service::find($service);

        if (!$serviceModel) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $benefitModel = $serviceModel->benefits()
            ->whereKey($benefit)
            ->first();

        if (!$benefitModel) {
            return $this->error(
                'Service benefit not found.',
                404
            );
        }

        return $this->success([
            'benefit' => $benefitModel,
        ]);
    }

    /**
     * Update service benefit.
     */
    public function update(
        UpdateServiceBenefitRequest $request,
        int $service,
        int $benefit
    ): JsonResponse {
        $serviceModel = Service::find($service);

        if (!$serviceModel) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $benefitModel = $serviceModel->benefits()
            ->whereKey($benefit)
            ->first();

        if (!$benefitModel) {
            return $this->error(
                'Service benefit not found.',
                404
            );
        }

        $data = $request->validated();

        unset($data['service_id']);

        $benefitModel->update($data);

        return $this->success(
            [
                'benefit' => $benefitModel->fresh(),
            ],
            'Service benefit updated successfully.'
        );
    }

    /**
     * Delete service benefit.
     */
    public function destroy(
        int $service,
        int $benefit
    ): JsonResponse {
        $serviceModel = Service::find($service);

        if (!$serviceModel) {
            return $this->error(
                'Service not found.',
                404
            );
        }

        $benefitModel = $serviceModel->benefits()
            ->whereKey($benefit)
            ->first();

        if (!$benefitModel) {
            return $this->error(
                'Service benefit not found.',
                404
            );
        }

        $benefitModel->delete();

        return $this->success(
            [],
            'Service benefit deleted successfully.'
        );
    }
}