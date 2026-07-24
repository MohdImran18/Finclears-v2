<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function timeline(Document $document)
{
    return response()->json([
        "success" => true,
        "data" => [
            [
                "id" => 1,
                "action" => "uploaded",
                "user" => "Imran Malik",
                "remarks" => "Initial upload",
                "created_at" => now(),
            ],
            [
                "id" => 2,
                "action" => "verified",
                "user" => "CA Team",
                "remarks" => "All checks passed",
                "created_at" => now(),
            ],
        ],
    ]);
}
}
