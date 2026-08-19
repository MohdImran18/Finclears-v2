<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceProcessRequest;
use App\Http\Requests\Service\UpdateServiceProcessRequest;
use App\Models\Service;
use App\Models\ServiceProcess;
use Illuminate\Http\JsonResponse;

class ServiceProcessAdminController extends Controller
{
    /**
     * List all processes for a service.
     */
    public function index(Service $service): JsonResponse
    {
        $processes = $service->processes()
            ->orderBy('sort_order')
            ->orderBy('step_number')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => [
                'processes' => $processes,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Show a single process.
     */
    public function show(
        Service $service,
        ServiceProcess $process
    ): JsonResponse {
        $this->ensureBelongsToService($service, $process);

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => [
                'process' => $process,
            ],
            'meta' => [],
        ]);
    }

    /**
     * Create a process.
     */
    public function store(
        StoreServiceProcessRequest $request,
        Service $service
    ): JsonResponse {
        $process = $service->processes()->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service process created successfully.',
            'data' => [
                'process' => $process,
            ],
            'meta' => [],
        ], 201);
    }

    /**
     * Update a process.
     */
    public function update(
        UpdateServiceProcessRequest $request,
        Service $service,
        ServiceProcess $process
    ): JsonResponse {
        $this->ensureBelongsToService($service, $process);

        $process->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service process updated successfully.',
            'data' => [
                'process' => $process->fresh(),
            ],
            'meta' => [],
        ]);
    }

    /**
     * Delete a process.
     */
    public function destroy(
        Service $service,
        ServiceProcess $process
    ): JsonResponse {
        $this->ensureBelongsToService($service, $process);

        $process->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service process deleted successfully.',
            'data' => [],
            'meta' => [],
        ]);
    }

    /**
     * Ensure the process belongs to the requested service.
     */
    protected function ensureBelongsToService(
        Service $service,
        ServiceProcess $process
    ): void {
        abort_unless(
            (int) $process->service_id === (int) $service->id,
            404
        );
    }
}
