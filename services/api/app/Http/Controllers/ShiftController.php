<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShiftController extends Controller
{
    /**
     * List all shifts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Shift::query()
            ->orderBy('is_active', 'desc')
            ->orderBy('name');

        if ($request->filled('active')) {
            $query->where(
                'is_active',
                $request->boolean('active')
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Shifts retrieved successfully.',
            'data' => $query->get(),
        ]);
    }

    /**
     * Create a shift.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:50', 'unique:shifts,code'],

            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],

            'break_duration_minutes' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'grace_period_minutes' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'minimum_working_hours' => [
                'nullable',
                'numeric',
                'min:0',
                'max:24',
            ],

            'overtime_eligible' => [
                'nullable',
                'boolean',
            ],

            'overtime_after_hours' => [
                'nullable',
                'numeric',
                'min:0',
                'max:24',
            ],

            'cross_midnight' => [
                'nullable',
                'boolean',
            ],

            'is_active' => [
                'nullable',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $shift = Shift::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'break_duration_minutes' =>
                $validated['break_duration_minutes'] ?? 0,
            'grace_period_minutes' =>
                $validated['grace_period_minutes'] ?? 0,
            'minimum_working_hours' =>
                $validated['minimum_working_hours'] ?? 0,
            'overtime_eligible' =>
                $validated['overtime_eligible'] ?? false,
            'overtime_after_hours' =>
                $validated['overtime_after_hours'] ?? null,
            'cross_midnight' =>
                $validated['cross_midnight'] ?? false,
            'is_active' =>
                $validated['is_active'] ?? true,
            'description' =>
                $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shift created successfully.',
            'data' => $shift,
        ], 201);
    }

    /**
     * Show one shift.
     */
    public function show(int $id): JsonResponse
    {
        $shift = Shift::find($id);

        if (! $shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Shift retrieved successfully.',
            'data' => $shift,
        ]);
    }

    /**
     * Update a shift.
     */
    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $shift = Shift::find($id);

        if (! $shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('shifts', 'code')->ignore($shift->id),
            ],

            'start_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'break_duration_minutes' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'grace_period_minutes' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'minimum_working_hours' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'max:24',
            ],

            'overtime_eligible' => [
                'sometimes',
                'nullable',
                'boolean',
            ],

            'overtime_after_hours' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'max:24',
            ],

            'cross_midnight' => [
                'sometimes',
                'nullable',
                'boolean',
            ],

            'is_active' => [
                'sometimes',
                'nullable',
                'boolean',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ]);

        $shift->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shift updated successfully.',
            'data' => $shift->fresh(),
        ]);
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggle(int $id): JsonResponse
    {
        $shift = Shift::find($id);

        if (! $shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift not found.',
            ], 404);
        }

        $shift->update([
            'is_active' => ! $shift->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => $shift->is_active
                ? 'Shift activated successfully.'
                : 'Shift deactivated successfully.',
            'data' => $shift->fresh(),
        ]);
    }

    /**
     * Delete a shift.
     */
    public function destroy(int $id): JsonResponse
    {
        $shift = Shift::find($id);

        if (! $shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift not found.',
            ], 404);
        }

        $shift->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shift deleted successfully.',
        ]);
    }
}