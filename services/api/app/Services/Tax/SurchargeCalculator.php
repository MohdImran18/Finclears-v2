<?php

namespace App\Services\Tax;

class SurchargeCalculator
{
    public function calculate(float $tax, array $data): float
    {
        $income = $data['taxable_income'] ?? 0;

        $rate = 0;

        if ($income > 50000000) {
            $rate = 0.37;      // Above ₹5 Cr
        } elseif ($income > 20000000) {
            $rate = 0.25;      // ₹2 Cr - ₹5 Cr
        } elseif ($income > 10000000) {
            $rate = 0.15;      // ₹1 Cr - ₹2 Cr
        } elseif ($income > 5000000) {
            $rate = 0.10;      // ₹50 L - ₹1 Cr
        }

        return round($tax * $rate, 2);
    }
}