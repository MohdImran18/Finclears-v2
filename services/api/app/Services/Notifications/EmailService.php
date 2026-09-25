<?php

namespace App\Services\Notifications;

use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function send(
        string $to,
        string $subject,
        string $html,
        ?string $name = null
    ): void {
        $logoPath = public_path(
            'images/finclears-logo.jpeg'
        );

        Mail::send([], [], function ($message) use (
            $to,
            $subject,
            $html,
            $name,
            $logoPath
        ) {
            $message
                ->to($to, $name ?: null)
                ->subject($subject)
                ->html($html);

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