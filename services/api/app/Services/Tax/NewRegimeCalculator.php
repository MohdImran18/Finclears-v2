<?php

namespace App\Services\Tax;

class NewRegimeCalculator
{
    public function calculate(array $data): float
    {
        $income = $data['taxable_income'] ?? 0;

        $tax = 0;

        if ($income <= 400000) {
            return 0;
        }

        // ₹4L - ₹8L @ 5%
        if ($income > 400000) {
            $tax += (min($income, 800000) - 400000) * 0.05;
        }

        // ₹8L - ₹12L @ 10%
        if ($income > 800000) {
            $tax += (min($income, 1200000) - 800000) * 0.10;
        }

        // ₹12L - ₹16L @ 15%
        if ($income > 1200000) {
            $tax += (min($income, 1600000) - 1200000) * 0.15;
        }

        // ₹16L - ₹20L @ 20%
        if ($income > 1600000) {
            $tax += (min($income, 2000000) - 1600000) * 0.20;
        }

        // ₹20L - ₹24L @ 25%
        if ($income > 2000000) {
            $tax += (min($income, 2400000) - 2000000) * 0.25;
        }

        // Above ₹24L @ 30%
        if ($income > 2400000) {
            $tax += ($income - 2400000) * 0.30;
        }

        return round($tax, 2);
    }
}