<?php

namespace App\Services\Tax;

class OldRegimeCalculator
{
    public function calculate(array $data): float
    {
        $income = $data['taxable_income'] ?? 0;

        $tax = 0;

        if ($income <= 250000) {
            return 0;
        }

        // ₹2,50,001 - ₹5,00,000 @ 5%
        if ($income > 250000) {
            $tax += (min($income, 500000) - 250000) * 0.05;
        }

        // ₹5,00,001 - ₹10,00,000 @ 20%
        if ($income > 500000) {
            $tax += (min($income, 1000000) - 500000) * 0.20;
        }

        // Above ₹10,00,000 @ 30%
        if ($income > 1000000) {
            $tax += ($income - 1000000) * 0.30;
        }

        return round($tax, 2);
    }
}