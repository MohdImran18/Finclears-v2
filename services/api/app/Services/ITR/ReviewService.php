<?php

namespace App\Services\ITR;

use App\Services\Tax\TaxCalculationService;

class ReviewService
{
    public function __construct(
        protected TaxCalculationService $taxService
    ) {
    }

    public function generate(array $data): array
    {
        $tax = $this->taxService->calculate($data);

        return [

            /*
            |--------------------------------------------------------------------------
            | Personal
            |--------------------------------------------------------------------------
            */

            'personal' => [

                'name' => $data['name'] ?? null,

                'pan' => $data['pan'] ?? null,

                'aadhaar' => $data['aadhaar'] ?? null,

                'mobile' => $data['mobile'] ?? null,

                'email' => $data['email'] ?? null,

            ],

            /*
            |--------------------------------------------------------------------------
            | Income
            |--------------------------------------------------------------------------
            */

            'income' => [

                'salary' => $data['salary'] ?? 0,

                'house_property' => $data['house_property'] ?? 0,

                'other_sources' => $data['other_sources'] ?? 0,

                'gross_income' => $data['gross_income'] ?? 0,

            ],

            /*
            |--------------------------------------------------------------------------
            | Deductions
            |--------------------------------------------------------------------------
            */

            'deductions' => [

                '80c' => $data['80c'] ?? 0,

                '80d' => $data['80d'] ?? 0,

                '80ccd' => $data['80ccd'] ?? 0,

                '80tta' => $data['80tta'] ?? 0,

                'total' => $data['deductions'] ?? 0,

            ],

            /*
            |--------------------------------------------------------------------------
            | Tax Summary
            |--------------------------------------------------------------------------
            */

            'tax' => $tax,

        ];
    }
}