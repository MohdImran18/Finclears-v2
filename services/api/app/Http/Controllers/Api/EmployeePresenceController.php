<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeePresence;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeePresenceController extends Controller
{
    public function heartbeat(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (!$user || !$user->isEmployee() || !$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Only active employee accounts can update presence.',
            ], 403);
        }

        $validated = $request->validate([
            'active' => ['sometimes', 'boolean'],
        ]);

        $now = now(config('employee-monitoring.timezone', 'Asia/Kolkata'));
        $isActive = (bool) ($validated['active'] ?? true);

        // Presence is based on the employee portal activity signal.
        // No camera, microphone or screen permissions are requested.
        $presence = EmployeePresence::query()->firstOrNew([
            'user_id' => $user->id,
        ]);

        $presence->status = $isActive ? 'online' : 'away';
        $presence->last_seen_at = $now;

        if ($isActive) {
            $presence->last_activity_at = $now;
        }

        $presence->save();

        return response()->json([
            'success' => true,
            'data' => [
                'status' => $presence->status,
                'last_seen_at' => $presence->last_seen_at?->toISOString(),
                'heartbeat_interval_seconds' => 30,
            ],
        ]);
    }

    public function index(Request $request, EmployeeAccessScope $scope): JsonResponse
    {
        $actor = $request->user();

        if (!$actor || !$actor->can('monitoring.view')) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to view employee monitoring.',
            ], 403);
        }

        $timeout = (int) config('employee-monitoring.presence_offline_after_seconds', 90);
        $cutoff = now(config('employee-monitoring.timezone', 'Asia/Kolkata'))->subSeconds(max(30, $timeout));

        $profiles = $scope->query($actor)
            ->whereHas('user', fn ($query) => $query
                ->where('role', User::ROLE_EMPLOYEE)
                ->where('status', User::STATUS_ACTIVE))
            ->with([
                'user:id,name,email,role,status',
                'department:id,name',
                'designation:id,name',
                'user.presence',
            ])
            ->orderBy('id')
            ->paginate(min(max((int) $request->integer('per_page', 25), 1), 100));

        $data = $profiles->getCollection()->map(function ($profile) use ($cutoff) {
            $presence = $profile->user?->presence;
            $lastSeen = $presence?->last_seen_at;
            $isFresh = $lastSeen && $lastSeen->greaterThanOrEqualTo($cutoff);
            $storedStatus = $presence?->status;
            $status = !$isFresh ? 'offline' : ($storedStatus === 'away' ? 'away' : 'online');

            return [
                'employee_profile_id' => $profile->id,
                'user_id' => $profile->user_id,
                'employee_code' => $profile->employee_code,
                'name' => $profile->user?->name,
                'email' => $profile->user?->email,
                'department' => $profile->department?->name,
                'designation' => $profile->designation?->name,
                'presence_status' => $status,
                'last_seen_at' => $lastSeen?->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'last_page' => $profiles->lastPage(),
                'per_page' => $profiles->perPage(),
                'total' => $profiles->total(),
                'offline_after_seconds' => max(30, $timeout),
            ],
        ]);
    }
}
