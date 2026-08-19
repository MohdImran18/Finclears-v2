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
        $baseUrl = $this->getBaseUrl();

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
            ->post(
                $baseUrl . '/authenticate'
            );

        if ($response->failed()) {
            Log::error(
                'Sandbox authentication failed',
                [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox authentication failed.'
            );
        }

        $token = $response->json(
            'data.access_token'
        );

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
        $baseUrl = $this->getBaseUrl();

        $apiKey = config(
            'services.sandbox.api_key'
        );

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

        $dateOfBirth = $this->normalizeDateOfBirth(
            $dateOfBirth
        );

        $payload = [
            '@entity' =>
                'in.co.sandbox.kyc.pan_verification.request',

            'pan' =>
                strtoupper(trim($pan)),

            'name_as_per_pan' =>
                trim($name),

            'date_of_birth' =>
                $dateOfBirth,

            'consent' =>
                'Y',

            'reason' =>
                trim($reason),
        ];

        Log::info(
            'SANDBOX PAN VERIFICATION REQUEST',
            [
                'url' =>
                    $baseUrl . '/kyc/pan/verify',

                'method' =>
                    'POST',

                'api_version' =>
                    $apiVersion,

                'api_key_present' =>
                    !empty($apiKey),

                'payload' =>
                    $payload,
            ]
        );

        $token =
            $this->getAccessToken();

        $response =
            $this->sendPanVerificationRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );

        if (
            $response->status() === 401
        ) {
            $this->clearToken();

            $token =
                $this->getAccessToken();

            $response =
                $this->sendPanVerificationRequest(
                    $baseUrl,
                    $apiKey,
                    $apiVersion,
                    $token,
                    $payload
                );
        }

        if ($response->failed()) {
            $body =
                $response->body();

            Log::error(
                'Sandbox PAN verification failed',
                [
                    'status' =>
                        $response->status(),

                    'body' =>
                        $body,

                    'pan' =>
                        $payload['pan'],
                ]
            );

            throw new RuntimeException(
                'Sandbox PAN verification failed: ' .
                $body
            );
        }

        return $this->decodeResponse(
            $response
        );
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

        $parsed =
            \DateTime::createFromFormat(
                'Y-m-d',
                $date
            );

        if ($parsed !== false) {
            return $parsed->format(
                'd/m/Y'
            );
        }

        try {
            return (
                new \DateTime($date)
            )->format(
                'd/m/Y'
            );
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
                'Authorization' =>
                    $token,

                'Content-Type' =>
                    'application/json',

                'x-api-key' =>
                    $apiKey,

                'x-api-version' =>
                    $apiVersion,

                'x-accept-cache' =>
                    'true',
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
        $baseUrl =
            $this->getBaseUrl();

        $apiKey =
            config(
                'services.sandbox.api_key'
            );

        $configuredVersion =
            config(
                'services.sandbox.api_version',
                '1.0'
            );

        $apiVersion =
            str_starts_with(
                (string) $configuredVersion,
                '1.0'
            )
                ? '1.0'
                : (string) $configuredVersion;

        $token =
            $this->getAccessToken();

        $payload = [
            '@entity' =>
                'in.co.sandbox.kyc.aadhaar.okyc.otp.request',

            'aadhaar_number' =>
                preg_replace(
                    '/\D/',
                    '',
                    $aadhaar
                ),

            'consent' =>
                'y',

            'reason' =>
                trim($reason),
        ];

        $response =
            $this->sendAadhaarOtpRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );

        if (
            $response->status() === 401
        ) {
            $this->clearToken();

            $token =
                $this->getAccessToken();

            $response =
                $this->sendAadhaarOtpRequest(
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
                    'status' =>
                        $response->status(),

                    'body' =>
                        $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox Aadhaar OTP generation failed: ' .
                $response->body()
            );
        }

        return $this->decodeResponse(
            $response
        );
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
                'Authorization' =>
                    $token,

                'Content-Type' =>
                    'application/json',

                'x-api-key' =>
                    $apiKey,

                'x-api-version' =>
                    $apiVersion,

                'x-accept-cache' =>
                    'true',
            ])
            ->post(
                $baseUrl .
                '/kyc/aadhaar/okyc/otp',
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
        $baseUrl =
            $this->getBaseUrl();

        $apiKey =
            config(
                'services.sandbox.api_key'
            );

        $configuredVersion =
            config(
                'services.sandbox.api_version',
                '1.0'
            );

        $apiVersion =
            str_starts_with(
                (string) $configuredVersion,
                '1.0'
            )
                ? '1.0'
                : (string) $configuredVersion;

        $token =
            $this->getAccessToken();

        $payload = [
            '@entity' =>
                'in.co.sandbox.kyc.aadhaar.okyc.request',

            'reference_id' =>
                $referenceId,

            'otp' =>
                $otp,
        ];

        $response =
            $this->sendAadhaarOtpVerifyRequest(
                $baseUrl,
                $apiKey,
                $apiVersion,
                $token,
                $payload
            );

        if (
            $response->status() === 401
        ) {
            $this->clearToken();

            $token =
                $this->getAccessToken();

            $response =
                $this->sendAadhaarOtpVerifyRequest(
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
                    'status' =>
                        $response->status(),

                    'body' =>
                        $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox Aadhaar OTP verification failed: ' .
                $response->body()
            );
        }

        return $this->decodeResponse(
            $response
        );
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
                'Authorization' =>
                    $token,

                'Content-Type' =>
                    'application/json',

                'x-api-key' =>
                    $apiKey,

                'x-api-version' =>
                    $apiVersion,

                'x-accept-cache' =>
                    'true',
            ])
            ->post(
                $baseUrl .
                '/kyc/aadhaar/okyc/otp/verify',
                $payload
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Generic Sandbox Income Tax API
    |--------------------------------------------------------------------------
    */

    /**
     * Send authenticated POST request to Sandbox.
     *
     * The endpoint is supplied by the caller/configuration.
     */
    public function post(
        string $endpoint,
        array $payload = [],
        int $timeout = 60
    ): array {
        return $this->request(
            'POST',
            $endpoint,
            $payload,
            $timeout
        );
    }

    /**
     * Send authenticated GET request to Sandbox.
     */
    public function get(
        string $endpoint,
        array $query = [],
        int $timeout = 60
    ): array {
        return $this->request(
            'GET',
            $endpoint,
            $query,
            $timeout
        );
    }

    /**
     * Generic authenticated Sandbox request.
     */
    protected function request(
        string $method,
        string $endpoint,
        array $data = [],
        int $timeout = 60
    ): array {
        $url =
            $this->getBaseUrl() .
            '/' .
            ltrim(
                $endpoint,
                '/'
            );

        $apiKey =
            config(
                'services.sandbox.api_key'
            );

        $apiVersion =
            (string) config(
                'services.sandbox.api_version',
                '1.0'
            );

        $method =
            strtoupper($method);

        $token =
            $this->getAccessToken();

        Log::info(
            'Sandbox API request',
            [
                'method' =>
                    $method,

                'endpoint' =>
                    $endpoint,

                'api_version' =>
                    $apiVersion,

                'api_key_present' =>
                    !empty($apiKey),
            ]
        );

        $response =
            $this->executeRequest(
                $method,
                $url,
                $apiKey,
                $apiVersion,
                $token,
                $data,
                $timeout
            );

        /*
         * Refresh token once if expired.
         */
        if (
            $response->status() === 401
        ) {
            Log::warning(
                'Sandbox access token rejected. Refreshing token.'
            );

            $this->clearToken();

            $token =
                $this->getAccessToken();

            $response =
                $this->executeRequest(
                    $method,
                    $url,
                    $apiKey,
                    $apiVersion,
                    $token,
                    $data,
                    $timeout
                );
        }

        if ($response->failed()) {
            Log::error(
                'Sandbox API request failed',
                [
                    'method' =>
                        $method,

                    'endpoint' =>
                        $endpoint,

                    'status' =>
                        $response->status(),

                    'body' =>
                        $response->body(),
                ]
            );

            throw new RuntimeException(
                'Sandbox API request failed: ' .
                $response->body()
            );
        }

        return $this->decodeResponse(
            $response
        );
    }


    /**
 * Send authenticated POST request and return raw response data.
 *
 * Unlike post(), this method does not throw automatically on
 * 4xx/5xx responses. This is required for validation APIs because
 * validation errors are useful application data.
 */
public function postRaw(
    string $endpoint,
    array $payload = [],
    int $timeout = 60
): array {
    $url =
        $this->getBaseUrl() .
        '/' .
        ltrim($endpoint, '/');

    $apiKey = config(
        'services.sandbox.api_key'
    );

    $apiVersion = (string) config(
        'services.sandbox.api_version',
        '1.0'
    );

    $token = $this->getAccessToken();

    $response = \Illuminate\Support\Facades\Http::timeout($timeout)
        ->acceptJson()
        ->withHeaders([
            'Authorization' => $token,
            'Content-Type' => 'application/json',
            'x-api-key' => $apiKey,
            'x-api-version' => $apiVersion,
            'x-accept-cache' => 'true',
        ])
        ->post(
            $url,
            $payload
        );

    /*
     * Refresh token once if Sandbox rejects the token.
     */
    if ($response->status() === 401) {

        \Illuminate\Support\Facades\Log::warning(
            'Sandbox raw POST token rejected. Refreshing token.'
        );

        $this->clearToken();

        $token = $this->getAccessToken();

        $response = \Illuminate\Support\Facades\Http::timeout($timeout)
            ->acceptJson()
            ->withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
                'x-api-key' => $apiKey,
                'x-api-version' => $apiVersion,
                'x-accept-cache' => 'true',
            ])
            ->post(
                $url,
                $payload
            );
    }

    return [
        'status' => $response->status(),

        'successful' => $response->successful(),

        'body' => $response->json(),

        'raw_body' => $response->body(),

        'headers' => $response->headers(),
    ];
}

    /**
     * Execute HTTP request.
     */
    protected function executeRequest(
        string $method,
        string $url,
        ?string $apiKey,
        string $apiVersion,
        string $token,
        array $data,
        int $timeout
    ) {
        $http =
            Http::timeout($timeout)
                ->acceptJson()
                ->withHeaders([
                    'Authorization' =>
                        $token,

                    'Content-Type' =>
                        'application/json',

                    'x-api-key' =>
                        $apiKey,

                    'x-api-version' =>
                        $apiVersion,

                    'x-accept-cache' =>
                        'true',
                ]);

        if ($method === 'GET') {
            return $http->get(
                $url,
                $data
            );
        }

        if ($method === 'POST') {
            return $http->post(
                $url,
                $data
            );
        }

        if ($method === 'PUT') {
            return $http->put(
                $url,
                $data
            );
        }

        if ($method === 'PATCH') {
            return $http->patch(
                $url,
                $data
            );
        }

        throw new RuntimeException(
            'Unsupported Sandbox HTTP method: ' .
            $method
        );
    }

    /**
     * Decode Sandbox response safely.
     */
    protected function decodeResponse(
        $response
    ): array {
        $json =
            $response->json();

        if (
            is_array($json)
        ) {
            return $json;
        }

        return [
            'success' =>
                false,

            'code' =>
                $response->status(),

            'message' =>
                'Sandbox returned an invalid JSON response.',

            'raw_response' =>
                $response->body(),
        ];
    }

    /**
     * File ITR through Sandbox.
     *
     * IMPORTANT:
     * SANDBOX_ITR_FILING_ENDPOINT must contain
     * the exact Income Tax filing endpoint provided
     * for the connected Sandbox account.
     */
    public function fileItr(
        array $payload
    ): array {
        $endpoint =
            config(
                'services.sandbox.itr_filing_endpoint'
            );

        if (
            !$endpoint
        ) {
            throw new RuntimeException(
                'Sandbox ITR filing endpoint is not configured.'
            );
        }

        return $this->post(
            $endpoint,
            $payload,
            120
        );
    }

    /**
     * Clear cached Sandbox access token.
     */
    public function clearToken(): void
    {
        Cache::forget(
            'sandbox.access_token'
        );
    }

    /**
     * Get Sandbox base URL.
     */
    protected function getBaseUrl(): string
    {
        return rtrim(
            config(
                'services.sandbox.base_url',
                'https://test-api.sandbox.co.in'
            ),
            '/'
        );
    }
}