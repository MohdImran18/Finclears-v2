<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyCollection;
use App\Http\Resources\CompanyResource;
use App\Services\Company\CompanyService;
use Illuminate\Http\JsonResponse;

class CompanyController extends BaseController
{
    public function __construct(
        protected CompanyService $service
    ) {
    }

    public function index(): JsonResponse
    {
        return $this->success(
            new CompanyCollection(
                $this->service->paginate()
            )
        );
    }

    public function show(
        int $id
    ): JsonResponse {

        return $this->success(
            new CompanyResource(
                $this->service->find($id)
            )
        );

    }

    public function store(
        StoreCompanyRequest $request
    ): JsonResponse {

        return $this->success(
            new CompanyResource(
                $this->service->create(
                    $request->validated()
                )
            ),
            "Company created successfully.",
            201
        );

    }

    public function update(
        UpdateCompanyRequest $request,
        int $id
    ): JsonResponse {

        return $this->success(
            new CompanyResource(
                $this->service->update(
                    $id,
                    $request->validated()
                )
            )
        );

    }

    public function destroy(
        int $id
    ): JsonResponse {

        $this->service->delete($id);

        return $this->success(
            [],
            "Company deleted successfully."
        );

    }
}