<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceFaq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceFaqAdminController extends Controller
{
    public function index(int $service): JsonResponse
    {
        if (!Service::find($service)) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found.',
            ], 404);
        }

        $faqs = ServiceFaq::where('service_id', $service)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'FAQs fetched successfully.',
            'data' => [
                'faqs' => $faqs,
            ],
        ]);
    }

    public function store(Request $request, int $service): JsonResponse
    {
        if (!Service::find($service)) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'question' => ['required', 'string', 'max:1000'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $faq = ServiceFaq::create([
            'service_id' => $service,
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data' => [
                'faq' => $faq,
            ],
        ], 201);
    }

    public function show(int $service, int $faq): JsonResponse
    {
        $item = ServiceFaq::where('service_id', $service)
            ->where('id', $faq)
            ->first();

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'FAQ fetched successfully.',
            'data' => [
                'faq' => $item,
            ],
        ]);
    }

    public function update(
        Request $request,
        int $service,
        int $faq
    ): JsonResponse {
        $item = ServiceFaq::where('service_id', $service)
            ->where('id', $faq)
            ->first();

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'question' => ['required', 'string', 'max:1000'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $item->update([
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data' => [
                'faq' => $item->fresh(),
            ],
        ]);
    }

    public function destroy(int $service, int $faq): JsonResponse
    {
        $item = ServiceFaq::where('service_id', $service)
            ->where('id', $faq)
            ->first();

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found.',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.',
        ]);
    }
}