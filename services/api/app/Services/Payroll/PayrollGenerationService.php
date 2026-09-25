<?php

namespace App\Services\Payroll;

use App\Models\EmployeePerformanceRule;
use App\Models\EmployeeProfile;
use App\Models\Lead;
use App\Models\Order;
use App\Models\PayrollRun;
use App\Models\PayrollRunItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PayrollGenerationService
{
    public function __construct(
        private SalaryCalculationService $salaryCalculationService,
        private AttendancePayrollService $attendancePayrollService,
        private PerformanceCalculationService $performanceCalculationService
    ) {
    }

    public function generate(
        int $employeeId,
        int $year,
        int $month
    ): PayrollRun {
        if ($month < 1 || $month > 12) {
            throw new InvalidArgumentException('Invalid payroll month.');
        }

        $employee = EmployeeProfile::findOrFail($employeeId);

        $periodStart = Carbon::create($year, $month, 1)->startOfMonth();
        $periodEnd = $periodStart->copy()->endOfMonth();

        // New employees are eligible for payroll only from their
        // date of joining when they join during the payroll month.
        if (
            $employee->date_of_joining
            && $employee->date_of_joining->gt($periodStart)
            && $employee->date_of_joining->lte($periodEnd)
        ) {
            $periodStart = $employee->date_of_joining->copy()->startOfDay();
        }

        return DB::transaction(function () use (
            $employee,
            $year,
            $month,
            $periodStart,
            $periodEnd
        ) {
            $salaryStructure = $employee
                ->salaryStructures()
                ->where('is_current', true)
                ->where('status', 'active')
                ->whereDate('effective_from', '<=', $periodEnd)
                ->where(function ($query) use ($periodStart) {
                    $query
                        ->whereNull('effective_to')
                        ->orWhereDate('effective_to', '>=', $periodStart);
                })
                ->with('items.salaryComponent')
                ->first();

            if (! $salaryStructure) {
                throw new InvalidArgumentException(
                    'No active salary structure found for this employee.'
                );
            }

            /*
             * 1. Base salary calculation
             */
            $salaryCalculation = $this->salaryCalculationService->calculate(
                $salaryStructure
            );

            /*
             * 1A. Prorate salary earnings for employees who joined
             * during the payroll month.
             *
             * Example:
             * Joining date: 29 Aug
             * Payroll period: 29 Aug - 31 Aug
             * Eligible days: 3
             * Calendar days: 31
             *
             * Basic/HRA/fixed earnings are prorated.
             * Existing fixed deductions (e.g. PF) are preserved.
             */
            $monthDays = Carbon::create($year, $month, 1)
                ->daysInMonth;

            $eligibleDays = $periodStart->copy()
                ->startOfDay()
                ->diffInDays(
                    $periodEnd->copy()->startOfDay()
                ) + 1;

            if ($periodStart->gt(
                Carbon::create($year, $month, 1)->startOfMonth()
            )) {
                $prorationFactor = $monthDays > 0
                    ? $eligibleDays / $monthDays
                    : 1.0;

                foreach ($salaryCalculation['earnings'] as &$earning) {
                    $earning['amount'] = round(
                        (float) $earning['amount'] * $prorationFactor,
                        2
                    );
                }
                unset($earning);

                $salaryCalculation['totals']['gross_pay'] = round(
                    array_sum(
                        array_map(
                            fn ($earning) => (float) $earning['amount'],
                            $salaryCalculation['earnings']
                        )
                    ),
                    2
                );

                $salaryCalculation['totals']['net_pay'] = round(
                    $salaryCalculation['totals']['gross_pay']
                    - (float) $salaryCalculation['totals']['deductions'],
                    2
                );
            }

            /*
             * 2. Attendance calculation
             */
            $attendance = $this->attendancePayrollService->summarize(
                $employee->id,
                $periodStart,
                $periodEnd
            );

            /*
             * 3. Find active performance rule applicable
             *    to this employee and payroll period.
             */
            $performanceRule = EmployeePerformanceRule::query()
                ->where('employee_profile_id', $employee->id)
                ->where('is_active', true)
                ->where(function ($query) use ($periodStart) {
                    $query
                        ->whereNull('effective_from')
                        ->orWhereDate('effective_from', '<=', $periodStart);
                })
                ->where(function ($query) use ($periodEnd) {
                    $query
                        ->whereNull('effective_to')
                        ->orWhereDate('effective_to', '>=', $periodEnd);
                })
                ->orderByDesc('id')
                ->first();

            /*
             * 4. Build real performance context.
             */
            $performance = null;

            if ($performanceRule) {
                $performanceContext = $this->buildPerformanceContext(
                    $employee,
                    $periodStart,
                    $periodEnd,
                    $salaryCalculation,
                    $attendance
                );

                $performance = $this->performanceCalculationService->calculate(
                    $performanceRule,
                    $performanceContext
                );
            }

            /*
             * 5. Extract performance amounts.
             */
            $performanceIncentive = $performance
                ? (float) $performance['incentive']
                : 0.0;

            $performanceDeduction = $performance
                ? (float) $performance['deductions']['performance']
                : 0.0;

            $lossDeduction = $performance
                ? (float) $performance['deductions']['loss']
                : 0.0;

            $attendanceDeduction = $performance
                ? (float) $performance['deductions']['attendance']
                : 0.0;

            /*
             * 6. Existing salary deductions remain intact.
             */
            $otherDeduction = (float) (
                $salaryCalculation['totals']['deductions'] ?? 0
            );

            $reimbursementAmount = (float) (
                $salaryCalculation['totals']['reimbursements'] ?? 0
            );

            /*
             * Incentives increase gross pay.
             */
            $grossPay =
                (float) $salaryCalculation['totals']['gross_pay']
                + $performanceIncentive;

            $totalDeductions =
                $otherDeduction
                + $performanceDeduction
                + $lossDeduction
                + $attendanceDeduction;

            $netPayable = max(
                0,
                $grossPay - $totalDeductions
            );

            $existing = PayrollRun::where(
                'employee_profile_id',
                $employee->id
            )
                ->where('payroll_year', $year)
                ->where('payroll_month', $month)
                ->first();

            if ($existing && in_array(
                $existing->status,
                ['approved', 'paid'],
                true
            )) {
                throw new InvalidArgumentException(
                    'Payroll is already approved or paid for this period.'
                );
            }

            $payrollRun = $existing ?: new PayrollRun();

            $payrollRun->fill([
                'employee_profile_id' =>
                    $employee->id,

                'employee_salary_structure_id' =>
                    $salaryStructure->id,

                'payroll_year' => $year,
                'payroll_month' => $month,

                'period_start' => $periodStart,
                'period_end' => $periodEnd,

                'basic_salary' =>
                    collect($salaryCalculation['earnings'])
                        ->filter(
                            fn ($earning) =>
                                ($earning['code'] ?? $earning['component_code'] ?? null)
                                === 'BASIC'
                        )
                        ->sum('amount'),

                'fixed_earnings' =>
                    round(
                        collect($salaryCalculation['earnings'])
                            ->sum('amount'),
                        2
                    ),

                'variable_earnings' =>
                    $performanceIncentive,

                'performance_incentive' =>
                    $performanceIncentive,

                'performance_deduction' =>
                    $performanceDeduction,

                'reimbursement_amount' =>
                    $reimbursementAmount,

                'pending_payment_amount' => 0,
                'other_payment_amount' => 0,

                'gross_pay' =>
                    round($grossPay, 2),

                'loss_deduction' =>
                    $lossDeduction,

                'attendance_deduction' =>
                    $attendanceDeduction,

                'statutory_deduction' => 0,

                'other_deduction' =>
                    $otherDeduction,

                'total_deductions' =>
                    round($totalDeductions, 2),

                'net_payable' =>
                    round($netPayable, 2),

                'working_days' =>
                    $attendance['working_days'],

                'present_days' =>
                    $attendance['present_days'],

                'leave_days' =>
                    $attendance['leave_days'],

                'lop_days' =>
                    $attendance['lop_days'],

                'target_value' =>
                    $performance['target'] ?? 0,

                'achievement_value' =>
                    $performance['achievement'] ?? 0,

                'achievement_percentage' =>
                    $performance['achievement_percentage'] ?? 0,

                'status' => 'calculated',

                'calculated_at' => now(),
            ]);

            $payrollRun->save();

            PayrollRunItem::where(
                'payroll_run_id',
                $payrollRun->id
            )->delete();

            $this->createSalaryItems(
                $payrollRun,
                $salaryCalculation
            );

            $this->createPerformanceItems(
                $payrollRun,
                $performance
            );

            return $payrollRun->fresh('items');
        });
    }

    /**
     * Build real business metrics used by performance rules.
     *
     * Current supported metrics:
     * - sales: assigned orders amount
     * - leads: assigned leads count
     *
     * Collection, revenue and loss are intentionally zero
     * until their exact business source/rule is established.
     */
    private function buildPerformanceContext(
        EmployeeProfile $employee,
        Carbon $periodStart,
        Carbon $periodEnd,
        array $salaryCalculation,
        array $attendance
    ): array {
        $sales = (float) Order::query()
            ->where('assigned_to', $employee->user_id)
            ->whereBetween('created_at', [
                $periodStart,
                $periodEnd,
            ])
            ->sum('amount');

        $leads = (int) Lead::query()
            ->where('assigned_to', $employee->user_id)
            ->whereBetween('created_at', [
                $periodStart,
                $periodEnd,
            ])
            ->count();

        return [
            'sales' => round($sales, 2),

            'collection' => 0,
            'revenue' => 0,

            'leads' => $leads,

            'target' => 0,

            'basic_salary' =>
                (float) $salaryCalculation['basic_salary'],

            'gross_salary' =>
                (float) $salaryCalculation['totals']['gross_pay'],

            'net_salary' =>
                (float) $salaryCalculation['totals']['net_pay'],

            'working_days' =>
                (float) $attendance['working_days'],

            'attendance_days' =>
                (float) $attendance['present_days'],

            'lop_days' =>
                (float) $attendance['lop_days'],

            'loss_amount' => 0,
        ];
    }

    private function createSalaryItems(
        PayrollRun $payrollRun,
        array $calculation
    ): void {
        $order = 1;

        foreach ($calculation['earnings'] as $item) {
            $this->createItem(
                $payrollRun,
                $item,
                'earning',
                false,
                $order++
            );
        }

        foreach ($calculation['deductions'] as $item) {
            $this->createItem(
                $payrollRun,
                $item,
                'deduction',
                false,
                $order++
            );
        }

        foreach ($calculation['reimbursements'] as $item) {
            $this->createItem(
                $payrollRun,
                $item,
                'reimbursement',
                true,
                $order++
            );
        }
    }

    private function createItem(
        PayrollRun $payrollRun,
        array $item,
        string $type,
        bool $isReimbursement,
        int $order
    ): void {
        PayrollRunItem::create([
            'payroll_run_id' =>
                $payrollRun->id,

            'salary_component_id' =>
                $item['component_id'],

            'employee_salary_structure_item_id' =>
                $item['item_id'],

            'type' => $type,

            'component_name' =>
                $item['component_name'],

            'component_code' =>
                $item['component_code'],

            'calculation_type' =>
                $item['calculation_type'],

            'calculation_basis' => null,

            'configured_amount' =>
                $item['amount'],

            'configured_percentage' => null,

            'calculated_amount' =>
                $item['amount'],

            'is_variable' =>
                $item['is_variable'],

            'is_taxable' =>
                $item['is_taxable'],

            'is_statutory' =>
                $item['is_statutory'],

            'is_reimbursement' =>
                $isReimbursement,

            'display_order' => $order,
        ]);
    }

    private function createPerformanceItems(
        PayrollRun $payrollRun,
        ?array $performance
    ): void {
        if (! $performance) {
            return;
        }

        $order = (
            $payrollRun->items()->max('display_order') ?? 0
        ) + 1;

        if (($performance['incentive'] ?? 0) > 0) {
            PayrollRunItem::create([
                'payroll_run_id' => $payrollRun->id,

                'salary_component_id' => null,
                'employee_salary_structure_item_id' => null,

                'type' => 'earning',

                'component_name' => 'Performance Incentive',
                'component_code' => 'PERFORMANCE_INCENTIVE',

                'calculation_type' => 'rule_based',
                'calculation_basis' => null,

                'configured_amount' =>
                    $performance['incentive'],

                'configured_percentage' => null,

                'calculated_amount' =>
                    $performance['incentive'],

                'target_value' =>
                    $performance['target'],

                'achievement_value' =>
                    $performance['achievement'],

                'achievement_percentage' =>
                    $performance['achievement_percentage'],

                'working_days' =>
                    $payrollRun->working_days,

                'present_days' =>
                    $payrollRun->present_days,

                'leave_days' =>
                    $payrollRun->leave_days,

                'lop_days' =>
                    $payrollRun->lop_days,

                'calculation_data' =>
                    $performance,

                'is_variable' => true,
                'is_taxable' => true,
                'is_statutory' => false,
                'is_reimbursement' => false,

                'display_order' => $order++,
            ]);
        }

        $deductions = [
            [
                'name' => 'Performance Deduction',
                'code' => 'PERFORMANCE_DEDUCTION',
                'amount' =>
                    $performance['deductions']['performance'] ?? 0,
            ],
            [
                'name' => 'Loss Deduction',
                'code' => 'LOSS_DEDUCTION',
                'amount' =>
                    $performance['deductions']['loss'] ?? 0,
            ],
            [
                'name' => 'Attendance / LOP Deduction',
                'code' => 'ATTENDANCE_DEDUCTION',
                'amount' =>
                    $performance['deductions']['attendance'] ?? 0,
            ],
        ];

        foreach ($deductions as $deduction) {
            if ((float) $deduction['amount'] <= 0) {
                continue;
            }

            PayrollRunItem::create([
                'payroll_run_id' => $payrollRun->id,

                'salary_component_id' => null,
                'employee_salary_structure_item_id' => null,

                'type' => 'deduction',

                'component_name' =>
                    $deduction['name'],

                'component_code' =>
                    $deduction['code'],

                'calculation_type' => 'rule_based',
                'calculation_basis' => null,

                'configured_amount' =>
                    $deduction['amount'],

                'configured_percentage' => null,

                'calculated_amount' =>
                    $deduction['amount'],

                'target_value' =>
                    $performance['target'],

                'achievement_value' =>
                    $performance['achievement'],

                'achievement_percentage' =>
                    $performance['achievement_percentage'],

                'working_days' =>
                    $payrollRun->working_days,

                'present_days' =>
                    $payrollRun->present_days,

                'leave_days' =>
                    $payrollRun->leave_days,

                'lop_days' =>
                    $payrollRun->lop_days,

                'calculation_data' =>
                    $performance,

                'is_variable' => true,
                'is_taxable' => false,
                'is_statutory' => false,
                'is_reimbursement' => false,

                'display_order' => $order++,
            ]);
        }
    }
}
