<?php

namespace App\Services\Tax;

class CessCalculator
{
    /**
     * Health & Education Cess (4%)
     */
    public function calculate(float $tax): float
    {
        if ($tax <= 0) {
            return 0;
        }

        return round($tax * 0.04, 2);
    }
}