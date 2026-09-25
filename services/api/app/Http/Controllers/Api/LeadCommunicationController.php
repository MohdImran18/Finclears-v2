<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lead\StoreLeadCallRequest;
use App\Http\Requests\Lead\StoreLeadCommentRequest;
use App\Http\Requests\Lead\StoreLeadFollowupRequest;
use App\Http\Requests\Lead\UpdateLeadFollowupRequest;
use App\Models\ActivityLog;
use App\Models\Lead;
use App\Models\LeadAssignmentHistory;
use App\Models\LeadCall;
use App\Models\LeadComment;
use App\Models\LeadFollowup;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LeadCommunicationController extends Controller
{
    /**
     * Combined timeline for a lead.
     */
    public function timeline(Lead $lead): JsonResponse
    {
        $activities = $lead->activities()
            ->with('user:id,name,email')
            ->get()
            ->map(function (ActivityLog $activity) {
                return [
                    'id' => $activity->id,
                    'category' => 'activity',
                    'type' => $activity->type,
                    'subject' => $activity->subject,
                    'description' => $activity->description,
                    'user' => $activity->user
                        ? [
                            'id' => $activity->user->id,
                            'name' => $activity->user->name,
                            'email' => $activity->user->email,
                        ]
                        : null,
                    'occurred_at' => $activity->activity_at,
                ];
            });

        $comments = $lead->comments()
            ->with('user:id,name,email')
            ->get()
            ->map(function (LeadComment $comment) {
                return [
                    'id' => $comment->id,
                    'category' => 'comment',
                    'type' => 'comment',
                    'subject' => 'Comment',
                    'description' => $comment->comment,
                    'user' => $comment->user
                        ? [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'email' => $comment->user->email,
                        ]
                        : null,
                    'occurred_at' => $comment->created_at,
                ];
            });

        $calls = $lead->calls()
            ->with('user:id,name,email')
            ->get()
            ->map(function (LeadCall $call) {
                return [
                    'id' => $call->id,
                    'category' => 'call',
                    'type' => $call->call_type,
                    'subject' => 'Call',
                    'description' => $call->discussion,
                    'outcome' => $call->outcome,
                    'next_action' => $call->next_action,
                    'duration_seconds' => $call->duration_seconds,
                    'started_at' => $call->started_at,
                    'ended_at' => $call->ended_at,
                    'follow_up_at' => $call->follow_up_at,
                    'user' => $call->user
                        ? [
                            'id' => $call->user->id,
                            'name' => $call->user->name,
                            'email' => $call->user->email,
                        ]
                        : null,
                    'occurred_at' => $call->started_at ?? $call->created_at,
                ];
            });

        $followups = $lead->followups()
            ->with('user:id,name,email')
            ->get()
            ->map(function (LeadFollowup $followup) {
                return [
                    'id' => $followup->id,
                    'category' => 'followup',
                    'type' => $followup->type,
                    'subject' => $followup->subject,
                    'description' => $followup->notes,
                    'status' => $followup->status,
                    'follow_up_at' => $followup->follow_up_at,
                    'completed_at' => $followup->completed_at,
                    'user' => $followup->user
                        ? [
                            'id' => $followup->user->id,
                            'name' => $followup->user->name,
                            'email' => $followup->user->email,
                        ]
                        : null,
                    'occurred_at' => $followup->created_at,
                ];
            });

        $assignments = $lead->assignmentHistory()
            ->with([
                'fromUser:id,name,email',
                'toUser:id,name,email',
                'changedBy:id,name,email',
            ])
            ->get()
            ->map(function (LeadAssignmentHistory $assignment) {
                return [
                    'id' => $assignment->id,
                    'category' => 'assignment',
                    'type' => $assignment->assignment_type,
                    'subject' => 'Lead Assignment',
                    'description' => $this->assignmentDescription($assignment),
                    'from_user' => $assignment->fromUser
                        ? [
                            'id' => $assignment->fromUser->id,
                            'name' => $assignment->fromUser->name,
                            'email' => $assignment->fromUser->email,
                        ]
                        : null,
                    'to_user' => $assignment->toUser
                        ? [
                            'id' => $assignment->toUser->id,
                            'name' => $assignment->toUser->name,
                            'email' => $assignment->toUser->email,
                        ]
                        : null,
                    'changed_by' => $assignment->changedBy
                        ? [
                            'id' => $assignment->changedBy->id,
                            'name' => $assignment->changedBy->name,
                            'email' => $assignment->changedBy->email,
                        ]
                        : null,
                    'reason' => $assignment->reason,
                    'occurred_at' => $assignment->created_at,
                ];
            });

        $timeline = collect()
            ->concat($activities)
            ->concat($comments)
            ->concat($calls)
            ->concat($followups)
            ->concat($assignments)
            ->sortByDesc(function ($item) {
                return $item['occurred_at']?->timestamp ?? 0;
            })
            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Lead timeline fetched successfully.',
            'data' => [
                'lead_id' => $lead->id,
                'timeline' => $timeline,
            ],
        ]);
    }

    /**
     * Assignment history.
     */
    public function assignmentHistory(Lead $lead): JsonResponse
    {
        $history = $lead->assignmentHistory()
            ->with([
                'fromUser:id,name,email',
                'toUser:id,name,email',
                'changedBy:id,name,email',
            ])
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lead assignment history fetched successfully.',
            'data' => [
                'history' => $history,
            ],
        ]);
    }

    /**
     * List comments.
     */
    public function comments(Lead $lead): JsonResponse
    {
        $comments = $lead->comments()
            ->with('user:id,name,email')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lead comments fetched successfully.',
            'data' => [
                'comments' => $comments,
            ],
        ]);
    }

    /**
     * Add comment.
     */
    public function storeComment(
        StoreLeadCommentRequest $request,
        Lead $lead
    ): JsonResponse {
        $comment = DB::transaction(function () use ($request, $lead) {
            $comment = LeadComment::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'comment' => $request->validated('comment'),
            ]);

            ActivityLog::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'type' => 'commented',
                'subject' => 'Lead Comment Added',
                'description' => $comment->comment,
                'activity_at' => now(),
            ]);

            return $comment;
        });

        return response()->json([
            'success' => true,
            'message' => 'Lead comment added successfully.',
            'data' => [
                'comment' => $comment->load('user:id,name,email'),
            ],
        ], 201);
    }

    /**
     * List calls.
     */
    public function calls(Lead $lead): JsonResponse
    {
        $calls = $lead->calls()
            ->with('user:id,name,email')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lead calls fetched successfully.',
            'data' => [
                'calls' => $calls,
            ],
        ]);
    }

    /**
     * Add call.
     */
    public function storeCall(
        StoreLeadCallRequest $request,
        Lead $lead
    ): JsonResponse {
        $validated = $request->validated();

        $call = DB::transaction(function () use (
            $request,
            $lead,
            $validated
        ) {
            $call = LeadCall::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'call_type' => $validated['call_type'],
                'started_at' => $validated['started_at'],
                'ended_at' => $validated['ended_at'] ?? null,
                'duration_seconds' => $validated['duration_seconds'] ?? 0,
                'outcome' => $validated['outcome'] ?? null,
                'discussion' => $validated['discussion'],
                'next_action' => $validated['next_action'] ?? null,
                'follow_up_at' => $validated['follow_up_at'] ?? null,
            ]);

            $description = sprintf(
                'Call logged. Type: %s. Outcome: %s. Discussion: %s',
                $call->call_type,
                $call->outcome ?: 'N/A',
                $call->discussion
            );

            ActivityLog::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'type' => 'called',
                'subject' => 'Lead Call Logged',
                'description' => $description,
                'activity_at' => $call->started_at ?? now(),
            ]);

            return $call;
        });

        return response()->json([
            'success' => true,
            'message' => 'Lead call logged successfully.',
            'data' => [
                'call' => $call->load('user:id,name,email'),
            ],
        ], 201);
    }

    /**
     * List follow-ups.
     */
    public function followups(Lead $lead): JsonResponse
    {
        $followups = $lead->followups()
            ->with('user:id,name,email')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lead follow-ups fetched successfully.',
            'data' => [
                'followups' => $followups,
            ],
        ]);
    }

    /**
     * Create follow-up.
     */
    public function storeFollowup(
        StoreLeadFollowupRequest $request,
        Lead $lead
    ): JsonResponse {
        $validated = $request->validated();

        $followup = DB::transaction(function () use (
            $request,
            $lead,
            $validated
        ) {
            $followup = LeadFollowup::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'follow_up_at' => $validated['follow_up_at'],
                'type' => $validated['type'],
                'subject' => $validated['subject'],
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'] ?? 'pending',
            ]);

            ActivityLog::create([
                'lead_id' => $lead->id,
                'user_id' => $request->user()->id,
                'type' => 'follow_up_created',
                'subject' => 'Lead Follow-up Created',
                'description' => sprintf(
                    '%s - %s',
                    $followup->subject,
                    $followup->follow_up_at
                ),
                'activity_at' => now(),
            ]);

            return $followup;
        });

        return response()->json([
            'success' => true,
            'message' => 'Lead follow-up created successfully.',
            'data' => [
                'followup' => $followup->load('user:id,name,email'),
            ],
        ], 201);
    }

    /**
     * Update follow-up.
     */
    public function updateFollowup(
        UpdateLeadFollowupRequest $request,
        Lead $lead,
        LeadFollowup $followup
    ): JsonResponse {
        abort_if(
            $followup->lead_id !== $lead->id,
            404
        );

        $validated = $request->validated();
        $original = $followup->getOriginal();

        DB::transaction(function () use (
            $request,
            $followup,
            $validated,
            $original,
            $lead
        ) {
            $followup->update($validated);

            $changes = [];

            foreach (array_keys($validated) as $field) {
                $oldValue = $original[$field] ?? null;
                $newValue = $followup->getAttribute($field);

                if ((string) $oldValue !== (string) $newValue) {
                    $changes[$field] = [
                        'old' => $oldValue,
                        'new' => $newValue,
                    ];
                }
            }

            if (!empty($changes)) {
                ActivityLog::create([
                    'lead_id' => $lead->id,
                    'user_id' => $request->user()->id,
                    'type' => 'follow_up_updated',
                    'subject' => 'Lead Follow-up Updated',
                    'description' => json_encode(
                        $changes,
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    ),
                    'activity_at' => now(),
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Lead follow-up updated successfully.',
            'data' => [
                'followup' => $followup->fresh()->load(
                    'user:id,name,email'
                ),
            ],
        ]);
    }

    /**
     * Create assignment history entry.
     *
     * This method can be called by LeadController whenever
     * assigned_to changes.
     */
    public function storeAssignmentHistory(
        Lead $lead,
        ?int $fromUserId,
        ?int $toUserId,
        ?int $changedBy,
        string $assignmentType = 'manual',
        ?string $reason = null
    ): LeadAssignmentHistory {
        return LeadAssignmentHistory::create([
            'lead_id' => $lead->id,
            'from_user_id' => $fromUserId,
            'to_user_id' => $toUserId,
            'changed_by' => $changedBy,
            'assignment_type' => $assignmentType,
            'reason' => $reason,
        ]);
    }

    /**
     * Build human-readable assignment description.
     */
    private function assignmentDescription(
        LeadAssignmentHistory $assignment
    ): string {
        $from = $assignment->fromUser?->name ?? 'Unassigned';
        $to = $assignment->toUser?->name ?? 'Unassigned';

        return sprintf(
            '%s → %s',
            $from,
            $to
        );
    }
}