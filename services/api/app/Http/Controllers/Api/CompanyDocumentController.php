<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyDocumentController extends Controller
{
    /**
     * Upload a document for a company.
     */
    public function store(
        Request $request,
        Company $company
    ): JsonResponse {
        $validated = $request->validate([
            'document_type' => [
                'required',
                'string',
                'max:100',
            ],
            'file' => [
                'required',
                'file',
                'mimes:pdf,jpg,jpeg,png,webp',
                'max:10240',
            ],
            'remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $path = $request->file('file')->store(
            'company-documents/' . $company->id,
            'public'
        );

        $document = CompanyDocument::create([
            'company_id' => $company->id,
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'status' => 'pending',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully.',
            'data' => [
                'document' => $document,
            ],
        ], 201);
    }
}
