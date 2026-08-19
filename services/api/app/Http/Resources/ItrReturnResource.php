<?php

namespace App\Http\Resources;

use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItrReturnResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        /*
        |--------------------------------------------------------------------------
        | Latest Payment
        |--------------------------------------------------------------------------
        |
        | An ITR return can have multiple payment attempts.
        | Always prefer the latest successful payment.
        | If there is no successful payment, fall back to the latest attempt.
        |
        */

        $payment = $this->payments()
            ->where('payment_status', PaymentStatus::SUCCESS)
            ->latest('id')
            ->first();

        if (!$payment) {
            $payment = $this->payments()
                ->latest('id')
                ->first();
        }

        $amount = $payment
            ? (float) $payment->amount
            : 0;

        $gst = $payment
            ? (
                (float) ($payment->tax_amount ?? 0) +
                (float) ($payment->interest_amount ?? 0) +
                (float) ($payment->penalty_amount ?? 0) +
                (float) ($payment->gateway_fee ?? 0)
            )
            : 0;

        $total = $amount + $gst;

        return [

            /*
            |--------------------------------------------------------------------------
            | Basic Return Information
            |--------------------------------------------------------------------------
            */

            'id' => $this->id,

            'uuid' => $this->uuid,

            'user_id' => $this->user_id,

            'company_id' => $this->company_id,

            /*
            |--------------------------------------------------------------------------
            | Financial Year
            |--------------------------------------------------------------------------
            */

            'financial_year_id' => $this->financial_year_id,

            'financial_year' => $this->financialYear
                ? [
                    'id' => $this->financialYear->id,
                    'name' => $this->financialYear->name,
                    'code' => $this->financialYear->code,
                ]
                : null,

            /*
            |--------------------------------------------------------------------------
            | Assessment Year
            |--------------------------------------------------------------------------
            */

            'assessment_year_id' => $this->assessment_year_id,

            'assessment_year' => $this->assessmentYear
                ? [
                    'id' => $this->assessmentYear->id,
                    'name' => $this->assessmentYear->name,
                    'code' => $this->assessmentYear->code,
                ]
                : null,

            /*
            |--------------------------------------------------------------------------
            | ITR Information
            |--------------------------------------------------------------------------
            */

            'itr_type_id' => $this->itr_type_id,

            'tax_regime_id' => $this->tax_regime_id,

            'return_status_id' => $this->return_status_id,

            'status' => $this->returnStatus
                ? [
                    'id' => $this->returnStatus->id,
                    'name' => $this->returnStatus->name,
                    'code' => $this->returnStatus->code,
                ]
                : null,

            /*
            |--------------------------------------------------------------------------
            | PAN / KYC
            |--------------------------------------------------------------------------
            */

            'pan' => $this->pan,

            'pan_verification_status' =>
                $this->kycVerifications()
                    ->where(
                        'verification_status',
                        'verified'
                    )
                    ->latest('id')
                    ->value(
                        'verification_status'
                    ),

            'pan_verified_at' =>
                $this->kycVerifications()
                    ->where(
                        'verification_status',
                        'verified'
                    )
                    ->latest('id')
                    ->value(
                        'verified_at'
                    ),

            'pan_transaction_id' =>
                $this->kycVerifications()
                    ->where(
                        'verification_status',
                        'verified'
                    )
                    ->latest('id')
                    ->value(
                        'transaction_id'
                    ),

            'kyc' => $this->kycVerifications()
                ->latest('id')
                ->first([
                    'id',
                    'pan',
                    'name_as_per_pan',
                    'date_of_birth',
                    'verification_status',
                    'name_match',
                    'date_of_birth_match',
                    'aadhaar_seeding_status',
                    'transaction_id',
                    'provider',
                    'verified_at',
                ]),

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            'aadhaar' => $this->aadhaar,

            'mobile' => $this->mobile,

            'email' => $this->email,

            /*
            |--------------------------------------------------------------------------
            | Income / Tax
            |--------------------------------------------------------------------------
            */

            'gross_income' => (float) ($this->gross_income ?? 0),

            'total_deductions' => (float) ($this->total_deductions ?? 0),

            'taxable_income' => (float) ($this->taxable_income ?? 0),

            'tax_liability' => (float) ($this->tax_liability ?? 0),

            'refund_amount' => (float) ($this->refund_amount ?? 0),

            'net_payable' => (float) ($this->net_payable ?? 0),

            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            */

            'payment' => $payment
                ? [
                    'id' => $payment->id,

                    'uuid' => $payment->uuid,

                    'itr_return_id' =>
                        $payment->itr_return_id,

                    'transaction_id' =>
                        $payment->transaction_id,

                    'amount' => $amount,

                    'tax_amount' =>
                        (float) ($payment->tax_amount ?? 0),

                    'interest_amount' =>
                        (float) ($payment->interest_amount ?? 0),

                    'penalty_amount' =>
                        (float) ($payment->penalty_amount ?? 0),

                    'gateway_fee' =>
                        (float) ($payment->gateway_fee ?? 0),

                    'gst' => $gst,

                    'total' => $total,

                    'currency' =>
                        $payment->currency,

                    'payment_status' =>
                        $payment->payment_status instanceof \BackedEnum
                            ? $payment->payment_status->value
                            : $payment->payment_status,

                    'payment_gateway' =>
                        $payment->payment_gateway,

                    'gateway_transaction_id' =>
                        $payment->gateway_transaction_id,

                    'paid_at' =>
                        optional(
                            $payment->paid_at
                        )?->toDateTimeString(),

                    'created_at' =>
                        optional(
                            $payment->created_at
                        )?->toDateTimeString(),

                    'updated_at' =>
                        optional(
                            $payment->updated_at
                        )?->toDateTimeString(),
                ]
                : [
                    'id' => null,

                    'uuid' => null,

                    'itr_return_id' =>
                        $this->id,

                    'transaction_id' => null,

                    'amount' => 0,

                    'tax_amount' => 0,

                    'interest_amount' => 0,

                    'penalty_amount' => 0,

                    'gateway_fee' => 0,

                    'gst' => 0,

                    'total' => 0,

                    'currency' => 'INR',

                    'payment_status' => 'pending',

                    'payment_gateway' => null,

                    'gateway_transaction_id' => null,

                    'paid_at' => null,

                    'created_at' => null,

                    'updated_at' => null,
                ],

            /*
            |--------------------------------------------------------------------------
            | Workflow
            |--------------------------------------------------------------------------
            */

            'workflow_stage' => $this->workflow_stage,

            'completion_percentage' =>
                $this->completion_percentage,

            'is_verified' => $this->is_verified,

            'is_validated' => $this->is_validated,

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}