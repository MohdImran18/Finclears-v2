<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Lead;
use App\Models\LeadFollowup;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CrmDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $base = Lead::query()
            ->whereNull('leads.deleted_at');

        $total = (clone $base)->count();

        $statusCounts = (clone $base)
            ->select('leads.status', DB::raw('COUNT(leads.id) as total'))
            ->groupBy('leads.status')
            ->pluck('total', 'status');

        $priorityCounts = (clone $base)
            ->select('leads.priority', DB::raw('COUNT(leads.id) as total'))
            ->groupBy('leads.priority')
            ->pluck('total', 'priority');

        $unassigned = (clone $base)
            ->whereNull('leads.assigned_to')
            ->count();

        $activeOwnership = (clone $base)
            ->where('leads.ownership_status', 'active')
            ->count();

        $expiredOwnership = (clone $base)
            ->where('leads.ownership_status', 'expired')
            ->count();

        $expiringSoon = (clone $base)
            ->where('leads.ownership_status', 'active')
            ->whereNotNull('leads.ownership_expires_at')
            ->whereBetween(
                'leads.ownership_expires_at',
                [now(), now()->copy()->addDays(3)]
            )
            ->count();

        $pipelineValue = (clone $base)
            ->whereNotIn('leads.status', ['converted', 'lost'])
            ->sum('leads.estimated_value');

        $convertedValue = (clone $base)
            ->where('leads.status', 'converted')
            ->sum('leads.estimated_value');

        $converted = (clone $base)
            ->where('leads.status', 'converted')
            ->count();

        $conversionRate = $total > 0
            ? round(($converted / $total) * 100, 2)
            : 0;

        $leadsByOwner = (clone $base)
            ->leftJoin('users', 'users.id', '=', 'leads.assigned_to')
            ->select(
                'leads.assigned_to',
                'users.name',
                DB::raw('COUNT(leads.id) as total')
            )
            ->groupBy('leads.assigned_to', 'users.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $leadsBySource = (clone $base)
            ->leftJoin(
                'lead_sources',
                'lead_sources.id',
                '=',
                'leads.source_id'
            )
            ->select(
                'leads.source_id',
                'lead_sources.name',
                DB::raw('COUNT(leads.id) as total')
            )
            ->groupBy('leads.source_id', 'lead_sources.name')
            ->orderByDesc('total')
            ->get();

        $leadsByService = (clone $base)
            ->leftJoin(
                'services',
                'services.id',
                '=',
                'leads.service_id'
            )
            ->select(
                'leads.service_id',
                'services.title',
                DB::raw('COUNT(leads.id) as total')
            )
            ->groupBy('leads.service_id', 'services.title')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $upcomingFollowups = LeadFollowup::query()
            ->with([
                'lead:id,name,phone',
                'user:id,name',
            ])
            ->where('status', 'pending')
            ->whereNotNull('follow_up_at')
            ->where('follow_up_at', '>=', now())
            ->orderBy('follow_up_at')
            ->limit(10)
            ->get();

        $recentActivity = ActivityLog::query()
            ->with([
                'lead:id,name',
                'user:id,name',
            ])
            ->whereNotNull('lead_id')
            ->latest('activity_at')
            ->limit(15)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'CRM dashboard fetched successfully.',
            'data' => [
                'summary' => [
                    'total_leads' => $total,
                    'new_leads' => (int) ($statusCounts['new'] ?? 0),
                    'contacted_leads' => (int) ($statusCounts['contacted'] ?? 0),
                    'qualified_leads' => (int) ($statusCounts['qualified'] ?? 0),
                    'converted_leads' => $converted,
                    'lost_leads' => (int) ($statusCounts['lost'] ?? 0),
                    'unassigned_leads' => $unassigned,
                    'active_ownership' => $activeOwnership,
                    'expired_ownership' => $expiredOwnership,
                    'expiring_soon' => $expiringSoon,
                    'pipeline_value' => (float) $pipelineValue,
                    'converted_value' => (float) $convertedValue,
                    'conversion_rate' => $conversionRate,
                ],
                'status_breakdown' => $statusCounts,
                'priority_breakdown' => $priorityCounts,
                'leads_by_owner' => $leadsByOwner,
                'leads_by_source' => $leadsBySource,
                'leads_by_service' => $leadsByService,
                'upcoming_followups' => $upcomingFollowups,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}