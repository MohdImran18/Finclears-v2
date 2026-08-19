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
        | Calculate Base Tax
        |--------------------------------------------------------------------------
        */

        $oldTax = $this->old->calculate($data);
        $newTax = $this->new->calculate($data);

        /*
        |--------------------------------------------------------------------------
        | Apply Rebate
        |--------------------------------------------------------------------------
        */

        $oldTax -= $this->rebate->calculate(
            $oldTax,
            [
                ...$data,
                'regime' => 'old',
            ]
        );

        $newTax -= $this->rebate->calculate(
            $newTax,
            [
                ...$data,
                'regime' => 'new',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Apply Surcharge
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->surcharge->calculate($oldTax, $data);
        $newTax += $this->surcharge->calculate($newTax, $data);

        /*
        |--------------------------------------------------------------------------
        | Apply Health & Education Cess
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->cess->calculate($oldTax);
        $newTax += $this->cess->calculate($newTax);

        /*
        |--------------------------------------------------------------------------
        | Apply Interest
        |--------------------------------------------------------------------------
        */

        $oldTax += $this->interest->calculate($data);
        $newTax += $this->interest->calculate($data);

        /*
        |--------------------------------------------------------------------------
        | Recommended Regime
        |--------------------------------------------------------------------------
        */

        $recommended = $oldTax <= $newTax ? 'old' : 'new';

        $payable = $recommended === 'old'
            ? round($oldTax, 2)
            : round($newTax, 2);

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return [

            'gross_income' => $data['gross_income'] ?? 0,

            'deductions' => $data['deductions'] ?? 0,

            'taxable_income' => $data['taxable_income'] ?? 0,

            'old_regime' => [
                'tax' => round($oldTax, 2),
            ],

            'new_regime' => [
                'tax' => round($newTax, 2),
            ],

            'recommended' => $recommended,

            'payable' => $payable,

        ];
    }
}