<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeMonitoringAuditEvent;
use App\Models\EmployeeMonitoringSession;
use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeProfile;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmployeeMonitoringSessionController extends Controller
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

    private function canRequest(User $actor): bool
    {
        if (!$actor->isActive() || $actor->isEmployee()) {
            return false;
        }

        $roleAllowed = in_array($actor->role, ['admin', 'super_admin'], true)
            || $actor->hasAnyRole(self::REQUESTER_ROLES);

        return $roleAllowed && $actor->can('monitoring.view');
    }

    private function audit(
        int $employeeId,
        int $actorId,
        string $event,
        array $metadata = []
    ): void {
        EmployeeMonitoringAuditEvent::query()->create([
            'employee_user_id' => $employeeId,
            'actor_user_id' => $actorId,
            'event' => $event,
            'policy_version' => config('employee-monitoring.policy_version'),
            'occurred_at' => now(config('employee-monitoring.timezone', 'Asia/Kolkata')),
            'metadata' => $metadata,
        ]);
    }

        private function expirePending(int $employeeId): void
    {
        $now = now(config('employee-monitoring.timezone', 'Asia/Kolkata'));

        $expired = EmployeeMonitoringSession::query()
            ->where('employee_user_id', $employeeId)
            ->where('status', EmployeeMonitoringSession::STATUS_PENDING)
            ->where('expires_at', '<=', $now)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        foreach ($expired as $session) {
            $session->update([
                'status' => EmployeeMonitoringSession::STATUS_EXPIRED,
            ]);

            $this->audit(
                $session->employee_user_id,
                $session->requester_user_id,
                'session_expired',
                ['session_id' => $session->id]
            );
        }
    }
public function requestSession(Request $request, EmployeeAccessScope $scope): JsonResponse
    {
        $actor = $request->user();

        if (!$actor || !$this->canRequest($actor)) {
            return response()->json([
                'success' => false,
                'code' => 'MONITORING_REQUEST_FORBIDDEN',
                'message' => 'You are not authorized to start monitoring.',
            ], 403);
        }

        if (!config('employee-monitoring.policy_approved') ||
            !is_string(config('employee-monitoring.policy_text')) ||
            trim(config('employee-monitoring.policy_text')) === '') {
            return response()->json([
                'success' => false,
                'message' => 'Monitoring policy is not approved.',
            ], 403);
        }

        $validated = $request->validate([
            'employee_user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $employee = User::query()
            ->whereKey($validated['employee_user_id'])
            ->where('role', User::ROLE_EMPLOYEE)
            ->where('status', User::STATUS_ACTIVE)
            ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Active employee not found.',
            ], 404);
        }

        $profile = EmployeeProfile::query()
            ->where('user_id', $employee->id)
            ->first();

        if (!$profile || !$scope->canAccess($actor, $profile)) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_OUT_OF_SCOPE',
                'message' => 'Employee is outside your access scope.',
            ], 403);
        }

        $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');
        $now = now($timezone);

        $consent = EmployeeDailyConsent::query()
            ->where('user_id', $employee->id)
            ->whereDate('work_date', $now->toDateString())
            ->where('policy_version', config('employee-monitoring.policy_version'))
            ->where('status', EmployeeDailyConsent::STATUS_ACCEPTED)
            ->first();

        if (!$consent) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_CONSENT_REQUIRED',
                'message' => 'Employee has not accepted today’s monitoring policy.',
            ], 403);
        }

        $session = DB::transaction(function () use ($actor, $employee, $now) {
            User::query()->whereKey($employee->id)->lockForUpdate()->firstOrFail();

            $this->expirePending($employee->id);

            $existing = EmployeeMonitoringSession::query()
                ->where('employee_user_id', $employee->id)
                ->whereIn('status', [
                    EmployeeMonitoringSession::STATUS_PENDING,
                    EmployeeMonitoringSession::STATUS_ACCEPTED,
                ])
                ->lockForUpdate()
                ->first();

            if ($existing) {
                return ['conflict' => true];
            }

            $session = EmployeeMonitoringSession::query()->create([
                'employee_user_id' => $employee->id,
                'requester_user_id' => $actor->id,
                'status' => EmployeeMonitoringSession::STATUS_ACCEPTED,
                'requested_at' => $now,
                'responded_at' => $now,
                'started_at' => $now,
                'expires_at' => $now->copy()->addDay(),
                'response_note' => 'Started by authorized administrator under approved policy.',
            ]);

            $this->audit($employee->id, $actor->id, 'session_started_by_admin', [
                'session_id' => $session->id,
                'policy_version' => config('employee-monitoring.policy_version'),
                'started_at' => $now->toISOString(),
            ]);

            return $session;
        });

        if (is_array($session) && ($session['conflict'] ?? false)) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_SESSION_ALREADY_ACTIVE',
                'message' => 'Employee already has an active monitoring session.',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Monitoring session started.',
            'data' => $session->load([
                'employee:id,name,email',
                'requester:id,name,email',
            ]),
        ], 201);
    }

