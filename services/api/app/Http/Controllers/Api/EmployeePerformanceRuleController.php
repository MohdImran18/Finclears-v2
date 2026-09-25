<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StoreEmployeePerformanceRuleRequest;
use App\Http\Requests\Payroll\UpdateEmployeePerformanceRuleRequest;
use App\Models\EmployeePerformanceRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeePerformanceRuleController extends Controller
{
    /**
     * List performance rules.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EmployeePerformanceRule::query()
            ->with([
                'employeeProfile:id,employee_code,user_id',
                'employeeProfile.user:id,name,email',
            ]);

        if ($request->filled('employee_profile_id')) {
            $query->where(
                'employee_profile_id',
                $request->integer('employee_profile_id')
            );
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('metric_type', 'like', "%{$search}%");
            });
        }

        if ($request->filled('metric_type')) {
            $query->where(
                'metric_type',
                $request->input('metric_type')
            );
        }

        if ($request->filled('period_type')) {
            $query->where(
                'period_type',
                $request->input('period_type')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        $perPage = min(
            max((int) $request->input('per_page', 20), 1),
            100
        );

        $rules = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Performance rules fetched successfully.',
            'data' => $rules,
        ]);
    }

    /**
     * Create performance rule.
     */
    public function store(
        StoreEmployeePerformanceRuleRequest $request
    ): JsonResponse {
        $rule = EmployeePerformanceRule::create(
            $request->validated()
        );

        $rule->load([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Performance rule created successfully.',
            'data' => [
                'performance_rule' => $rule,
            ],
        ], 201);
    }

    /**
     * Show performance rule.
     */
    public function show(
        EmployeePerformanceRule $performanceRule
    ): JsonResponse {
        $performanceRule->load([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Performance rule fetched successfully.',
            'data' => [
                'performance_rule' => $performanceRule,
            ],
        ]);
    }

    /**
     * Update performance rule.
     */
    public function update(
        UpdateEmployeePerformanceRuleRequest $request,
        EmployeePerformanceRule $performanceRule
    ): JsonResponse {
        $performanceRule->update(
            $request->validated()
        );

        $performanceRule->refresh()->load([
            'employeeProfile:id,employee_code,user_id',
            'employeeProfile.user:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Performance rule updated successfully.',
            'data' => [
                'performance_rule' => $performanceRule,
            ],
        ]);
    }

    /**
     * Deactivate performance rule.
     */
    public function destroy(
        EmployeePerformanceRule $performanceRule
    ): JsonResponse {
        $performanceRule->update([
            'is_active' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Performance rule deactivated successfully.',
        ]);
    }

    /**
     * Activate / deactivate performance rule.
     */
    public function status(
        EmployeePerformanceRule $performanceRule
    ): JsonResponse {
        $performanceRule->update([
            'is_active' => !$performanceRule->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => $performanceRule->is_active
                ? 'Performance rule activated successfully.'
                : 'Performance rule deactivated successfully.',
            'data' => [
                'performance_rule' => $performanceRule->fresh(),
            ],
        ]);
    }
}
