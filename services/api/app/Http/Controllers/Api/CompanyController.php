<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\Company\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends BaseController
{
    public function __construct(
        protected CompanyService $companies
    ) {
    }

    /**
     * Company List
     */
    public function index(Request $request): JsonResponse
    {
        $companies = $this->companies->paginate(
            (int) $request->get('per_page', 15),
            $request->all()
        );

        return $this->success([
            'companies' => CompanyResource::collection($companies),
        ]);
    }

    /**
     * Store Company
     */
    public function store(
        StoreCompanyRequest $request
    ): JsonResponse {

        $company = $this->companies->create(
            $request->validated()
        );

        return $this->success(
            [
                'company' => new CompanyResource($company),
            ],
            'Company created successfully.',
            201
        );
    }

    /**
     * Show Company
     */
    public function show(
        int $company
    ): JsonResponse {

        return $this->success([
            'company' => new CompanyResource(
                $this->companies->find($company)
            ),
        ]);
    }

    /**
     * Update Company
     */
    public function update(
        UpdateCompanyRequest $request,
        int $company
    ): JsonResponse {

        $updated = $this->companies->update(
            $company,
            $request->validated()
        );

        return $this->success(
            [
                'company' => new CompanyResource($updated),
            ],
            'Company updated successfully.'
        );
    }

    /**
     * Delete Company
     */
    public function destroy(
        int $company
    ): JsonResponse {

        $this->companies->delete($company);

        return $this->success(
            [],
            'Company deleted successfully.'
        );
    }
}