public function active(Request $request): JsonResponse
{
    $employee = $request->user();

    if (!$employee || !$employee->isEmployee() || !$employee->isActive()) {
        return response()->json([
            'success' => false,
            'message' => 'Employee access only.',
        ], 403);
    }

    $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');

    $consentExists = EmployeeDailyConsent::query()
        ->where('user_id', $employee->id)
        ->whereDate('work_date', now($timezone)->toDateString())
        ->where('policy_version', config('employee-monitoring.policy_version'))
        ->where('status', EmployeeDailyConsent::STATUS_ACCEPTED)
        ->exists();

    if (!$consentExists) {
        return response()->json([
            'success' => true,
            'data' => null,
        ]);
    }

    $session = EmployeeMonitoringSession::query()
        ->where('employee_user_id', $employee->id)
        ->where('status', EmployeeMonitoringSession::STATUS_ACCEPTED)
        ->with('requester:id,name,email')
        ->orderByDesc('started_at')
        ->first();

    return response()->json([
        'success' => true,
        'data' => $session,
    ]);
}
public function pending(Request $request): JsonResponse
    {
        $employee = $request->user();

        if (!$employee || !$employee->isEmployee() || !$employee->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Employee access only.',
            ], 403);
        }

        $sessions = DB::transaction(function () use ($employee) {
            $this->expirePending($employee->id);

            return EmployeeMonitoringSession::query()
                ->where('employee_user_id', $employee->id)
                ->where('status', EmployeeMonitoringSession::STATUS_PENDING)
                ->where('expires_at', '>', now(config('employee-monitoring.timezone', 'Asia/Kolkata')))
                ->with('requester:id,name,email')
                ->orderByDesc('requested_at')
                ->get();
        });

        return response()->json(['success' => true, 'data' => $sessions]);
    }
