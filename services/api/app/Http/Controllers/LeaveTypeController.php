<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeaveTypeController extends Controller
{
    /**
     * List active leave types.
     */
    public function index(): JsonResponse
    {
        $leaveTypes = LeaveType::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leaveTypes,
        ]);
    }

    /**
     * Create a leave type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                'unique:leave_types,code',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'annual_quota' => [
                'required',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'is_paid' => [
                'sometimes',
                'boolean',
            ],
            'requires_approval' => [
                'sometimes',
                'boolean',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $leaveType = LeaveType::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave type created successfully.',
            'data' => $leaveType,
        ], 201);
    }

    /**
     * Show one leave type.
     */
    public function show(int $id): JsonResponse
    {
        $leaveType = LeaveType::find($id);

        if (! $leaveType) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $leaveType,
        ]);
    }

    /**
     * Update a leave type.
     */
    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $leaveType = LeaveType::find($id);

        if (! $leaveType) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('leave_types', 'code')
                    ->ignore($leaveType->id),
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'annual_quota' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'is_paid' => [
                'sometimes',
                'boolean',
            ],
            'requires_approval' => [
                'sometimes',
                'boolean',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $leaveType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave type updated successfully.',
            'data' => $leaveType->fresh(),
        ]);
    }

    /**
     * Delete a leave type.
     */
    public function destroy(int $id): JsonResponse
    {
        $leaveType = LeaveType::find($id);

        if (! $leaveType) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type not found.',
            ], 404);
        }

        if (
            $leaveType->balances()->exists()
            || $leaveType->applications()->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type cannot be deleted because it is already in use.',
            ], 422);
        }

        $leaveType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Leave type deleted successfully.',
        ]);
    }
}