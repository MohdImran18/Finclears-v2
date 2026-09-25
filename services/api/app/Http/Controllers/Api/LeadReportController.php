<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadFollowup;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $from = $request->filled('from')
            ? $request->date('from')->startOfDay()
            : now()->startOfMonth();

        $to = $request->filled('to')
            ? $request->date('to')->endOfDay()
            : now()->endOfDay();

        $base = Lead::query()
            ->whereNull('leads.deleted_at')
            ->whereBetween('leads.created_at', [$from, $to]);

        $total = (clone $base)->count();

        $converted = (clone $base)
            ->where('leads.status', 'converted')
            ->count();

        $lost = (clone $base)
            ->where('leads.status', 'lost')
            ->count();

        $pipeline = (clone $base)
            ->whereNotIn('leads.status', ['converted', 'lost'])
            ->sum('leads.estimated_value');

        $revenue = (clone $base)
            ->where('leads.status', 'converted')
            ->sum('leads.estimated_value');

        $conversionRate = $total > 0
            ? round(($converted / $total) * 100, 2)
            : 0;

        $sourcePerformance = (clone $base)
            ->leftJoin('lead_sources', 'lead_sources.id', '=', 'leads.source_id')
            ->select(
                'leads.source_id',
                'lead_sources.name',
                DB::raw('COUNT(leads.id) as total'),
                DB::raw("SUM(CASE WHEN leads.status = 'converted' THEN 1 ELSE 0 END) as converted"),
                DB::raw("SUM(CASE WHEN leads.status = 'lost' THEN 1 ELSE 0 END) as lost"),
                DB::raw('COALESCE(SUM(leads.estimated_value),0) as value')
            )
            ->groupBy('leads.source_id', 'lead_sources.name')
            ->orderByDesc('total')
            ->get();

        $employeePerformance = (clone $base)
            ->leftJoin('users', 'users.id', '=', 'leads.assigned_to')
            ->select(
                'leads.assigned_to',
                'users.name',
                DB::raw('COUNT(leads.id) as total'),
                DB::raw("SUM(CASE WHEN leads.status = 'converted' THEN 1 ELSE 0 END) as converted"),
                DB::raw("SUM(CASE WHEN leads.status = 'lost' THEN 1 ELSE 0 END) as lost"),
                DB::raw('COALESCE(SUM(leads.estimated_value),0) as value')
            )
            ->groupBy('leads.assigned_to', 'users.name')
            ->orderByDesc('total')
            ->get();

        $servicePerformance = (clone $base)
            ->leftJoin('services', 'services.id', '=', 'leads.service_id')
            ->select(
                'leads.service_id',
                'services.title',
                DB::raw('COUNT(leads.id) as total'),
                DB::raw("SUM(CASE WHEN leads.status = 'converted' THEN 1 ELSE 0 END) as converted"),
                DB::raw("SUM(CASE WHEN leads.status = 'lost' THEN 1 ELSE 0 END) as lost"),
                DB::raw('COALESCE(SUM(leads.estimated_value),0) as value')
            )
            ->groupBy('leads.service_id', 'services.title')
            ->orderByDesc('total')
            ->get();

        $lostReasons = (clone $base)
            ->where('leads.status', 'lost')
            ->select(
                DB::raw("COALESCE(leads.lost_reason, 'Not specified') as reason"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('leads.lost_reason')
            ->orderByDesc('total')
            ->get();

        $followups = LeadFollowup::query()
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed"),
                DB::raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending"),
                DB::raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled")
            )
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Lead reports fetched successfully.',
            'data' => [
                'filters' => [
                    'from' => $from->toDateString(),
                    'to' => $to->toDateString(),
                ],
                'summary' => [
                    'total_leads' => $total,
                    'converted_leads' => $converted,
                    'lost_leads' => $lost,
                    'conversion_rate' => $conversionRate,
                    'pipeline_value' => (float) $pipeline,
                    'revenue' => (float) $revenue,
                ],
                'source_performance' => $sourcePerformance,
                'employee_performance' => $employeePerformance,
                'service_performance' => $servicePerformance,
                'lost_reasons' => $lostReasons,
                'followup_performance' => $followups,
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $from = $request->filled('from')
            ? $request->date('from')->startOfDay()
            : now()->startOfMonth();

        $to = $request->filled('to')
            ? $request->date('to')->endOfDay()
            : now()->endOfDay();

        $leads = Lead::query()
            ->with([
                'assignedUser:id,name',
                'source:id,name',
                'service:id,title',
            ])
            ->whereNull('deleted_at')
            ->whereBetween('created_at', [$from, $to])
            ->latest()
            ->get();

        $filename = 'lead-report-' . $from->format('Y-m-d') . '-to-' . $to->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($leads) {
            $out = fopen('php://output', 'w');

            fputcsv($out, [
                'ID',
                'Name',
                'Email',
                'Phone',
                'Company',
                'Status',
                'Priority',
                'Owner',
                'Source',
                'Service',
                'Estimated Value',
                'Created At',
                'Next Follow Up',
                'Lost Reason',
            ]);

            foreach ($leads as $lead) {
                fputcsv($out, [
                    $lead->id,
                    $lead->name,
                    $lead->email,
                    $lead->phone,
                    $lead->company_name,
                    $lead->status,
                    $lead->priority,
                    $lead->assignedUser?->name,
                    $lead->source?->name,
                    $lead->service?->title,
                    $lead->estimated_value,
                    $lead->created_at,
                    $lead->next_follow_up_at,
                    $lead->lost_reason,
                ]);
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}