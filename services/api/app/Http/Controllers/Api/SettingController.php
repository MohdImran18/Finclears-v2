<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SettingUpdateRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * List settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Settings fetched successfully.',
            'data' => SettingResource::collection($settings),
        ]);
    }

    /**
     * Show a single setting.
     */
    public function show(Setting $setting): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Setting fetched successfully.',
            'data' => new SettingResource($setting),
        ]);
    }

    /**
     * Update a setting.
     */
    public function update(
        SettingUpdateRequest $request,
        Setting $setting
    ): JsonResponse {
        $setting->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully.',
            'data' => new SettingResource(
                $setting->fresh()
            ),
        ]);
    }

    /**
     * Delete a setting.
     */
    public function destroy(Setting $setting): JsonResponse
    {
        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Setting deleted successfully.',
        ]);
    }
}