<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ReviewRequest;
use App\Services\ITR\ReviewService;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {
    }

    public function index(ReviewRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->reviewService->generate(
                $request->validated()
            ),
        ]);
    }
}