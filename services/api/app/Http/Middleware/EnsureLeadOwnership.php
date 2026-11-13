<?php

namespace App\Http\Middleware;

use App\Models\Lead;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLeadOwnership
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $lead = $request->route('lead');

        if ($user && $user->role === 'employee' && $lead instanceof Lead) {
            $isAssignmentRequest = $request->route()->getActionMethod() === 'assign';

            if ($isAssignmentRequest) {
                if ($lead->assigned_to !== null) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This lead is no longer available in the pool.',
                    ], 409);
                }
            } elseif ((int) $lead->assigned_to !== (int) $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to access this lead.',
                ], 404);
            }
        }

        return $next($request);
    }
}
