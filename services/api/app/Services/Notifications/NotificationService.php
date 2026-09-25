<?php

namespace App\Services\Notifications;

use App\Models\Lead;

class NotificationService
{
    public function __construct(
        protected EmailService $email,
        protected WhatsAppService $whatsapp
    ) {
    }

    public function whatsapp(
        string $to,
        string $message
    ): array {
        $to = $this->normalizePhone($to);

        return $this->whatsapp->sendText(
            $to,
            $message
        );
    }

    public function email(
        string $to,
        string $subject,
        string $body,
        ?string $name = null
    ): void {
        $this->email->send(
            $to,
            $subject,
            $body,
            $name
        );
    }

    protected function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\D+/', '', $phone) ?? '';

        if (strlen($phone) === 10) {
            return '91' . $phone;
        }

        if (str_starts_with($phone, '0')) {
            return '91' . ltrim($phone, '0');
        }

        return $phone;
    }

    public function leadAssigned(
        Lead $lead,
        string $event = 'assigned'
    ): bool {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user) {
            return false;
        }

        $sent = false;

        $action = $event === 'reassigned'
            ? 'reassigned to you'
            : 'assigned to you';

        $message =
            "FinClears CRM: Lead #{$lead->id} {$action}.\n" .
            "Lead: {$lead->name}\n" .
            "Phone: {$lead->phone}";

        if ($user->phone) {
            try {
                $this->whatsapp(
                    $user->phone,
                    $message
                );

                $sent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - Lead Assigned',
                    $message,
                    $user->name
                );

                $sent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $sent;
    }

    public function ownershipExpired(
        Lead $lead
    ): bool {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user) {
            return false;
        }

        $sent = false;

        $message =
            "FinClears CRM: Ownership expired for Lead #{$lead->id}.\n" .
            "Lead: {$lead->name}\n" .
            "The lead has been released for routing.";

        if ($user->phone) {
            try {
                $this->whatsapp(
                    $user->phone,
                    $message
                );

                $sent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - Lead Ownership Expired',
                    $message,
                    $user->name
                );

                $sent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $sent;
    }

    public function leadCreated(
        Lead $lead,
        ?int $recipientUserId = null
    ): bool {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user && $recipientUserId) {
            $user = \App\Models\User::find($recipientUserId);
        }

        if (!$user) {
            return false;
        }

        $details = [
            'Lead ID' => '#' . $lead->id,
            'Lead Name' => $lead->name,
            'Phone' => $lead->phone,
            'Priority' => ucfirst($lead->priority ?? 'normal'),
            'Status' => ucfirst($lead->status ?? 'new'),
        ];

        $crmUrl = $this->crmUrl($lead->id);

        $emailBody = $this->emailTemplate(
            'New Lead Created',
            'A new lead has been created in FinClears CRM and requires your attention.',
            $details,
            'Open Lead in CRM',
            $crmUrl
        );

        $whatsapp =
            "🆕 *FinClears CRM*\n\n" .
            "*New Lead Created*\n\n" .
            "Lead: *{$lead->name}*\n" .
            "Lead ID: *#{$lead->id}*\n" .
            "Phone: {$lead->phone}\n" .
            "Priority: " . ucfirst($lead->priority ?? 'normal') . "\n\n" .
            "Please review this lead.\n\n" .
            "Open CRM:\n{$crmUrl}";

        $whatsappSent = false;
        $emailSent = false;

        if ($user->phone) {
            try {
                $this->whatsapp($user->phone, $whatsapp);
                $whatsappSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - New Lead Created',
                    $emailBody,
                    $user->name
                );

                $emailSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $whatsappSent || $emailSent;
    }

    public function leadConverted(
        Lead $lead
    ): bool {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user) {
            return false;
        }

        $details = [
            'Lead ID' => '#' . $lead->id,
            'Lead Name' => $lead->name,
            'Phone' => $lead->phone,
            'Value' => $lead->estimated_value,
            'Status' => 'Converted',
        ];

        $crmUrl = $this->crmUrl($lead->id);

        $emailBody = $this->emailTemplate(
            'Lead Converted',
            'Great news! This lead has been successfully converted.',
            $details,
            'Open Lead in CRM',
            $crmUrl
        );

        $whatsapp =
            "🎉 *FinClears CRM*\n\n" .
            "*Lead Converted*\n\n" .
            "Lead: *{$lead->name}*\n" .
            "Lead ID: *#{$lead->id}*\n" .
            "Value: *₹{$lead->estimated_value}*\n\n" .
            "Congratulations! The lead has been converted successfully.\n\n" .
            "Open CRM:\n{$crmUrl}";

        $whatsappSent = false;
        $emailSent = false;

        if ($user->phone) {
            try {
                $this->whatsapp($user->phone, $whatsapp);
                $whatsappSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - Lead Converted',
                    $emailBody,
                    $user->name
                );

                $emailSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $whatsappSent || $emailSent;
    }

    public function leadLost(
        Lead $lead
    ): bool {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user) {
            return false;
        }

        $details = [
            'Lead ID' => '#' . $lead->id,
            'Lead Name' => $lead->name,
            'Phone' => $lead->phone,
            'Lost Reason' => $lead->lost_reason ?: 'Not specified',
            'Status' => 'Lost',
        ];

        $crmUrl = $this->crmUrl($lead->id);

        $emailBody = $this->emailTemplate(
            'Lead Marked Lost',
            'This lead has been marked as lost in FinClears CRM.',
            $details,
            'Open Lead in CRM',
            $crmUrl
        );

        $whatsapp =
            "⚠️ *FinClears CRM*\n\n" .
            "*Lead Marked Lost*\n\n" .
            "Lead: *{$lead->name}*\n" .
            "Lead ID: *#{$lead->id}*\n" .
            "Reason: " . ($lead->lost_reason ?: 'Not specified') . "\n\n" .
            "Please review the lead and update your records if required.\n\n" .
            "Open CRM:\n{$crmUrl}";

        $whatsappSent = false;
        $emailSent = false;

        if ($user->phone) {
            try {
                $this->whatsapp($user->phone, $whatsapp);
                $whatsappSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - Lead Marked Lost',
                    $emailBody,
                    $user->name
                );

                $emailSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $whatsappSent || $emailSent;
    }
    public function followupReminder(
        Lead $lead,
        string $followupDate
    ): array {
        $lead->loadMissing('assignedUser');

        $user = $lead->assignedUser;

        if (!$user) {
            return [
                'whatsapp' => false,
                'email' => false,
                'success' => false,
            ];
        }

        $whatsappSent = false;
        $emailSent = false;

        $message =
            "FinClears CRM: Follow-up reminder.\n" .
            "Lead: {$lead->name}\n" .
            "Follow-up: {$followupDate}";

        if ($user->phone) {
            try {
                $this->whatsapp(
                    $user->phone,
                    $message
                );

                $whatsappSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        if ($user->email) {
            try {
                $this->email(
                    $user->email,
                    'FinClears CRM - Follow-up Reminder',
                    $message,
                    $user->name
                );

                $emailSent = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return [
            'whatsapp' => $whatsappSent,
            'email' => $emailSent,
            'success' => $whatsappSent || $emailSent,
        ];
    }
}