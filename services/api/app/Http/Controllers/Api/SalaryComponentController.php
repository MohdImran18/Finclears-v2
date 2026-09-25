<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StoreSalaryComponentRequest;
use App\Http\Requests\Payroll\UpdateSalaryComponentRequest;
use App\Models\SalaryComponent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalaryComponentController extends Controller
{
    /**
     * List salary components.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SalaryComponent::query();

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('calculation_type')) {
            $query->where(
                'calculation_type',
                $request->input('calculation_type')
            );
        }

        if ($request->has('is_variable')) {
            $query->where(
                'is_variable',
                $request->boolean('is_variable')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        if ($request->has('is_reimbursement')) {
            $query->where(
                'is_reimbursement',
                $request->boolean('is_reimbursement')
            );
        }

        $perPage = min(
            max((int) $request->input('per_page', 50), 1),
            100
        );

        $components = $query
            ->orderBy('display_order')
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Salary components fetched successfully.',
            'data' => $components,
        ]);
    }

    /**
     * Create salary component.
     */
    public function store(
        StoreSalaryComponentRequest $request
    ): JsonResponse {
        $component = SalaryComponent::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Salary component created successfully.',
            'data' => [
                'salary_component' => $component,
            ],
        ], 201);
    }

    /**
     * Show salary component.
     */
    public function show(
        SalaryComponent $salaryComponent
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => 'Salary component fetched successfully.',
            'data' => [
                'salary_component' => $salaryComponent,
            ],
        ]);
    }

    /**
     * Update salary component.
     */
    public function update(
        UpdateSalaryComponentRequest $request,
        SalaryComponent $salaryComponent
    ): JsonResponse {
        $salaryComponent->update(
            $request->validated()
        );

        $salaryComponent->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Salary component updated successfully.',
            'data' => [
                'salary_component' => $salaryComponent,
            ],
        ]);
    }

    /**
     * Delete salary component.
     */
    public function destroy(
        SalaryComponent $salaryComponent
    ): JsonResponse {
        $salaryComponent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Salary component deleted successfully.',
        ]);
    }

    /**
     * Activate / deactivate salary component.
     */
    public function status(
        SalaryComponent $salaryComponent
    ): JsonResponse {
        $salaryComponent->update([
            'is_active' => !$salaryComponent->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => $salaryComponent->is_active
                ? 'Salary component activated successfully.'
                : 'Salary component deactivated successfully.',
            'data' => [
                'salary_component' => $salaryComponent->fresh(),
            ],
        ]);
    }
}