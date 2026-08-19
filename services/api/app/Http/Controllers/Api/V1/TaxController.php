<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tax\CalculateTaxRequest;
use App\Services\Tax\TaxCalculationService;
use Illuminate\Http\JsonResponse;

class TaxController extends Controller
{
    public function __construct(
        protected TaxCalculationService $taxService
    ) {
    }

    public function calculate(CalculateTaxRequest $request): JsonResponse
    {
        $result = $this->taxService->calculate(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}