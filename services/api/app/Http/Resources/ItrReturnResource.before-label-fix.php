<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItrReturnResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(
        Request $request
    ): array {

        return [

            'id' => $this->id,

            'uuid' => $this->uuid,

            'user_id' => $this->user_id,

            'company_id' => $this->company_id,

            'financial_year_id' => $this->financial_year_id,

            'assessment_year_id' => $this->assessment_year_id,

            'itr_type_id' => $this->itr_type_id,

            'tax_regime_id' => $this->tax_regime_id,

            'return_status_id' => $this->return_status_id,

            'pan' => $this->pan,

            'pan_verification_status' =>
                $this->kycVerifications()
                    ->where('verification_status', 'verified')
                    ->latest('id')
                    ->value('verification_status'),

            'pan_verified_at' =>
                $this->kycVerifications()
                    ->where('verification_status', 'verified')
                    ->latest('id')
                    ->value('verified_at'),

            'pan_transaction_id' =>
                $this->kycVerifications()
                    ->where('verification_status', 'verified')
                    ->latest('id')
                    ->value('transaction_id'),

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

            'aadhaar' => $this->aadhaar,

            'mobile' => $this->mobile,

            'email' => $this->email,

            'gross_income' => $this->gross_income,

            'total_deductions' => $this->total_deductions,

            'taxable_income' => $this->taxable_income,

            'tax_liability' => $this->tax_liability,

            'refund_amount' => $this->refund_amount,

            'net_payable' => $this->net_payable,

            'workflow_stage' => $this->workflow_stage,

            'completion_percentage' => $this->completion_percentage,

            'is_verified' => $this->is_verified,

            'is_validated' => $this->is_validated,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}