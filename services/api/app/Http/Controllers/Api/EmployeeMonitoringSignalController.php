<?php

namespace App\Http\Controllers\Api;

use App\Events\EmployeeMonitoringSignal;
use App\Http\Controllers\Controller;
use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringSession;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeMonitoringSignalController extends Controller
{
    private const REQUESTER_ROLES = [
        'admin',
        'super_admin',
        'hr-manager',
        'hr-executive',
        'department-manager',
        'team-lead',
        'finance-manager',
    ];

    public function store(
        Request $request,
        int $id,
        EmployeeAccessScope $scope
    ): JsonResponse {
        $actor = $request->user();

        $validated = $request->validate([
            'signal_type' => [
                'required',
                'string',
                Rule::in(['offer', 'answer', 'ice-candidate']),
            ],
            'payload' => ['required', 'array'],
        ]);

        $encodedPayload = json_encode(
            $validated['payload'],
            JSON_THROW_ON_ERROR
        );

        if (strlen($encodedPayload) > 65536) {
            abort(413, 'Signaling payload exceeds the 64 KB limit.');
        }

        $session = EmployeeMonitoringSession::query()->findOrFail($id);

        if ($session->status !== EmployeeMonitoringSession::STATUS_ACCEPTED) {
            abort(409, 'The monitoring session is not active.');
        }

        $employeeId = (int) $session->employee_user_id;

        $employee = User::query()
            ->whereKey($employeeId)
            ->where('role', User::ROLE_EMPLOYEE)
            ->where('status', User::STATUS_ACTIVE)
            ->first();

        if (!$employee) {
            abort(403, 'The employee account is not active.');
        }

        $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');
        $today = now($timezone)->toDateString();

        $hasActiveConsent = EmployeeDailyConsent::query()
            ->where('user_id', $employeeId)
            ->whereDate('work_date', $today)
            ->where('policy_version', config('employee-monitoring.policy_version', 'v1'))
            ->where('status', EmployeeDailyConsent::STATUS_ACCEPTED)
            ->whereNotNull('accepted_at')
            ->whereNull('withdrawn_at')
            ->exists();

        if (!$hasActiveConsent) {
            abort(403, 'The employee does not have active daily consent.');
        }

        if (
            (int) $actor->id === $employeeId
            && !$actor->isActive()
        ) {
            abort(403, 'Your employee account is not active.');
        }

        $isEmployeeParticipant = (int) $actor->id === $employeeId
            && $actor->isEmployee();

        $isRequesterParticipant = (int) $actor->id === (int) $session->requester_user_id;

        if ($isEmployeeParticipant) {
            // Employee may signal only in their own accepted session.
        } elseif ($isRequesterParticipant) {
            $roleAllowed = in_array($actor->role, ['admin', 'super_admin'], true)
                || $actor->hasAnyRole(self::REQUESTER_ROLES);

            if (
                !$actor->isActive()
                || !$roleAllowed
                || !$actor->can('monitoring.view')
            ) {
                abort(403, 'You are not authorised to join this session.');
            }

            $canAccessEmployee = $scope->query($actor)
                ->where('user_id', $employeeId)
                ->exists();

            if (!$canAccessEmployee) {
                abort(403, 'You no longer have access to this employee.');
            }
        } else {
            abort(404);
        }

        $this->validateSignalPayload(
            $validated['signal_type'],
            $validated['payload']
        );

        event(new EmployeeMonitoringSignal(
            sessionId: (int) $session->id,
            senderId: (int) $actor->id,
            signalType: $validated['signal_type'],
            payload: $validated['payload']
        ));

        return response()->json([
            'success' => true,
            'message' => 'Signaling message dispatched.',
        ], 202);
    }

    private function validateSignalPayload(
        string $signalType,
        array $payload
    ): void {
        if (in_array($signalType, ['offer', 'answer'], true)) {
            if (
                !isset($payload['sdp'])
                || !is_string($payload['sdp'])
                || strlen($payload['sdp']) > 60000
            ) {
                abort(422, 'A valid SDP payload is required.');
            }

            return;
        }

        if (
            !isset($payload['candidate'])
            || !is_string($payload['candidate'])
            || strlen($payload['candidate']) > 8192
        ) {
            abort(422, 'A valid ICE candidate is required.');
        }

        if (
            isset($payload['sdpMid'])
            && (!is_string($payload['sdpMid']) || strlen($payload['sdpMid']) > 256)
        ) {
            abort(422, 'Invalid ICE sdpMid.');
        }

        if (
            isset($payload['sdpMLineIndex'])
            && (!is_int($payload['sdpMLineIndex'])
                || $payload['sdpMLineIndex'] < 0
                || $payload['sdpMLineIndex'] > 65535)
        ) {
            abort(422, 'Invalid ICE sdpMLineIndex.');
        }

        if (
            isset($payload['usernameFragment'])
            && (!is_string($payload['usernameFragment'])
                || strlen($payload['usernameFragment']) > 256)
        ) {
            abort(422, 'Invalid ICE usernameFragment.');
        }
    }
}