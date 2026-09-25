<?php

namespace App\Http\Controllers\Payroll;

use App\Http\Controllers\Controller;
use App\Models\PayrollRun;
use App\Services\Payroll\PayrollGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class PayrollController extends Controller
{
    public function __construct(
        private PayrollGenerationService $payrollGenerationService
    ) {
    }

    /**
     * Generate or regenerate payroll for an employee/month.
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_profile_id' => [
                'required',
                'integer',
                'exists:employee_profiles,id',
            ],
            'year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],
            'month' => [
                'required',
                'integer',
                'min:1',
                'max:12',
            ],
        ]);

        try {
            $payrollRun = $this->payrollGenerationService->generate(
                (int) $validated['employee_profile_id'],
                (int) $validated['year'],
                (int) $validated['month']
            );

            return response()->json([
                'success' => true,
                'message' => 'Payroll generated successfully.',
                'data' => $payrollRun,
            ], 201);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Approve a calculated payroll run.
     */
    public function approve(
        Request $request,
        int $id
    ): JsonResponse {
        $payrollRun = PayrollRun::find($id);

        if (! $payrollRun) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll run not found.',
            ], 404);
        }

        if ($payrollRun->status !== 'calculated') {
            return response()->json([
                'success' => false,
                'message' => 'Only calculated payroll can be approved.',
            ], 422);
        }

        $payrollRun->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payroll approved successfully.',
            'data' => $payrollRun->fresh([
                'employeeProfile',
                'salaryStructure',
                'items',
                'approver',
            ]),
        ]);
    }

    /**
     * Mark an approved payroll run as paid.
     */
    public function pay(
        Request $request,
        int $id
    ): JsonResponse {
        $validated = $request->validate([
            'payment_reference' => [
                'required',
                'string',
                'max:150',
            ],
        ]);

        $payrollRun = PayrollRun::find($id);

        if (! $payrollRun) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll run not found.',
            ], 404);
        }

        if ($payrollRun->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Only approved payroll can be marked as paid.',
            ], 422);
        }

        $payrollRun->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_reference' => $validated['payment_reference'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payroll marked as paid successfully.',
            'data' => $payrollRun->fresh([
                'employeeProfile',
                'salaryStructure',
                'items',
                'approver',
            ]),
        ]);
    }

    /**
     * List payroll runs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PayrollRun::query()
            ->with([
                'employeeProfile:id,employee_code',
                'items',
            ])
            ->orderByDesc('payroll_year')
            ->orderByDesc('payroll_month')
            ->orderByDesc('id');

        if ($request->filled('employee_profile_id')) {
            $query->where(
                'employee_profile_id',
                $request->integer('employee_profile_id')
            );
        }

        if ($request->filled('year')) {
            $query->where(
                'payroll_year',
                $request->integer('year')
            );
        }

        if ($request->filled('month')) {
            $query->where(
                'payroll_month',
                $request->integer('month')
            );
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')->toString()
            );
        }

        $payrollRuns = $query->paginate(
            $request->integer('per_page', 20)
        );

        return response()->json([
            'success' => true,
            'data' => $payrollRuns,
        ]);
    }

    /**
     * Show one payroll run with complete breakdown.
     */
    public function show(int $id): JsonResponse
    {
        $payrollRun = PayrollRun::with([
            'employeeProfile',
            'salaryStructure',
            'items',
            'approver',
        ])->find($id);

        if (! $payrollRun) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll run not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payrollRun,
        ]);
    }
}
