<?php

namespace App\Services\Notifications;

use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function send(
        string $to,
        string $subject,
        string $html,
        ?string $name = null,
        ?string $attachmentPath = null
    ): void {
        $logoPath = public_path(
            'images/finclears-logo.jpeg'
        );

        Mail::send([], [], function ($message) use (
            $to,
            $subject,
            $html,
            $name,
            $logoPath,
            $attachmentPath
        ) {
            $message
                ->to($to, $name ?: null)
                ->subject($subject)
                ->html($html);

            if ($attachmentPath && is_file($attachmentPath)) {
                $message->attach($attachmentPath, [
                    'as' => basename($attachmentPath),
                    'mime' => 'application/pdf',
                ]);
            }

            if (is_file($logoPath)) {
                $cid = $message->embed($logoPath);

                $htmlWithLogo = str_replace(
                    'cid:FINCLEARS_LOGO',
                    $cid,
                    $html
                );

                $message->html($htmlWithLogo);
            }
        });
    }
}