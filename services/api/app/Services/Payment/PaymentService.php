<?php

namespace App\Services\Payment;

use App\Models\ItrPayment;
use App\Models\ItrReturn;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PaymentService
{
    public function __construct(
        protected CashfreePaymentService $cashfree
    ) {
    }

    /**
     * Create local payment + Cashfree order.
     */
    public function createPayment(
        ItrReturn $return,
        float $amount
    ): ItrPayment {
        return DB::transaction(
            function () use ($return, $amount) {

                $payment = ItrPayment::create([
                    'itr_return_id' => $return->id,
                    'amount' => $amount,
                    'payment_status' => 'pending',
                    'currency' => 'INR',
                    'payment_gateway' => 'cashfree',
                ]);

                try {
                    $this->cashfree->createOrder(
                        $payment,
                        $return
                    );

                    return $payment->fresh();
                } catch (\Throwable $e) {
                    throw new RuntimeException(
                        'Unable to create Cashfree payment: ' .
                        $e->getMessage(),
                        0,
                        $e
                    );
                }
            }
        );
    }

    /**
     * Verify Cashfree payment.
     */
    public function verifyCashfreePayment(
        ItrPayment $payment,
        string $orderId
    ): array {
        return $this->cashfree->verifyPayment(
            $payment,
            $orderId
        );
    }

    /**
     * Get paginated payments.
     */
    public function paginate(
        int $perPage = 20
    ): LengthAwarePaginator {
        return ItrPayment::query()
            ->latest('id')
            ->paginate($perPage);
    }

    /**
     * Find payment.
     */
    public function find(
        int $id
    ): ?ItrPayment {
        return ItrPayment::find($id);
    }

    /**
     * Update payment.
     */
    public function update(
        int $id,
        array $data
    ): ItrPayment {
        $payment = ItrPayment::findOrFail($id);

        $payment->update($data);

        return $payment->fresh();
    }

    /**
     * Delete payment.
     */
    public function delete(
        int $id
    ): bool {
        $payment = ItrPayment::findOrFail($id);

        return (bool) $payment->delete();
    }

    /**
     * Mark payment successful.
     */
    public function markSuccess(
        ItrPayment $payment,
        array $gatewayData = []
    ): ItrPayment {
        $payment->update([
            'payment_status' => 'success',
            'gateway_response' => $gatewayData,
            'paid_at' => now(),
        ]);

        return $payment->fresh();
    }

    /**
     * Mark payment failed.
     */
    public function markFailed(
        ItrPayment $payment,
        array $gatewayData = []
    ): ItrPayment {
        $payment->update([
            'payment_status' => 'failed',
            'gateway_response' => $gatewayData,
        ]);

        return $payment->fresh();
    }
}