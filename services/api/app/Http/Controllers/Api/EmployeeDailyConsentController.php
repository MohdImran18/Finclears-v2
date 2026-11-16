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

class EmployeeDailyConsentController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $this->forbidden();
        }

        $workDate = $this->currentWorkDate();
        $policyVersion = config('employee-monitoring.policy_version');

        $consent = EmployeeDailyConsent::query()
            ->where('user_id', $user->id)
            ->whereDate('work_date', $workDate)
            ->where('policy_version', $policyVersion)
            ->first();

        $policyAvailable = $this->isPolicyAvailable();

        return response()->json([
            'success' => true,
            'data' => [
                'work_date' => $workDate,
                'policy_version' => $policyVersion,
                'policy_available' => $policyAvailable,
                'policy_text' => $policyAvailable
                    ? config('employee-monitoring.policy_text')
                    : null,
                'retention_period' => $policyAvailable
                    ? config('employee-monitoring.retention_period')
                    : null,
                'support_contact' => $policyAvailable
                    ? config('employee-monitoring.support_contact')
                    : null,
                'status' => $consent?->status ?? EmployeeDailyConsent::STATUS_PENDING,
                'accepted_at' => $consent?->accepted_at,
                'withdrawn_at' => $consent?->withdrawn_at,
            ],
        ]);
    }

    public function accept(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $this->forbidden();
        }

        if (!$this->isPolicyAvailable()) {
            return $this->policyUnavailable();
        }

        $validated = $request->validate([
            'policy_version' => ['required', 'string', 'max:50'],
        ]);

        $policyVersion = config('employee-monitoring.policy_version');

        if ($validated['policy_version'] !== $policyVersion) {
            return response()->json([
                'success' => false,
                'code' => 'POLICY_VERSION_MISMATCH',
                'message' => 'Please refresh and review the latest policy.',
            ], 409);
        }

        $result = DB::transaction(function () use (
            $request,
            $user,
            $policyVersion
        ) {
            $consent = $this->saveConsent(
                $request,
                $user,
                $policyVersion,
                EmployeeDailyConsent::STATUS_ACCEPTED,
                'accepted'
            );

            $token = $this->replaceToken($user, true);

            return [
                'consent' => $consent,
                'token' => $token,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Daily consent accepted successfully.',
            'data' => [
                'status' => $result['consent']->status,
                'work_date' => $result['consent']->work_date,
                'policy_version' => $policyVersion,
                'token' => $result['token'],
                'token_type' => 'Bearer',
            ],
        ]);
    }

    public function decline(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $this->forbidden();
        }

        if (!$this->isPolicyAvailable()) {
            return $this->policyUnavailable();
        }

        $validated = $request->validate([
            'policy_version' => ['required', 'string', 'max:50'],
        ]);

        $policyVersion = config('employee-monitoring.policy_version');

        if ($validated['policy_version'] !== $policyVersion) {
            return response()->json([
                'success' => false,
                'code' => 'POLICY_VERSION_MISMATCH',
                'message' => 'Please refresh and review the latest policy.',
            ], 409);
        }

        $result = DB::transaction(function () use (
            $request,
            $user,
            $policyVersion
        ) {
            $consent = $this->saveConsent(
                $request,
                $user,
                $policyVersion,
                EmployeeDailyConsent::STATUS_DECLINED,
                'declined'
            );

            $token = $this->replaceToken($user, false);

            return [
                'consent' => $consent,
                'token' => $token,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Consent declined. Employee portal access is restricted.',
            'data' => [
                'status' => $result['consent']->status,
                'token' => $result['token'],
                'token_type' => 'Bearer',
            ],
        ]);
    }

    public function withdraw(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'policy_version' => ['required', 'string', 'max:50'],
        ]);

        $policyVersion = config('employee-monitoring.policy_version');

        if ($validated['policy_version'] !== $policyVersion) {
            return response()->json([
                'success' => false,
                'code' => 'POLICY_VERSION_MISMATCH',
                'message' => 'The policy version does not match.',
            ], 409);
        }

        $workDate = $this->currentWorkDate();

        $result = DB::transaction(function () use (
            $request,
            $user,
            $policyVersion,
            $workDate
        ) {
            // Lock employee before checking active consent.
            User::query()
                ->whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();

            $existingConsent = EmployeeDailyConsent::query()
                ->where('user_id', $user->id)
                ->whereDate('work_date', $workDate)
                ->where('policy_version', $policyVersion)
                ->lockForUpdate()
                ->first();

            if (
                !$existingConsent ||
                $existingConsent->status !== EmployeeDailyConsent::STATUS_ACCEPTED
            ) {
                return null;
            }

            $consent = $this->saveConsent(
                $request,
                $user,
                $policyVersion,
                EmployeeDailyConsent::STATUS_WITHDRAWN,
                'withdrawn',
                $workDate
            );

                        // CONSENT_WITHDRAWAL_SESSION_TERMINATION
            // Stop pending and accepted monitoring sessions in the same transaction.
            $sessions = EmployeeMonitoringSession::query()
                ->where('employee_user_id', $user->id)
                ->whereIn('status', [
                    EmployeeMonitoringSession::STATUS_PENDING,
                    EmployeeMonitoringSession::STATUS_ACCEPTED,
                ])
                ->lockForUpdate()
                ->get();

            foreach ($sessions as $session) {
                $wasAccepted = $session->status === EmployeeMonitoringSession::STATUS_ACCEPTED;

                $session->update([
                    'status' => $wasAccepted
                        ? EmployeeMonitoringSession::STATUS_ENDED
                        : EmployeeMonitoringSession::STATUS_CANCELLED,
                    'ended_at' => now(),
                ]);

                EmployeeMonitoringAuditEvent::query()->create([
                    'employee_user_id' => $user->id,
                    'actor_user_id' => $user->id,
                    'event' => $wasAccepted
                        ? 'session_ended_by_consent_withdrawal'
                        : 'session_cancelled_by_consent_withdrawal',
                    'policy_version' => $policyVersion,
                    'occurred_at' => now(config('employee-monitoring.timezone', 'Asia/Kolkata')),
                    'metadata' => [
                        'session_id' => $session->id,
                        'previous_status' => $wasAccepted ? 'accepted' : 'pending',
                        'reason' => 'employee_consent_withdrawn',
                    ],
                ]);
            }
            $token = $this->replaceToken($user, false);

            return [
                'consent' => $consent,
                'token' => $token,
            ];
        });

        if ($result === null) {
            return response()->json([
                'success' => false,
                'code' => 'NO_ACTIVE_CONSENT',
                'message' => 'There is no active consent to withdraw.',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Consent withdrawn. Employee portal access is restricted.',
            'data' => [
                'status' => $result['consent']->status,
                'withdrawn_at' => $result['consent']->withdrawn_at,
                'token' => $result['token'],
                'token_type' => 'Bearer',
            ],
        ]);
    }

    private function currentWorkDate(): string
    {
        $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');

        return now($timezone)->toDateString();
    }
    private function saveConsent(
        Request $request,
        User $user,
        string $policyVersion,
        string $newStatus,
        string $event,
        ?string $workDate = null
    ): EmployeeDailyConsent {
        $workDate = $workDate ?? $this->currentWorkDate();

        // Serialize consent changes for this employee.
        User::query()
            ->whereKey($user->id)
            ->lockForUpdate()
            ->firstOrFail();

        $consent = EmployeeDailyConsent::query()
            ->where('user_id', $user->id)
            ->whereDate('work_date', $workDate)
            ->where('policy_version', $policyVersion)
            ->lockForUpdate()
            ->first();

        $previousStatus = $consent?->status;

        if (!$consent) {
            $consent = new EmployeeDailyConsent([
                'user_id' => $user->id,
                'work_date' => $workDate,
                'policy_version' => $policyVersion,
            ]);
        }

        if (
            $newStatus === EmployeeDailyConsent::STATUS_ACCEPTED &&
            in_array($previousStatus, [
                EmployeeDailyConsent::STATUS_DECLINED,
                EmployeeDailyConsent::STATUS_WITHDRAWN,
            ], true)
        ) {
            $event = 'reaccepted';
        }

        $consent->status = $newStatus;

        if ($newStatus === EmployeeDailyConsent::STATUS_ACCEPTED) {
            $consent->accepted_at = now();
            $consent->withdrawn_at = null;
        } elseif ($newStatus === EmployeeDailyConsent::STATUS_DECLINED) {
            $consent->accepted_at = null;
            $consent->withdrawn_at = null;
        } elseif ($newStatus === EmployeeDailyConsent::STATUS_WITHDRAWN) {
            $consent->withdrawn_at = now();
        }

        $consent->ip_address = $request->ip();
        $consent->user_agent = $request->userAgent();
        $consent->save();

        EmployeeMonitoringAuditEvent::create([
            'employee_user_id' => $user->id,
            'actor_user_id' => $user->id,
            'event' => $event,
            'policy_version' => $policyVersion,
            'occurred_at' => now(),
            'metadata' => [
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
                'work_date' => $workDate,
            ],
        ]);

        return $consent;
    }

    private function replaceToken(User $user, bool $fullAccess): string
    {
        // Invalidate all previous sessions before issuing a new token.
        $user->tokens()->delete();

        $abilities = $fullAccess
            ? ['employee-consent', 'employee-portal']
            : ['employee-consent'];

        return $user->createToken(
            'employee-portal',
            $abilities
        )->plainTextToken;
    }

    private function isPolicyAvailable(): bool
    {
        return (bool) config('employee-monitoring.policy_approved', false)
            && is_string(config('employee-monitoring.policy_text'))
            && trim(config('employee-monitoring.policy_text')) !== ''
            && filled(config('employee-monitoring.policy_version'));
    }

    private function policyUnavailable(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code' => 'POLICY_NOT_APPROVED',
            'message' => 'The employee monitoring policy is awaiting approval.',
        ], 409);
    }

    private function forbidden(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'This endpoint is available only to employees.',
        ], 403);
    }
}