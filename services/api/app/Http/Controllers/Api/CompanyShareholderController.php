<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyShareholder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyShareholderController extends Controller
{
    /**
     * List company shareholders.
     */
    public function index(Company $company): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $company->shareholders()->latest()->get(),
        ]);
    }

    /**
     * Create company shareholder.
     */
    public function store(
        Request $request,
        Company $company
    ): JsonResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'shares' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
        ]);

        $shareholder = $company->shareholders()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shareholder added successfully.',
            'data' => [
                'shareholder' => $shareholder,
            ],
        ], 201);
    }

    /**
     * Update company shareholder.
     */
    public function update(
        Request $request,
        CompanyShareholder $shareholder
    ): JsonResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'shares' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
        ]);

        $shareholder->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shareholder updated successfully.',
            'data' => [
                'shareholder' => $shareholder->fresh(),
            ],
        ]);
    }

    /**
     * Delete company shareholder.
     */
    public function destroy(
        CompanyShareholder $shareholder
    ): JsonResponse {
        $shareholder->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shareholder deleted successfully.',
        ]);
    }
}
