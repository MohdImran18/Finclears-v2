<?php

namespace App\Services\CRM;

use App\Models\ActivityLog;
use App\Models\Lead;
use App\Models\LeadAssignmentHistory;
use Illuminate\Support\Facades\DB;
use App\Services\Notifications\NotificationService;

class LeadAssignmentService
{
    public function __construct(
        protected NotificationService $notifications
    ) {
    }
    /**
     * Assign/reassign a lead and create ownership/history records.
     */
    public function assign(
        Lead $lead,
        ?int $toUserId,
        ?int $changedBy = null,
        string $assignmentType = 'manual',
        ?string $reason = null
    ): Lead {
        return DB::transaction(function () use (
            $lead,
            $toUserId,
            $changedBy,
            $assignmentType,
            $reason
        ) {
            $fromUserId = $lead->assigned_to;

            // Nothing changed.
            if ((int) $fromUserId === (int) $toUserId) {
                return $lead->fresh();
            }

            $now = now();

            /*
             * Assignment history
             */
            LeadAssignmentHistory::create([
                'lead_id' => $lead->id,
                'from_user_id' => $fromUserId,
                'to_user_id' => $toUserId,
                'changed_by' => $changedBy,
                'assignment_type' => $assignmentType,
                'reason' => $reason,
            ]);

            /*
             * Update current ownership.
             */
            $lead->assigned_to = $toUserId;

            if ($toUserId !== null) {
                $lead->ownership_started_at = $now;
                $lead->ownership_expires_at = $now->copy()->addDays(30);
                $lead->ownership_status = 'active';
            } else {
                $lead->ownership_started_at = null;
                $lead->ownership_expires_at = null;
                $lead->ownership_status = 'unassigned';
            }

            $lead->save();

            /*
             * Human-readable activity.
             */
            $fromName = $fromUserId
                ? optional(\App\Models\User::find($fromUserId))->name
                : 'Unassigned';

            $toName = $toUserId
                ? optional(\App\Models\User::find($toUserId))->name
                : 'Unassigned';

            ActivityLog::create([
                'lead_id' => $lead->id,
                'user_id' => $changedBy,
                'type' => 'assigned',
                'subject' => 'Lead Assignment Changed',
                'description' => sprintf(
                    '%s → %s. Type: %s%s',
                    $fromName ?: 'Unassigned',
                    $toName ?: 'Unassigned',
                    $assignmentType,
                    $reason
                        ? '. Reason: ' . $reason
                        : ''
                ),
                'activity_at' => $now,
            ]);

            $updatedLead = $lead->fresh();

            if ($toUserId !== null) {
                $this->notifications->leadAssigned($updatedLead, $fromUserId !== null ? 'reassigned' : 'assigned');
            }

            return $updatedLead;
        });
    }

    /**
     * Release an owned lead back to the pool.
     */
    public function release(
        Lead $lead,
        ?int $changedBy = null,
        string $reason = 'Ownership expired'
    ): Lead {
        return $this->assign(
            $lead,
            null,
            $changedBy,
            'ownership_expired',
            $reason
        );
    }

    /**
     * Check whether the current ownership has expired.
     */
    public function hasExpired(Lead $lead): bool
    {
        return $lead->assigned_to !== null
            && $lead->ownership_status === 'active'
            && $lead->ownership_expires_at !== null
            && $lead->ownership_expires_at->isPast();
    }
}