<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireEmployeeConsentToken
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Apply only to exact employee role.
        if ($user->role !== User::ROLE_EMPLOYEE) {
            return $next($request);
        }

        // Require explicit consent-token ability.
        // Wildcard tokens are intentionally rejected.
        $token = $user->currentAccessToken();
        $abilities = $token?->abilities ?? [];

        if (
            !is_array($abilities) ||
            !in_array('employee-consent', $abilities, true)
        ) {
            return response()->json([
                'success' => false,
                'code' => 'EMPLOYEE_CONSENT_TOKEN_REQUIRED',
                'message' => 'Please authenticate again to continue the consent process.',
            ], 403);
        }

        return $next($request);
    }
}