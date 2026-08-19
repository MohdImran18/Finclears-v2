<?php

namespace App\Services\Company;

use App\Models\Company;
use App\Models\CompanyPayment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CompanyPaymentService
{
    public function createPayment(
        Company $company,
        float $amount,
        ?Order $order = null
    ): CompanyPayment {
        return DB::transaction(function () use ($company, $amount, $order) {

            $payment = CompanyPayment::create([
                'company_id' => $company->id,
                'order_id' => $order?->id,
                'amount' => $amount,
                'currency' => 'INR',
                'payment_status' => 'pending',
                'payment_gateway' => 'cashfree',
            ]);

            return $payment->fresh();
        });
    }

    public function find(int $id): ?CompanyPayment
    {
        return CompanyPayment::with('company')->find($id);
    }

    public function markSuccess(
        CompanyPayment $payment,
        array $gatewayData = []
    ): CompanyPayment {
        $payment->update([
            'payment_status' => 'success',
            'gateway_response' => $gatewayData,
            'paid_at' => now(),
        ]);

        return $payment->fresh();
    }

    public function markFailed(
        CompanyPayment $payment,
        array $gatewayData = []
    ): CompanyPayment {
        $payment->update([
            'payment_status' => 'failed',
            'gateway_response' => $gatewayData,
        ]);

        return $payment->fresh();
    }
}
