<?php

namespace App\Services\Tax;

class RebateCalculator
{
    public function calculate(float $tax, array $data): float
    {
        $income = $data['taxable_income'] ?? 0;

        $regime = $data['regime'] ?? 'new';

        // Old Regime
        if ($regime === 'old') {
            if ($income <= 500000) {
                return min($tax, 12500);
            }

            return 0;
        }

        // New Regime
        if ($income <= 1200000) {
            return $tax;
        }

        return 0;
    }
}