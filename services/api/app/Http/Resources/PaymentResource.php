<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $metadata = $this->metadata ?? [];

        return [
            'id' => $this->id,

            'itr_return_id' => $this->itr_return_id,

            'transaction_id' => $this->transaction_id,

            'amount' => (float) $this->amount,

            'gst' => 0,

            'total' => (float) $this->amount,

            'currency' => $this->currency,

            'payment_status' =>
                $this->payment_status instanceof \BackedEnum
                    ? $this->payment_status->value
                    : $this->payment_status,

            'payment_gateway' => $this->payment_gateway,

            'gateway_transaction_id' =>
                $this->gateway_transaction_id,

            'gateway_response' =>
                $this->gateway_response,

            'cashfree_order_id' =>
                $metadata['cashfree_order_id'] ?? null,

            'payment_session_id' =>
                $metadata[
                    'cashfree_payment_session_id'
                ] ?? null,

            'paid_at' =>
                optional($this->paid_at)?->toDateTimeString(),

            'created_at' =>
                optional($this->created_at)?->toDateTimeString(),

            'updated_at' =>
                optional($this->updated_at)?->toDateTimeString(),
        ];
    }
}