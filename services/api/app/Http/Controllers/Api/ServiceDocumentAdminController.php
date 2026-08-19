<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceDocumentRequest;
use App\Http\Requests\Service\UpdateServiceDocumentRequest;
use App\Models\Service;
use App\Models\ServiceDocument;
use Illuminate\Http\JsonResponse;

class ServiceDocumentAdminController extends Controller
{
    /**
     * List all documents for a service.
     */
    public function index(Service $service): JsonResponse
    {
        $documents = $service->documents()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => [
                'documents' => $documents,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Show a single document.
     */
    public function show(
        Service $service,
        ServiceDocument $document
    ): JsonResponse {
        $this->ensureBelongsToService($service, $document);

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => [
                'document' => $document,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Create a document.
     */
    public function store(
        StoreServiceDocumentRequest $request,
        Service $service
    ): JsonResponse {
        $document = $service->documents()->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service document created successfully.',
            'data' => [
                'document' => $document,
            ],
            'meta' => [],
        ], 201);
    }

    /**
     * Update a document.
     */
    public function update(
        UpdateServiceDocumentRequest $request,
        Service $service,
        ServiceDocument $document
    ): JsonResponse {
        $this->ensureBelongsToService($service, $document);

        $document->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service document updated successfully.',
            'data' => [
                'document' => $document->fresh(),
            ],
            'meta' => [],
        ]);
    }

    /**
     * Delete a document.
     */
    public function destroy(
        Service $service,
        ServiceDocument $document
    ): JsonResponse {
        $this->ensureBelongsToService($service, $document);

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service document deleted successfully.',
            'data' => [],
            'meta' => [],
        ]);
    }

    /**
     * Ensure the document belongs to the requested service.
     */
    protected function ensureBelongsToService(
        Service $service,
        ServiceDocument $document
    ): void {
        abort_unless(
            (int) $document->service_id === (int) $service->id,
            404
        );
    }
}
