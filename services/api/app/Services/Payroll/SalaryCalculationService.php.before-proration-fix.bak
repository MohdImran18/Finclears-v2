<?php

namespace App\Services\Payroll;

use App\Models\EmployeeSalaryStructure;
use InvalidArgumentException;

class SalaryCalculationService
{
    /**
     * Calculate an employee salary structure.
     *
     * This service handles:
     * - fixed earnings
     * - percentage earnings
     * - fixed deductions
     * - percentage deductions
     * - reimbursements
     * - variable components
     * - employee-specific limits
     *
     * Target/performance rules will be evaluated separately
     * by the performance calculation layer.
     */
    public function calculate(
        EmployeeSalaryStructure $salaryStructure,
        array $inputs = []
    ): array {
        $salaryStructure->loadMissing([
            'items.salaryComponent',
        ]);

        $basicSalary = $this->money(
            $salaryStructure->basic_salary
        );

        $context = array_merge([
            'basic_salary' => $basicSalary,
            'gross_salary' => $this->money($salaryStructure->gross_salary),
            'monthly_ctc' => $this->money($salaryStructure->monthly_ctc),
            'annual_ctc' => $this->money($salaryStructure->annual_ctc),

            'sales' => 0,
            'target' => 0,
            'target_achievement' => 0,

            'attendance_days' => 0,
            'working_days' => 0,
            'loss_amount' => 0,
            'reimbursement_amount' => 0,
        ], $inputs);

        $earnings = [];
        $deductions = [];
        $reimbursements = [];

        foreach ($salaryStructure->items as $item) {
            if (! $item->is_enabled) {
                continue;
            }

            $component = $item->salaryComponent;

            if (! $component || ! $component->is_active) {
                continue;
            }

            $amount = $this->calculateItemAmount(
                $item,
                $context
            );

            if ($amount <= 0) {
                continue;
            }

            $entry = [
                'item_id' => $item->id,
                'component_id' => $component->id,
                'component_name' => $component->name,
                'component_code' => $component->code,
                'type' => $component->type,
                'calculation_type' => $item->calculation_type,
                'amount' => $amount,
                'is_variable' => (bool) $item->is_variable,
                'is_taxable' => (bool) $item->is_taxable,
                'is_statutory' => (bool) $item->is_statutory,
            ];

            if ($item->is_reimbursement || $component->is_reimbursement) {
                $reimbursements[] = $entry;
            } elseif ($component->type === 'deduction') {
                $deductions[] = $entry;
            } else {
                $earnings[] = $entry;
            }
        }

        $fixedEarnings = $this->sum($earnings);
        $totalReimbursements = $this->sum($reimbursements);
        $totalDeductions = $this->sum($deductions);

        $grossEarnings = $fixedEarnings + $totalReimbursements;
        $netPay = max(0, $grossEarnings - $totalDeductions);

        return [
            'basic_salary' => $basicSalary,

            'earnings' => $earnings,
            'deductions' => $deductions,
            'reimbursements' => $reimbursements,

            'totals' => [
                'earnings' => $this->money($fixedEarnings),
                'reimbursements' => $this->money($totalReimbursements),
                'deductions' => $this->money($totalDeductions),
                'gross_pay' => $this->money($grossEarnings),
                'net_pay' => $this->money($netPay),
            ],
        ];
    }

    private function calculateItemAmount(
        $item,
        array $context
    ): float {
        $amount = 0.0;

        switch ($item->calculation_type) {
            case 'fixed':
                $amount = (float) $item->amount;
                break;

            case 'percentage':
                $basis = $this->resolveBasis(
                    $item->calculation_basis,
                    $context
                );

                $percentage = (float) ($item->percentage ?? 0);

                $amount = ($basis * $percentage) / 100;
                break;

            case 'formula':
                $amount = $this->evaluateFormula(
                    $item->formula,
                    $context
                );
                break;

            case 'rule_based':
                $amount = $this->evaluateRule(
                    $item->rule_config,
                    $context
                );
                break;

            default:
                throw new InvalidArgumentException(
                    "Unsupported salary calculation type: {$item->calculation_type}"
                );
        }

        return $this->applyLimits(
            $amount,
            $item->minimum_amount,
            $item->maximum_amount
        );
    }

    private function resolveBasis(
        ?string $basis,
        array $context
    ): float {
        if (! $basis) {
            return 0;
        }

        return (float) ($context[$basis] ?? 0);
    }

    private function evaluateFormula(
        ?string $formula,
        array $context
    ): float {
        /*
         * Formula execution will intentionally remain restricted.
         *
         * Do NOT execute arbitrary PHP/eval expressions here.
         *
         * A dedicated safe formula parser will be added next.
         */
        if (! $formula) {
            return 0;
        }

        return 0;
    }

    private function evaluateRule(
        ?array $rules,
        array $context
    ): float {
        if (! is_array($rules)) {
            return 0;
        }

        /*
         * Rule engine will handle:
         *
         * target achievement
         * sales slabs
         * performance deductions
         * loss deductions
         * attendance rules
         * employee-specific conditions
         */

        return 0;
    }

    private function applyLimits(
        float $amount,
        $minimum,
        $maximum
    ): float {
        if ($minimum !== null) {
            $amount = max(
                $amount,
                (float) $minimum
            );
        }

        if ($maximum !== null) {
            $amount = min(
                $amount,
                (float) $maximum
            );
        }

        return $this->money($amount);
    }

    private function sum(array $items): float
    {
        return $this->money(
            array_sum(
                array_map(
                    fn (array $item) => (float) $item['amount'],
                    $items
                )
            )
        );
    }

    private function money($value): float
    {
        return round((float) $value, 2);
    }
}
