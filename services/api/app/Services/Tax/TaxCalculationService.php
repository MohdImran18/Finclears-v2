<?php

namespace App\Services\Tax;

class TaxCalculationService
{
    public function __construct(
        protected OldRegimeCalculator $old,
        protected NewRegimeCalculator $new,
        protected RebateCalculator $rebate,
        protected SurchargeCalculator $surcharge,
        protected CessCalculator $cess,
        protected InterestCalculator $interest,
    ) {
    }

    public function calculate(array $data): array
    {
        /*
        |--------------------------------------------------------------------------
        | Input values
        |--------------------------------------------------------------------------
        */

        $grossIncome = (float) (
            $data['gross_income'] ?? 0
        );

        $deductions = (float) (
            $data['deductions'] ?? 0
        );

        $taxableIncome = (float) (
            $data['taxable_income'] ?? 0
        );

        /*
        |--------------------------------------------------------------------------
        | Tax Credits
        |--------------------------------------------------------------------------
        */

        $tds = max(
            0,
            (float) (
                $data['tds_amount'] ?? 0
            )
        );

        $tcs = max(
            0,
            (float) (
                $data['tcs_amount'] ?? 0
            )
        );

        $advanceTax = max(
            0,
            (float) (
                $data['advance_tax'] ?? 0
            )
        );

        $selfAssessmentTax = max(
            0,
            (float) (
                $data['self_assessment_tax'] ?? 0
            )
        );

        /*
        |--------------------------------------------------------------------------
        | Calculate Base Tax
        |--------------------------------------------------------------------------
        */

        $oldTax = $this->old->calculate([
            ...$data,
            'taxable_income' => $taxableIncome,
        ]);

        $newTax = $this->new->calculate([
            ...$data,
            'taxable_income' => $taxableIncome,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Apply Rebate
        |--------------------------------------------------------------------------
        */

        $oldTax -= $this->rebate->calculate(
            $oldTax,
            [
                ...$data,
                'taxable_income' => $taxableIncome,
                'regime' => 'old',
            ]
        );

        $newTax -= $this->rebate->calculate(
            $newTax,
            [
                ...$data,
                'taxable_income' => $taxableIncome,
                'regime' => 'new',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Apply Surcharge
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->surcharge->calculate(
            $oldTax,
            [
                ...$data,
                'taxable_income' => $taxableIncome,
            ]
        );

        $newTax += $this->surcharge->calculate(
            $newTax,
            [
                ...$data,
                'taxable_income' => $taxableIncome,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Health & Education Cess
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->cess->calculate(
            $oldTax
        );

        $newTax += $this->cess->calculate(
            $newTax
        );

        /*
        |--------------------------------------------------------------------------
        | Interest
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->interest->calculate([
            ...$data,
            'taxable_income' => $taxableIncome,
        ]);

        $newTax += $this->interest->calculate([
            ...$data,
            'taxable_income' => $taxableIncome,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Recommended Regime
        |--------------------------------------------------------------------------
        */

        $recommended = $oldTax <= $newTax
            ? 'old'
            : 'new';

        /*
        |--------------------------------------------------------------------------
        | Total Tax Liability
        |--------------------------------------------------------------------------
        */

        $taxLiability = $recommended === 'old'
            ? round($oldTax, 2)
            : round($newTax, 2);

        /*
        |--------------------------------------------------------------------------
        | Total Tax Credits
        |--------------------------------------------------------------------------
        */

        $totalCredits = round(
            $tds
            + $tcs
            + $advanceTax
            + $selfAssessmentTax,
            2
        );

        /*
        |--------------------------------------------------------------------------
        | Final Payable / Refund
        |--------------------------------------------------------------------------
        */

        $netPayable = max(
            0,
            round(
                $taxLiability - $totalCredits,
                2
            )
        );

        $refundAmount = max(
            0,
            round(
                $totalCredits - $taxLiability,
                2
            )
        );

                /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return [

            'gross_income' => $grossIncome,

            'deductions' => $deductions,

            'taxable_income' => $taxableIncome,

            'old_regime' => [
                'tax' => round(
                    $oldTax,
                    2
                ),
            ],

            'new_regime' => [
                'tax' => round(
                    $newTax,
                    2
                ),
            ],

            'recommended' => $recommended,

            /*
             * Total liability before tax credits
             */
            'tax_liability' => $taxLiability,

            /*
             * Individual tax credits
             */
            'tds_amount' => $tds,

            'tcs_amount' => $tcs,

            'advance_tax' => $advanceTax,

            'self_assessment_tax' =>
                $selfAssessmentTax,

            /*
             * Combined tax credits
             */
            'total_credits' => $totalCredits,

            /*
             * Final settlement
             */
            'payable' => $netPayable,

            'net_payable' => $netPayable,

            'refund_amount' => $refundAmount,
        ];
    }
}