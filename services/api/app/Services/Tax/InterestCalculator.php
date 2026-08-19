<?php

namespace App\Services\Tax;

class InterestCalculator
{
    public function calculate(array $data): float
    {
        $interest = 0;

        // 234A
        $interest += $this->section234A($data);

        // 234B
        $interest += $this->section234B($data);

        // 234C
        $interest += $this->section234C($data);

        return round($interest, 2);
    }

    protected function section234A(array $data): float
    {
        return 0;
    }

    protected function section234B(array $data): float
    {
        return 0;
    }

    protected function section234C(array $data): float
    {
        return 0;
    }
}