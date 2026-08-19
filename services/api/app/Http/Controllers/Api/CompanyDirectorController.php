<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyDirector;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyDirectorController extends Controller
{
    /**
     * List company directors.
     */
    public function index(Company $company): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $company->directors()->latest()->get(),
        ]);
    }

    /**
     * Create company director.
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
            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],
            'pan' => [
                'nullable',
                'string',
                'max:20',
            ],
            'aadhaar' => [
                'nullable',
                'string',
                'max:20',
            ],
            'din' => [
                'nullable',
                'string',
                'max:50',
            ],
            'designation' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $director = $company->directors()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Director added successfully.',
            'data' => [
                'director' => $director,
            ],
        ], 201);
    }

    /**
     * Update company director.
     */
    public function update(
        Request $request,
        CompanyDirector $director
    ): JsonResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],
            'pan' => [
                'nullable',
                'string',
                'max:20',
            ],
            'aadhaar' => [
                'nullable',
                'string',
                'max:20',
            ],
            'din' => [
                'nullable',
                'string',
                'max:50',
            ],
            'designation' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $director->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Director updated successfully.',
            'data' => [
                'director' => $director->fresh(),
            ],
        ]);
    }

    /**
     * Delete company director.
     */
    public function destroy(
        CompanyDirector $director
    ): JsonResponse {
        $director->delete();

        return response()->json([
            'success' => true,
            'message' => 'Director deleted successfully.',
        ]);
    }
}
