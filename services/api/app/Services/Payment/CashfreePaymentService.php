<?php

namespace App\Services\Payment;

use App\Models\ItrPayment;
use App\Models\ItrReturn;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class CashfreePaymentService
{
    /**
     * Cashfree API base URL.
     */
    protected function baseUrl(): string
    {
        return rtrim(
            config(
                'services.cashfree.base_url',
                'https://sandbox.cashfree.com/pg'
            ),
            '/'
        );
    }

    /**
     * Cashfree API headers.
     */
    protected function headers(): array
    {
        return [
            'x-client-id' => config(
                'services.cashfree.app_id'
            ),

            'x-client-secret' => config(
                'services.cashfree.secret_key'
            ),

            'x-api-version' => config(
                'services.cashfree.api_version',
                '2025-01-01'
            ),

            'Accept' => 'application/json',

            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Return URL used after Cashfree checkout.
     *
     * IMPORTANT:
     * Local Laravel API is running on port 8001.
     *
     * Later, for production, set:
     *
     * CASHFREE_RETURN_URL=https://api.yourdomain.com/api/v1/payments/cashfree/return
     */
    protected function returnUrl(): string
    {
        return rtrim(
            config(
                'services.cashfree.return_url',
                'http://127.0.0.1:8001/api/v1/payments/cashfree/return'
            ),
            '/'
        ) . '?order_id={order_id}';
    }

    /**
     * Create a Cashfree PG order.
     */
    public function createOrder(
        ItrPayment $payment,
        ItrReturn $itrReturn
    ): array {
        $orderId =
            'finclears_' .
            $itrReturn->id .
            '_' .
            $payment->id .
            '_' .
            Str::lower(
                Str::random(8)
            );

        $user = $itrReturn->user;

        $phone =
            $user?->phone
            ?: $itrReturn->mobile
            ?: '9999999999';

        $customerId =
            'user_' .
            ($user?->id ?? $itrReturn->user_id);

        $payload = [
            'order_id' => $orderId,

            'order_amount' => round(
                (float) $payment->amount,
                2
            ),

            'order_currency' => 'INR',

            'customer_details' => [
                'customer_id' => $customerId,

                'customer_name' =>
                    $user?->name
                    ?: 'FinClears Customer',

                'customer_email' =>
                    $user?->email
                    ?: $itrReturn->email
                    ?: 'customer@finclears.com',

                'customer_phone' => $phone,
            ],

            'order_meta' => [
                'return_url' => $this->returnUrl(),
            ],
        ];

        $response = Http::timeout(30)
            ->withHeaders(
                $this->headers()
            )
            ->post(
                $this->baseUrl() . '/orders',
                $payload
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Cashfree order creation failed: ' .
                $response->body()
            );
        }

        $data = $response->json();

        if (
            empty(
                $data['payment_session_id']
            ) ||
            empty(
                $data['order_id']
            )
        ) {
            throw new RuntimeException(
                'Cashfree did not return a payment session ID.'
            );
        }

        $payment->update([
            'payment_gateway' => 'cashfree',

            'gateway_transaction_id' =>
                $data['order_id'] ?? null,

            'metadata' => array_merge(
                $payment->metadata ?? [],
                [
                    'cashfree_order_id' =>
                        $data['order_id'] ?? null,

                    'cashfree_payment_session_id' =>
                        $data['payment_session_id'] ?? null,
                ]
            ),

            'gateway_response' => $data,
        ]);

        return $data;
    }

    /**
     * Get all payments for a Cashfree order.
     */
    public function getOrderPayments(
        string $orderId
    ): array {
        $response = Http::timeout(30)
            ->withHeaders(
                $this->headers()
            )
            ->get(
                $this->baseUrl() .
                '/orders/' .
                urlencode($orderId) .
                '/payments'
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to fetch Cashfree payment status: ' .
                $response->body()
            );
        }

        return $response->json() ?? [];
    }

    /**
     * Determine whether a Cashfree order
     * is successfully paid.
     */
    public function verifyPayment(
        ItrPayment $payment,
        string $orderId
    ): array {
        $payments =
            $this->getOrderPayments(
                $orderId
            );

        $successfulPayment =
            collect($payments)
                ->first(
                    fn (array $transaction) =>
                        strtoupper(
                            (string) (
                                $transaction[
                                    'payment_status'
                                ] ?? ''
                            )
                        ) === 'SUCCESS'
                );

        if ($successfulPayment) {
            $payment->update([
                'payment_status' => 'success',

                'gateway_transaction_id' =>
                    $successfulPayment[
                        'cf_payment_id'
                    ]
                    ??
                    $successfulPayment[
                        'payment_id'
                    ]
                    ??
                    $payment->gateway_transaction_id,

                'gateway_response' => [
                    'order_id' => $orderId,

                    'payments' => $payments,

                    'successful_payment' =>
                        $successfulPayment,
                ],

                'paid_at' => now(),
            ]);

            return [
                'status' => 'success',

                'payment' =>
                    $successfulPayment,

                'payments' =>
                    $payments,
            ];
        }

        $pendingPayment =
            collect($payments)
                ->first(
                    fn (array $transaction) =>
                        strtoupper(
                            (string) (
                                $transaction[
                                    'payment_status'
                                ] ?? ''
                            )
                        ) === 'PENDING'
                );

        if ($pendingPayment) {
            return [
                'status' => 'pending',

                'payment' =>
                    $pendingPayment,

                'payments' =>
                    $payments,
            ];
        }

        $payment->update([
            'payment_status' => 'failed',

            'gateway_response' => [
                'order_id' => $orderId,

                'payments' =>
                    $payments,
            ],
        ]);

        return [
            'status' => 'failed',

            'payment' => null,

            'payments' =>
                $payments,
        ];
    }
}