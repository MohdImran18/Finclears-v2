<?php

namespace App\Http\Controllers;

use App\Models\EmployeeLeaveBalance;
use App\Models\EmployeeProfile;
use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class EmployeeLeaveBalanceController extends Controller
{
    /**
     * List leave balances.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EmployeeLeaveBalance::query()
            ->with([
                'employeeProfile:id,employee_code',
                'leaveType:id,name,code,annual_quota,is_paid',
            ])
            ->orderByDesc('year')
            ->orderBy('employee_profile_id')
            ->orderBy('leave_type_id');

        if ($request->filled('employee_profile_id')) {
            $query->where(
                'employee_profile_id',
                $request->integer('employee_profile_id')
            );
        }

        if ($request->filled('leave_type_id')) {
            $query->where(
                'leave_type_id',
                $request->integer('leave_type_id')
            );
        }

        if ($request->filled('year')) {
            $query->where(
                'year',
                $request->integer('year')
            );
        }

        $balances = $query->paginate(
            $request->integer('per_page', 20)
        );

        return response()->json([
            'success' => true,
            'data' => $balances,
        ]);
    }

    /**
     * Create or allocate a leave balance.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_profile_id' => [
                'required',
                'integer',
                'exists:employee_profiles,id',
            ],
            'leave_type_id' => [
                'required',
                'integer',
                'exists:leave_types,id',
            ],
            'year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],
            'opening_balance' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'allocated' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'used' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'pending' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'adjusted' => [
                'sometimes',
                'numeric',
                'min:-999.99',
                'max:999.99',
            ],
        ]);

        $exists = EmployeeLeaveBalance::query()
            ->where(
                'employee_profile_id',
                $validated['employee_profile_id']
            )
            ->where(
                'leave_type_id',
                $validated['leave_type_id']
            )
            ->where(
                'year',
                $validated['year']
            )
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Leave balance already exists for this employee, leave type and year.',
            ], 422);
        }

        $balance = EmployeeLeaveBalance::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee leave balance created successfully.',
            'data' => $balance->load([
                'employeeProfile:id,employee_code',
                'leaveType:id,name,code,annual_quota,is_paid',
            ]),
        ], 201);
    }

    /**
     * Show one leave balance.
     */
    public function show(int $id): JsonResponse
    {
        $balance = EmployeeLeaveBalance::with([
            'employeeProfile:id,employee_code',
            'leaveType:id,name,code,annual_quota,is_paid',
        ])->find($id);

        if (! $balance) {
            return response()->json([
                'success' => false,
                'message' => 'Leave balance not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => array_merge(
                $balance->toArray(),
                [
                    'available_balance' => $balance->availableBalance(),
                ]
            ),
        ]);
    }

    /**
     * Update a leave balance.
     */
    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $balance = EmployeeLeaveBalance::find($id);

        if (! $balance) {
            return response()->json([
                'success' => false,
                'message' => 'Leave balance not found.',
            ], 404);
        }

        $validated = $request->validate([
            'opening_balance' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'allocated' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'used' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'pending' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999.99',
            ],
            'adjusted' => [
                'sometimes',
                'numeric',
                'min:-999.99',
                'max:999.99',
            ],
        ]);

        $balance->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee leave balance updated successfully.',
            'data' => $balance->fresh([
                'employeeProfile:id,employee_code',
                'leaveType:id,name,code,annual_quota,is_paid',
            ]),
        ]);
    }

    /**
     * Delete a leave balance.
     */
    public function destroy(int $id): JsonResponse
    {
        $balance = EmployeeLeaveBalance::find($id);

        if (! $balance) {
            return response()->json([
                'success' => false,
                'message' => 'Leave balance not found.',
            ], 404);
        }

        $balance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee leave balance deleted successfully.',
        ]);
    }
}
