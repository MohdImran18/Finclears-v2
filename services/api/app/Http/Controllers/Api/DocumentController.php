<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [],
        ]);
    }

    /**
     * Store a newly created document.
     */
    public function store(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully.',
        ], 201);
    }

    /**
     * Display the specified document.
     */
    public function show(Document $document)
    {
        return response()->json([
            'success' => true,
            'data' => $document,
        ]);
    }

    /**
     * Update the specified document.
     */
    public function update(Request $request, Document $document)
    {
        return response()->json([
            'success' => true,
            'message' => 'Document updated successfully.',
        ]);
    }

    /**
     * Remove the specified document.
     */
    public function destroy(Document $document)
    {
        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully.',
        ]);
    }

    /**
     * Document timeline.
     */
    public function timeline(Document $document)
    {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'action' => 'uploaded',
                    'user' => 'Imran Malik',
                    'remarks' => 'Initial upload',
                    'created_at' => now(),
                ],
                [
                    'id' => 2,
                    'action' => 'verified',
                    'user' => 'CA Team',
                    'remarks' => 'All checks passed',
                    'created_at' => now(),
                ],
            ],
        ]);
    }
}