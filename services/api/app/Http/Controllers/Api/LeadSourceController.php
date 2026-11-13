<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadSource;
use Illuminate\Http\JsonResponse;

class LeadSourceController extends Controller
{
    public function index(): JsonResponse
    {
        $sources = LeadSource::query()
            ->where('status', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'message' => 'Lead sources fetched successfully.',
            'data' => [
                'sources' => $sources,
            ],
        ]);
    }
}
