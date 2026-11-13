<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceDescriptionImageController extends BaseController
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:5120',
            ],
        ]);

        $path = $validated['image']->store(
            'service-descriptions',
            'public'
        );

        if (!$path) {
            return $this->error('Image upload failed.', 500);
        }

        return $this->success([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
        ], 'Image uploaded successfully.');
    }
}
