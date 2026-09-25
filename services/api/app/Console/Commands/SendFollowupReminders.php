<?php

namespace App\Console\Commands;

use App\Models\Lead;
use App\Services\Notifications\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SendFollowupReminders extends Command
{
    protected $signature = 'leads:send-followup-reminders
                            {--dry-run : Show reminders without sending them}';

    protected $description = 'Send WhatsApp and email reminders for due lead follow-ups';

    public function handle(
        NotificationService $notifications
    ): int {
        $now = now();

        $leads = Lead::query()
            ->with('assignedUser')
            ->whereNull('deleted_at')
            ->whereNotNull('assigned_to')
            ->whereNotNull('next_follow_up_at')
            ->where('next_follow_up_at', '<=', $now)
            ->whereIn('status', [
                'new',
                'contacted',
                'qualified',
            ])
            ->orderBy('next_follow_up_at')
            ->get();

        if ($leads->isEmpty()) {
            $this->info('No due follow-ups found.');

            return self::SUCCESS;
        }

        $this->info(
            "Found {$leads->count()} due follow-up(s)."
        );

        foreach ($leads as $lead) {
            $cacheKey = 'followup-reminder-sent:' .
                $lead->id . ':' .
                optional($lead->next_follow_up_at)
                    ->format('Y-m-d-H');

            if (Cache::has($cacheKey)) {
                $this->line(
                    "Lead #{$lead->id} reminder already processed for this hour."
                );

                continue;
            }

            if ($this->option('dry-run')) {
                $this->line(
                    "Lead #{$lead->id} | Owner {$lead->assigned_to} | " .
                    "Follow-up {$lead->next_follow_up_at}"
                );

                continue;
            }

            if (!$lead->assignedUser) {
                $this->warn(
                    "Lead #{$lead->id} has no assigned user."
                );

                continue;
            }

            $result = $notifications->followupReminder(
                $lead,
                $lead->next_follow_up_at->format('d M Y, h:i A')
            );

            if (
                $result['whatsapp'] === true &&
                $result['email'] === true
            ) {
                Cache::put(
                    $cacheKey,
                    true,
                    now()->addHour()
                );

                $this->line(
                    "Lead #{$lead->id} reminder delivered. " .
                    "WhatsApp: sent | Email: sent"
                );

                continue;
            }

            $this->error(
                "Lead #{$lead->id} reminder incomplete. " .
                "WhatsApp: " .
                ($result['whatsapp'] ? 'sent' : 'failed') .
                " | Email: " .
                ($result['email'] ? 'sent' : 'failed')
            );
        }

        $this->info(
            'Follow-up reminder processing completed.'
        );

        return self::SUCCESS;
    }
}