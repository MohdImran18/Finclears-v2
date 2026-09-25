<?php

namespace App\Services\Notifications;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class WhatsAppService
{
    protected function request(): PendingRequest
    {
        $url = config('services.whatsapp.url');

        if (!$url) {
            throw new RuntimeException(
                'WhatsApp API URL is not configured.'
            );
        }

        $request = Http::timeout(
            config('services.whatsapp.timeout', 30)
        )->acceptJson();

        $token = config('services.whatsapp.token');

        if ($token) {
            $request = $request->withToken($token);
        }

        return $request;
    }

    protected function baseUrl(): string
    {
        return rtrim(
            (string) config('services.whatsapp.url'),
            '/'
        );
    }

    public function health(): array
    {
        return $this->request()
            ->get($this->baseUrl() . '/api/health')
            ->throw()
            ->json();
    }

    public function status(): array
    {
        return $this->request()
            ->get($this->baseUrl() . '/api/whatsapp/status')
            ->throw()
            ->json();
    }

    public function sendText(
        string $to,
        string $text
    ): array {
        return $this->request()
            ->post(
                $this->baseUrl() . '/api/send/text',
                [
                    'to' => $to,
                    'text' => $text,
                ]
            )
            ->throw()
            ->json();
    }
}