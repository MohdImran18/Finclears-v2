<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\ApiController;
use App\Http\Requests\ITR\StoreItrReturnRequest;
use App\Http\Requests\ITR\UpdateItrReturnRequest;
use App\Http\Resources\ItrReturnResource;
use App\Services\ITR\ItrReturnService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ItrReturnController extends ApiController
{
    public function __construct(
        protected ItrReturnService $service
    ) {
    }

    /**
     * List Returns
     */
    public function index(): JsonResponse
    {
        return $this->success(
            ItrReturnResource::collection(
                $this->service->getAll()
            ),
            'ITR Returns fetched successfully.'
        );
    }

    /**
     * Find Existing Draft Return
     */
    public function existing(
        StoreItrReturnRequest $request
    ): JsonResponse {
        $return = $this->service->findExistingDraft(
            $request->validated()
        );

        if (!$return) {
            return $this->success(
                null,
                'No existing draft found.'
            );
        }

        return $this->success(
            new ItrReturnResource($return),
            'Existing draft found.'
        );
    }

    /**
     * Create Draft Return
     */
    public function store(
        StoreItrReturnRequest $request
    ): JsonResponse {
        $return = $this->service->createReturn(
            $request->validated()
        );

        return $this->success(
            new ItrReturnResource($return),
            'ITR Draft created successfully.',
            201
        );
    }

    /**
     * Show Single Return
     */
    public function show(
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        return $this->success(
            new ItrReturnResource($return),
            'ITR Return fetched successfully.'
        );
    }

    /**
     * Update Return
     */
    public function update(
        UpdateItrReturnRequest $request,
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        $this->service->updateReturn(
            $return->id,
            $request->validated()
        );

        return $this->success(
            new ItrReturnResource(
                $return->fresh()
            ),
            'ITR updated successfully.'
        );
    }

    /**
     * Delete Return
     */
    public function destroy(
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        $this->service->deleteReturn(
            $return->id
        );

        return $this->success(
            [],
            'ITR deleted successfully.'
        );
    }

    /**
     * Calculate Tax
     */
    public function calculateTax(
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        return $this->success(
            $this->service->calculateTax($return),
            'Tax calculated successfully.'
        );
    }

    /**
     * Validate ITR Return through Sandbox ERI.
     */
    public function validate(
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        $result = $this->service->validateReturn($return);

        return $this->success(
            $result,
            $result['message'] ?? 'ITR validation completed.'
        );
    }

    /**
     * Download PDF
     */
    public function download(
        string $uuid
    ): BinaryFileResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        return $this->service->downloadPdf($return);
    }

    /**
     * Submit Return
     */
    public function submit(
        string $uuid
    ): JsonResponse {
        $return = $this->service->findByUuid($uuid);

        abort_if(
            !$return,
            404,
            'ITR Return not found.'
        );

        $this->service->submitReturn($return);

        return $this->success(
            new ItrReturnResource(
                $return->fresh()
            ),
            'ITR submitted successfully.'
        );
    }
}