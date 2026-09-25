<?php

namespace App\Http\Controllers;

use App\Models\EmployeeProfile;
use App\Models\EmployeeShiftAssignment;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EmployeeShiftAssignmentController extends Controller
{
    /**
     * List shift assignments.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EmployeeShiftAssignment::query()
            ->with([
                'employeeProfile:id,employee_code,user_id',
                'employeeProfile.user:id,name,email',
                'shift',
            ])
            ->orderByDesc('effective_from')
            ->orderByDesc('id');

        if ($request->filled('employee_profile_id')) {
            $query->where(
                'employee_profile_id',
                $request->integer('employee_profile_id')
            );
        }

        if ($request->filled('shift_id')) {
            $query->where(
                'shift_id',
                $request->integer('shift_id')
            );
        }

        if ($request->has('is_current')) {
            $query->where(
                'is_current',
                $request->boolean('is_current')
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee shift assignments retrieved successfully.',
            'data' => $query->get(),
        ]);
    }

    /**
     * Assign a shift to an employee.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_profile_id' => [
                'required',
                'integer',
                'exists:employee_profiles,id',
            ],
            'shift_id' => [
                'required',
                'integer',
                'exists:shifts,id',
            ],
            'effective_from' => [
                'required',
                'date',
            ],
            'effective_to' => [
                'nullable',
                'date',
                'after_or_equal:effective_from',
            ],
            'is_current' => [
                'nullable',
                'boolean',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $employee = EmployeeProfile::findOrFail(
            $validated['employee_profile_id']
        );

        $shift = Shift::findOrFail($validated['shift_id']);

        if (! $shift->is_active) {
            throw ValidationException::withMessages([
                'shift_id' => [
                    'Cannot assign an inactive shift.',
                ],
            ]);
        }

        $effectiveFrom = Carbon::parse(
            $validated['effective_from']
        )->startOfDay();

        $effectiveTo = ! empty($validated['effective_to'])
            ? Carbon::parse($validated['effective_to'])->endOfDay()
            : null;

        $isCurrent = array_key_exists('is_current', $validated)
            ? (bool) $validated['is_current']
            : true;

        /*
         * If this assignment becomes current, close the previous
         * current assignment before creating the new one.
         */
        if ($isCurrent) {
            $previousCurrent = EmployeeShiftAssignment::query()
                ->where('employee_profile_id', $employee->id)
                ->where('is_current', true)
                ->orderByDesc('effective_from')
                ->first();

            if ($previousCurrent) {
                if (
                    $effectiveFrom->lte(
                        Carbon::parse($previousCurrent->effective_from)
                    )
                ) {
                    throw ValidationException::withMessages([
                        'effective_from' => [
                            'The new assignment must start after the existing current assignment start date.',
                        ],
                    ]);
                }

                $previousCurrent->update([
                    'effective_to' => $effectiveFrom
                        ->copy()
                        ->subDay()
                        ->endOfDay(),
                    'is_current' => false,
                ]);
            }
        }

        /*
         * Prevent overlapping assignments for the same employee.
         */
        $overlap = EmployeeShiftAssignment::query()
            ->where('employee_profile_id', $employee->id)
            ->where(function ($query) use (
                $effectiveFrom,
                $effectiveTo
            ) {
                $query
                    ->where(function ($q) use (
                        $effectiveFrom,
                        $effectiveTo
                    ) {
                        $q->whereNull('effective_to')
                            ->where('effective_from', '<=', $effectiveTo ?? $effectiveFrom);
                    })
                    ->orWhere(function ($q) use (
                        $effectiveFrom,
                        $effectiveTo
                    ) {
                        $q->whereNotNull('effective_to')
                            ->where('effective_from', '<=', $effectiveTo ?? $effectiveFrom)
                            ->where('effective_to', '>=', $effectiveFrom);
                    });
            })
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'effective_from' => [
                    'This employee already has a shift assignment covering the selected date range.',
                ],
            ]);
        }

        $assignment = EmployeeShiftAssignment::create([
            'employee_profile_id' => $employee->id,
            'shift_id' => $shift->id,
            'effective_from' => $effectiveFrom->toDateString(),
            'effective_to' => $effectiveTo?->toDateString(),
            'is_current' => $isCurrent,
            'notes' => $validated['notes'] ?? null,
        ]);

        $assignment->load([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
            'shift',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shift assigned to employee successfully.',
            'data' => $assignment,
        ], 201);
    }

    /**
     * Show one assignment.
     */
    public function show(int $id): JsonResponse
    {
        $assignment = EmployeeShiftAssignment::with([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
            'shift',
        ])->find($id);

        if (! $assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Employee shift assignment not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee shift assignment retrieved successfully.',
            'data' => $assignment,
        ]);
    }

    /**
     * Current shift of an employee.
     */
    public function current(int $employeeProfileId): JsonResponse
    {
        $assignment = EmployeeShiftAssignment::query()
            ->with(['shift'])
            ->where('employee_profile_id', $employeeProfileId)
            ->where('is_current', true)
            ->whereDate('effective_from', '<=', now()->toDateString())
            ->where(function ($query) {
                $query->whereNull('effective_to')
                    ->orWhereDate(
                        'effective_to',
                        '>=',
                        now()->toDateString()
                    );
            })
            ->orderByDesc('effective_from')
            ->first();

        if (! $assignment) {
            return response()->json([
                'success' => true,
                'message' => 'No current shift assignment found.',
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Current employee shift retrieved successfully.',
            'data' => $assignment,
        ]);
    }

    /**
     * Employee shift assignment history.
     */
    public function history(int $employeeProfileId): JsonResponse
    {
        EmployeeProfile::findOrFail($employeeProfileId);

        $assignments = EmployeeShiftAssignment::query()
            ->with(['shift'])
            ->where('employee_profile_id', $employeeProfileId)
            ->orderByDesc('effective_from')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Employee shift history retrieved successfully.',
            'data' => $assignments,
        ]);
    }

    /**
     * Update an assignment.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $assignment = EmployeeShiftAssignment::find($id);

        if (! $assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Employee shift assignment not found.',
            ], 404);
        }

        $validated = $request->validate([
            'shift_id' => [
                'sometimes',
                'integer',
                'exists:shifts,id',
            ],
            'effective_from' => [
                'sometimes',
                'date',
            ],
            'effective_to' => [
                'nullable',
                'date',
            ],
            'is_current' => [
                'sometimes',
                'boolean',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        if (isset($validated['shift_id'])) {
            $shift = Shift::findOrFail($validated['shift_id']);

            if (! $shift->is_active) {
                throw ValidationException::withMessages([
                    'shift_id' => [
                        'Cannot assign an inactive shift.',
                    ],
                ]);
            }
        }

        if (
            isset($validated['effective_from']) &&
            isset($validated['effective_to']) &&
            $validated['effective_to'] !== null &&
            Carbon::parse($validated['effective_to'])
                ->lt(Carbon::parse($validated['effective_from']))
        ) {
            throw ValidationException::withMessages([
                'effective_to' => [
                    'Effective-to date must be on or after effective-from date.',
                ],
            ]);
        }

        $assignment->update($validated);

        $assignment->load([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
            'shift',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee shift assignment updated successfully.',
            'data' => $assignment,
        ]);
    }

    /**
     * Delete an assignment.
     */
    public function destroy(int $id): JsonResponse
    {
        $assignment = EmployeeShiftAssignment::find($id);

        if (! $assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Employee shift assignment not found.',
            ], 404);
        }

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee shift assignment deleted successfully.',
        ]);
    }
}