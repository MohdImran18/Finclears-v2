<?php

namespace App\Services\Sandbox;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SandboxService
{
    /**
     * Get Sandbox API access token.
     */
    public function getAccessToken(): string
    {
        return Cache::remember(
            'sandbox.access_token',
            now()->addHours(23),
            fn () => $this->authenticate()
        );
    }

    /**
     * Authenticate with Sandbox.
     */
    protected function authenticate(): string
    {
        $baseUrl = rtrim(
            config(
                'services.sandbox.base_url',
                'https://test-api.sandbox.co.in'
            ),
            '/'
        );

        $apiKey = config('services.sandbox.api_key');
        $apiSecret = config('services.sandbox.api_secret');

        $apiVersion = config(
            'services.sandbox.auth_api_version',
            '1.0.0'
        );

        if (!$apiKey || !$apiSecret) {
            throw new RuntimeException(
                'Sandbox API credentials are not configured.'
            );
        }

        $response = Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'x-api-key' => $apiKey,
                'x-api-secret' => $apiSecret,
                'x-api-version' => $apiVersion,
            ])
            ->post($baseUrl . '/authenticate');

        if ($response->failed()) {
            Log::error('Sandbox authentication failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException(
                'Sandbox authentication failed.'
            );
        }

        $token = $response->json('data.access_token');

        if (!$token) {
            throw new RuntimeException(
                'Sandbox authentication succeeded but no access token was returned.'
            );
        }

        return $token;
    }

    /**
     * Verify PAN details.
     */
    public function verifyPan(
        string $pan,
        string $name,
        string $dateOfBirth,
        string $reason = 'For onboarding customers'
    ): array {
        $baseUrl = rtrim(
            config(
                'services.sandbox.base_url',
                'https://test-api.sandbox.co.in'
            ),
            '/'
        );

        $apiKey = config('services.sandbox.api_key');

        /*
         * PAN verification uses API version 1.0.
         */
        $configuredVersion = config(
            'services.sandbox.api_version',
            '1.0'
        );

        $apiVersion = str_starts_with(
            (string) $configuredVersion,
            '1.0'
        )
            ? '1.0'
            : (string) $configuredVersion;

        /*
         * Normalize DOB to DD/MM/YYYY.
         */
        $dateOfBirth = $this->normalizeDateOfBirth(
            $dateOfBirth
        );

        /*
         * Build PAN verification payload.
         *
         * IMPORTANT:
         * Sandbox saved example uses uppercase Y.
         */
        $payload = [
            '@entity' => 'in.co.sandbox.kyc.pan_verification.request',
            'pan' => strtoupper(trim($pan)),
            'name_as_per_pan' => trim($name),
            'date_of_birth' => $dateOfBirth,
            'consent' => 'Y',
            'reason' => trim($reason),
        ];

        /*
         * Do not log API key or access token.
         */
        Log::info('SANDBOX PAN FULL REQUEST', [
            'url' => $baseUrl . '/kyc/pan/verify',
            'method' => 'POST',
            'headers' => [
                'x-api-version' => $apiVersion,
                'x-accept-cache' => 'true',
                'authorization_present' => true,
                'api_key_present' => !empty($apiKey),
            ],
            'payload' => $payload,
        ]);

        $token = $this->getAccessToken();

        $response = $this->sendPanVerificationRequest(
            $baseUrl,
            $apiKey,
            $apiVersion,
            $token,
            $payload
        );

        Log::info('Sandbox PAN verification response', [
            'status' => $response->status(),
            'url' => $baseUrl . '/kyc/pan/verify',
            'pan' => $payload['pan'],
            'body' => $response->body(),
        ]);

        /*
         * Token expired/rejected.
         * Clear cached token and retry once.
         */
        if ($response->status() === 401) {
            Log::warning(
                'Sandbox PAN token rejected. Refreshing token.'
            );

            $this->clearToken();

            $token = $this->getAccessToken();

            $response = $this->sendPanVerificationRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );

            Log::info('Sandbox PAN verification retry response', [
                'status' => $response->status(),
                'url' => $baseUrl . '/kyc/pan/verify',
                'pan' => $payload['pan'],
                'body' => $response->body(),
            ]);
        }

        if ($response->failed()) {
            $body = $response->body();

            Log::error('Sandbox PAN verification failed', [
                'status' => $response->status(),
                'body' => $body,
                'url' => $baseUrl . '/kyc/pan/verify',
                'api_version' => $apiVersion,
                'pan' => $payload['pan'],
                'name' => $payload['name_as_per_pan'],
                'date_of_birth' => $payload['date_of_birth'],
            ]);

            throw new RuntimeException(
                'Sandbox PAN verification failed: ' . $body
            );
        }

        $rawBody = $response->body();

        try {
            return json_decode(
                $rawBody,
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException) {
            return [
                'success' => false,
                'code' => null,
                'message' => 'Sandbox returned invalid JSON.',
                'raw_response' => $rawBody,
                'transaction_id' => null,
            ];
        }
    }

    /**
     * Normalize DOB to DD/MM/YYYY.
     */
    protected function normalizeDateOfBirth(
        string $date
    ): string {
        $date = trim($date);

        if (
            preg_match(
                '/^\d{2}\/\d{2}\/\d{4}$/',
                $date
            )
        ) {
            return $date;
        }

        $parsed = \DateTime::createFromFormat(
            'Y-m-d',
            $date
        );

        if ($parsed !== false) {
            return $parsed->format('d/m/Y');
        }

        try {
            return (new \DateTime($date))
                ->format('d/m/Y');
        } catch (\Exception) {
            throw new RuntimeException(
                'Invalid date of birth. Expected DD/MM/YYYY.'
            );
        }
    }

    /**
     * Send PAN verification request.
     */
    protected function sendPanVerificationRequest(
        string $baseUrl,
        ?string $apiKey,
        string $apiVersion,
        string $token,
        array $payload
    ) {
        return Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
                'x-api-key' => $apiKey,
                'x-api-version' => $apiVersion,
                'x-accept-cache' => 'true',
            ])
            ->post(
                $baseUrl . '/kyc/pan/verify',
                $payload
            );
    }

    /**
     * Generate Aadhaar OTP.
     */
    public function generateAadhaarOtp(
        string $aadhaar,
        string $reason = 'For ITR KYC verification'
    ): array {
        $baseUrl = rtrim(
            config(
                'services.sandbox.base_url',
                'https://test-api.sandbox.co.in'
            ),
            '/'
        );

        $apiKey = config('services.sandbox.api_key');

        $configuredVersion = config(
            'services.sandbox.api_version',
            '1.0'
        );

        $apiVersion = str_starts_with(
            (string) $configuredVersion,
            '1.0'
        )
            ? '1.0'
            : (string) $configuredVersion;

        $token = $this->getAccessToken();

        $payload = [
            '@entity' =>
                'in.co.sandbox.kyc.aadhaar.okyc.otp.request',

            'aadhaar_number' => preg_replace(
                '/\D/',
                '',
                $aadhaar
            ),

            'consent' => 'y',
            'reason' => trim($reason),
        ];

        $response = $this->sendAadhaarOtpRequest(
            $baseUrl,
            $apiKey,
            $apiVersion,
            $token,
            $payload
        );

        Log::info(
            'Sandbox Aadhaar OTP response',
            [
                'status' => $response->status(),
            ]
        );

        if ($response->status() === 401) {
            $this->clearToken();

            $token = $this->getAccessToken();

            $response = $this->sendAadhaarOtpRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );
        }

        if ($response->failed()) {
            Log::error(
                'Sandbox Aadhaar OTP generation failed',
                [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox Aadhaar OTP generation failed: '
                . $response->body()
            );
        }

        return $response->json();
    }

    /**
     * Send Aadhaar OTP request.
     */
    protected function sendAadhaarOtpRequest(
        string $baseUrl,
        ?string $apiKey,
        string $apiVersion,
        string $token,
        array $payload
    ) {
        return Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
                'x-api-key' => $apiKey,
                'x-api-version' => $apiVersion,
                'x-accept-cache' => 'true',
            ])
            ->post(
                $baseUrl . '/kyc/aadhaar/okyc/otp',
                $payload
            );
    }

    /**
     * Verify Aadhaar OTP.
     */
    public function verifyAadhaarOtp(
        string $referenceId,
        string $otp
    ): array {
        $baseUrl = rtrim(
            config(
                'services.sandbox.base_url',
                'https://test-api.sandbox.co.in'
            ),
            '/'
        );

        $apiKey = config('services.sandbox.api_key');

        $configuredVersion = config(
            'services.sandbox.api_version',
            '1.0'
        );

        $apiVersion = str_starts_with(
            (string) $configuredVersion,
            '1.0'
        )
            ? '1.0'
            : (string) $configuredVersion;

        $token = $this->getAccessToken();

        $payload = [
            '@entity' =>
                'in.co.sandbox.kyc.aadhaar.okyc.request',

            'reference_id' => $referenceId,
            'otp' => $otp,
        ];

        $response = $this->sendAadhaarOtpVerifyRequest(
            $baseUrl,
            $apiKey,
            $apiVersion,
            $token,
            $payload
        );

        Log::info(
            'Sandbox Aadhaar OTP verification response',
            [
                'status' => $response->status(),
            ]
        );

        if ($response->status() === 401) {
            $this->clearToken();

            $token = $this->getAccessToken();

            $response = $this->sendAadhaarOtpVerifyRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );
        }

        if ($response->failed()) {
            Log::error(
                'Sandbox Aadhaar OTP verification failed',
                [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox Aadhaar OTP verification failed: '
                . $response->body()
            );
        }

        return $response->json();
    }

    /**
     * Send Aadhaar OTP verification request.
     */
    protected function sendAadhaarOtpVerifyRequest(
        string $baseUrl,
        ?string $apiKey,
        string $apiVersion,
        string $token,
        array $payload
    ) {
        return Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
                'x-api-key' => $apiKey,
                'x-api-version' => $apiVersion,
                'x-accept-cache' => 'true',
            ])
            ->post(
                $baseUrl . '/kyc/aadhaar/okyc/otp/verify',
                $payload
            );
    }

    /**
     * Clear cached Sandbox access token.
     */
    public function clearToken(): void
    {
        Cache::forget('sandbox.access_token');
    }
}