public function respond(Request $request, int $id): JsonResponse
    {
        $employee = $request->user();

        if (!$employee || !$employee->isEmployee() || !$employee->isActive()) {
            return response()->json(['success' => false, 'message' => 'Employee access only.'], 403);
        }

        $validated = $request->validate([
            'decision' => ['required', Rule::in(['accept', 'reject'])],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $result = DB::transaction(function () use ($employee, $id, $validated) {
            $session = EmployeeMonitoringSession::query()
                ->whereKey($id)
                ->where('employee_user_id', $employee->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($session->status !== EmployeeMonitoringSession::STATUS_PENDING) {
                abort(409, 'This request is no longer pending.');
            }

            $now = now(config('employee-monitoring.timezone', 'Asia/Kolkata'));

            if ($session->expires_at->lessThanOrEqualTo($now)) {
                $session->update([
                    'status' => EmployeeMonitoringSession::STATUS_EXPIRED,
                ]);

                $this->audit($employee->id, $employee->id, 'session_expired', [
                    'session_id' => $session->id,
                ]);

                return ['expired' => true, 'session' => null];
            }

            $accepted = $validated['decision'] === 'accept';

            $session->update([
                'status' => $accepted
                    ? EmployeeMonitoringSession::STATUS_ACCEPTED
                    : EmployeeMonitoringSession::STATUS_REJECTED,
                'responded_at' => $now,
                'started_at' => $accepted ? $now : null,
                'response_note' => $validated['note'] ?? null,
            ]);

            $this->audit(
                $employee->id,
                $employee->id,
                $accepted ? 'session_accepted' : 'session_rejected',
                ['session_id' => $session->id]
            );

            return [
                'expired' => false,
                'session' => $session->fresh(['employee:id,name,email', 'requester:id,name,email']),
            ];
        });

        if ($result['expired']) {
            return response()->json([
                'success' => false,
                'code' => 'SESSION_REQUEST_EXPIRED',
                'message' => 'This request has expired.',
            ], 409);
        }

        return response()->json(['success' => true, 'data' => $result['session']]);
    }
public function cancel(Request $request, int $id): JsonResponse
    {
        $actor = $request->user();

        if (!$actor || !$this->canRequest($actor)) {
            return response()->json(['success' => false, 'message' => 'Not authorized.'], 403);
        }

        $session = DB::transaction(function () use ($actor, $id) {
            $session = EmployeeMonitoringSession::query()
                ->whereKey($id)
                ->where('requester_user_id', $actor->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (!in_array($session->status, [
                EmployeeMonitoringSession::STATUS_PENDING,
                EmployeeMonitoringSession::STATUS_ACCEPTED,
            ], true)) {
                abort(409, 'This session cannot be cancelled.');
            }

            $session->update([
                'status' => EmployeeMonitoringSession::STATUS_CANCELLED,
                'ended_at' => now(),
            ]);

            $this->audit(
                $session->employee_user_id,
                $actor->id,
                'session_cancelled',
                ['session_id' => $session->id]
            );

            return $session->fresh();
        });

        return response()->json(['success' => true, 'data' => $session]);
    }

        public function end(Request $request, int $id, EmployeeAccessScope $scope): JsonResponse
    {
        $actor = $request->user();

        if (!$actor || !$actor->isActive()) {
            return response()->json(['success' => false, 'message' => 'Not authorized.'], 403);
        }

        $session = DB::transaction(function () use ($actor, $id, $scope) {
            $session = EmployeeMonitoringSession::query()
                ->whereKey($id)
                ->lockForUpdate()
                ->firstOrFail();

            $isEmployee = $actor->isEmployee()
                && $session->employee_user_id === $actor->id;

            $isRequester = $session->requester_user_id === $actor->id
                && $this->canRequest($actor);

            if (!$isEmployee && !$isRequester) {
                abort(403, 'Not authorized to end this session.');
            }

            if ($isRequester) {
                $profile = EmployeeProfile::query()
                    ->where('user_id', $session->employee_user_id)
                    ->first();

                if (!$profile || !$scope->canAccess($actor, $profile)) {
                    abort(403, 'Employee is outside your access scope.');
                }
            }

            if ($session->status !== EmployeeMonitoringSession::STATUS_ACCEPTED) {
                abort(409, 'Session is not active.');
            }

            $now = now(config('employee-monitoring.timezone', 'Asia/Kolkata'));

            $session->update([
                'status' => EmployeeMonitoringSession::STATUS_ENDED,
                'ended_at' => $now,
            ]);

            $this->audit(
                $session->employee_user_id,
                $actor->id,
                'session_ended',
                ['session_id' => $session->id]
            );

            return $session->fresh(['employee:id,name,email', 'requester:id,name,email']);
        });

        return response()->json(['success' => true, 'data' => $session]);
    }
public function index(Request $request, EmployeeAccessScope $scope): JsonResponse
    {
        $actor = $request->user();

        if (!$actor || !$this->canRequest($actor) || !$actor->can('monitoring.audit')) {
            return response()->json(['success' => false, 'message' => 'Audit access required.'], 403);
        }

        $query = EmployeeMonitoringSession::query()
            ->with(['employee:id,name,email', 'requester:id,name,email'])
            ->whereIn('employee_user_id', $scope->query($actor)->select('user_id'));

        if ($request->filled('status')) {
            $request->validate([
                'status' => ['string', Rule::in([
                    'pending', 'accepted', 'rejected', 'cancelled', 'expired', 'ended',
                ])],
            ]);
            $query->where('status', $request->string('status')->toString());
        }

        $sessions = $query->orderByDesc('requested_at')->paginate(25);

        return response()->json([
            'success' => true,
            'data' => $sessions->items(),
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }
}
