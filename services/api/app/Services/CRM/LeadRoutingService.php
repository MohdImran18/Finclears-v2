<?php

namespace App\Services\CRM;

use App\Models\Lead;
use App\Models\LeadRoutingRule;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class LeadRoutingService
{
    public function findAssignee(Lead $lead): ?User
    {
        if ($lead->assigned_to !== null) {
            return null;
        }

        $lead->loadMissing('tags');

        $tagIds = $lead->tags
            ->pluck('id')
            ->values()
            ->all();

        $rules = LeadRoutingRule::query()
            ->where('status', true)
            ->where(function (Builder $query) use ($lead, $tagIds) {
                $query
                    ->whereNull('service_id')
                    ->orWhere('service_id', $lead->service_id);

                if (!empty($tagIds)) {
                    $query->orWhereIn('lead_tag_id', $tagIds);
                }
            })
            ->orderByDesc('sort_order')
            ->get();

        foreach ($rules as $rule) {
            $serviceMatches =
                $rule->service_id === null ||
                (int) $rule->service_id === (int) $lead->service_id;

            $tagMatches =
                $rule->lead_tag_id === null ||
                in_array(
                    (int) $rule->lead_tag_id,
                    $tagIds,
                    true
                );

            if (!$serviceMatches || !$tagMatches) {
                continue;
            }

            if ($rule->employee_team_id) {
                $user = $rule->employeeTeam
                    ->users()
                    ->where('users.status', 'active')
                    ->where('users.role', 'employee')
                    ->withCount([
                        'assignedLeads as active_leads_count' => function ($q) {
                            $q->whereNull('deleted_at')
                                ->where('ownership_status', 'active');
                        },
                    ])
                    ->orderBy('active_leads_count')
                    ->orderBy('users.id')
                    ->first();

                if ($user) {
                    return $user;
                }
            }
        }

        // Fallback: least-loaded active employee.
        return User::query()
            ->where('status', 'active')
            ->where('role', 'employee')
            ->withCount([
                'assignedLeads as active_leads_count' => function ($q) {
                    $q->whereNull('deleted_at')
                        ->where('ownership_status', 'active');
                },
            ])
            ->orderBy('active_leads_count')
            ->orderBy('id')
            ->first();
    }

    public function autoAssign(
        Lead $lead,
        ?int $changedBy = null
    ): ?Lead {
        return DB::transaction(function () use ($lead, $changedBy) {
            $lead->refresh();

            if ($lead->assigned_to !== null) {
                return $lead;
            }

            $assignee = $this->findAssignee($lead);

            if (!$assignee) {
                return null;
            }

            return app(LeadAssignmentService::class)->assign(
                $lead,
                $assignee->id,
                $changedBy,
                'auto',
                'Automatic routing rule match'
            );
        });
    }
}