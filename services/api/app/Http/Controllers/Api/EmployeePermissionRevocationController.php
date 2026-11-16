<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringAuditEvent;
use App\Models\EmployeeMonitoringSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmployeePermissionRevocationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== User::ROLE_EMPLOYEE) {
            return response()->json([
                'success' => false,
                'message' => 'This action is available only to employees.',
            ], 403);
        }

        $validated = $request->validate([
            'permission' => [
                'required',
                'string',
                Rule::in(['camera', 'microphone']),
            ],
        ]);

        $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');
        $occurredAt = now($timezone);
        $policyVersion = config('employee-monitoring.policy_version');

        DB::transaction(function () use (
            $user,
            $validated,
            $occurredAt,
            $policyVersion
        ) {
            User::query()
                ->whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();

            $sessions = EmployeeMonitoringSession::query()
                ->where('employee_user_id', $user->id)
                ->whereIn('status', [
                    EmployeeMonitoringSession::STATUS_PENDING,
                    EmployeeMonitoringSession::STATUS_ACCEPTED,
                ])
                ->lockForUpdate()
                ->get();

            foreach ($sessions as $session) {
                $previousStatus = $session->status;
                $wasAccepted = $previousStatus ===
                    EmployeeMonitoringSession::STATUS_ACCEPTED;

                $session->update([
                    'status' => $wasAccepted
                        ? EmployeeMonitoringSession::STATUS_ENDED
                        : EmployeeMonitoringSession::STATUS_CANCELLED,
                    'ended_at' => $occurredAt,
                ]);

                EmployeeMonitoringAuditEvent::query()->create([
                    'employee_user_id' => $user->id,
                    'actor_user_id' => $user->id,
                    'event' => 'session_ended_by_permission_revocation',
                    'policy_version' => $policyVersion,
                    'occurred_at' => $occurredAt,
                    'metadata' => [
                        'session_id' => $session->id,
                        'previous_status' => $previousStatus,
                        'permission' => $validated['permission'],
                    ],
                ]);
            }

            EmployeeMonitoringAuditEvent::query()->create([
                'employee_user_id' => $user->id,
                'actor_user_id' => $user->id,
                'event' => 'employee_logged_out_by_permission_revocation',
                'policy_version' => $policyVersion,
                'occurred_at' => $occurredAt,
                'metadata' => [
                    'permission' => $validated['permission'],
                    'reason' => 'confirmed_browser_permission_revocation',
                    'sessions_terminated' => $sessions->count(),
                ],
            ]);

            // Revoke every active Sanctum token for this employee.
            $user->tokens()->delete();
        });

        return response()->json([
            'success' => true,
            'code' => 'EMPLOYEE_PERMISSION_REVOKED',
            'message' => 'Required browser permission was revoked. Employee sessions have been terminated and the account has been logged out.',
        ]);
    }
}