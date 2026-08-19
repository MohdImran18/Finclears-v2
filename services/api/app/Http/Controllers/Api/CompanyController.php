<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Models\Company;
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
            $request->all(),
            (int) $request->get('per_page', 15)
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

        $companyModel = \App\Models\Company::findOrFail($company);

        $updated = $this->companies->update(
            $companyModel,
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
     * Submit Company
     */
    public function submit(
        int $company
    ): JsonResponse {

        $companyModel = Company::findOrFail($company);

        $submitted = $this->companies->submit($companyModel);

        return $this->success(
            [
                'company' => new CompanyResource($submitted),
            ],
            'Company submitted successfully.'
        );
    }

    /**
     * Delete Company
     */
    public function destroy(
        int $company
    ): JsonResponse {

        $companyModel = Company::findOrFail($company);

        $this->companies->delete($companyModel);

        return $this->success(
            [],
            'Company deleted successfully.'
        );
    }
}