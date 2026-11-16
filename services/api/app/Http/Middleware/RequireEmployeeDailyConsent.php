<?php

namespace App\Http\Middleware;

use App\Models\EmployeeDailyConsent;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireEmployeeDailyConsent
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Apply only to the exact employee role.
        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $next($request);
        }

        // Policy must be formally approved and available.
        $policyApproved = (bool) config(
            'employee-monitoring.policy_approved',
            false
        );

        $policyText = config('employee-monitoring.policy_text');
        $policyVersion = config('employee-monitoring.policy_version');

        if (
            !$policyApproved ||
            !is_string($policyText) ||
            trim($policyText) === '' ||
            !is_string($policyVersion) ||
            trim($policyVersion) === ''
        ) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_POLICY_NOT_AVAILABLE',
                'message' => 'Employee monitoring policy is not currently approved or available.',
            ], 503);
        }

        $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');
        $workDate = now($timezone)->toDateString();

        $consent = EmployeeDailyConsent::query()
            ->where('user_id', $user->id)
            ->whereDate('work_date', $workDate)
            ->where('policy_version', $policyVersion)
            ->first();

        // No consent record for today means daily consent is required.
        if (!$consent) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_CONSENT_REQUIRED',
                'message' => 'Please review and accept the daily employee monitoring policy to access the portal.',
                'data' => [
                    'consent_required' => true,
                    'work_date' => $workDate,
                    'policy_version' => $policyVersion,
                ],
            ], 403);
        }

        // Require an explicit full-portal token ability.
        // Wildcard legacy tokens are intentionally not accepted.
        $token = $user->currentAccessToken();
        $abilities = $token?->abilities ?? [];

        if (
            !is_array($abilities) ||
            !in_array('employee-portal', $abilities, true)
        ) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_FULL_ACCESS_TOKEN_REQUIRED',
                'message' => 'Please complete the consent process and authenticate again.',
            ], 403);
        }

        // A full-access token is not sufficient if today's consent
        // was declined or withdrawn.
        if ($consent->status !== EmployeeDailyConsent::STATUS_ACCEPTED) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_CONSENT_REQUIRED',
                'message' => 'Please review and accept the daily employee monitoring policy to access the portal.',
                'data' => [
                    'consent_required' => true,
                    'work_date' => $workDate,
                    'policy_version' => $policyVersion,
                ],
            ], 403);
        }

        return $next($request);
    }
}
