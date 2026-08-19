<?php

namespace App\Services\ITR;

use App\Models\ItrReturn;
use Illuminate\Support\Collection;

class ItrPayloadBuilder
{
    /**
     * Build the internal filing payload for an ITR return.
     *
     * IMPORTANT:
     * This is the Finclears internal normalized payload.
     * It is NOT yet the final Sandbox government schema.
     *
     * The next layer will map this structure to the exact
     * Sandbox ITR Validate/Submit request format.
     */
    public function build(ItrReturn $return): array
    {
        $return->loadMissing([
            'financialYear',
            'assessmentYear',
            'itrType',
            'taxRegime',
            'returnStatus',
            'payments',
        ]);

        $incomes = $return->incomes()
            ->where('is_active', true)
            ->get();

        $deductions = $return->deductions()
            ->get();

        return [
            'meta' => $this->buildMeta($return),

            'taxpayer' => $this->buildTaxpayer($return),

            'income' => $this->buildIncome($incomes),

            'deductions' => $this->buildDeductions($deductions),

            'tax' => $this->buildTax($return),

            'payment' => $this->buildPayment($return),

            'verification' => $this->buildVerification($return),

            'source' => [
                'system' => 'finclears',
                'version' => '1.0',
                'generated_at' => now()->toISOString(),
            ],
        ];
    }

    /**
     * Return metadata.
     */
    protected function buildMeta(ItrReturn $return): array
    {
        return [
            'itr_return_id' => $return->id,
            'uuid' => $return->uuid,
            'return_number' => $return->return_number,

            'financial_year' => $return->financialYear?->name,
            'financial_year_id' => $return->financial_year_id,

            'assessment_year' => $return->assessmentYear?->name,
            'assessment_year_id' => $return->assessment_year_id,

            'itr_type' => $return->itrType?->code,
            'itr_type_id' => $return->itr_type_id,

            'tax_regime' => $return->taxRegime?->code,
            'tax_regime_id' => $return->tax_regime_id,

            'filing_type' => $return->filing_type,

            'status' => $return->returnStatus?->code,
            'status_id' => $return->return_status_id,
        ];
    }

    /**
     * Taxpayer information.
     *
     * Current frontend PersonalStep captures:
     * name, date_of_birth, PAN, Aadhaar, mobile and email.
     */
    protected function buildTaxpayer(ItrReturn $return): array
    {
        return [
            'name' => $this->stringOrNull($return->name ?? null),

            'date_of_birth' => $this->stringOrNull(
                $return->date_of_birth ?? null
            ),

            'pan' => strtoupper(
                trim((string) $return->pan)
            ),

            'aadhaar' => $this->stringOrNull(
                $return->aadhaar
            ),

            'mobile' => $this->stringOrNull(
                $return->mobile
            ),

            'email' => $this->stringOrNull(
                $return->email
            ),

            'pan_verification' => [
                'status' => $return->pan_verification_status,
                'verified_at' => optional(
                    $return->pan_verified_at
                )->toISOString(),
                'transaction_id' => $return->pan_transaction_id,
            ],

            'itr_verification' => [
                'is_verified' => (bool) $return->is_verified,
                'verified_at' => optional(
                    $return->verified_at
                )->toISOString(),
                'verification_mode' => $return->verification_mode,
            ],
        ];
    }

    /**
     * Income section.
     */
    protected function buildIncome(Collection $incomes): array
    {
        $salary = $this->findIncome(
            $incomes,
            1
        );

        $houseProperty = $this->findIncome(
            $incomes,
            2
        );

        $business = $this->findIncome(
            $incomes,
            3
        );

        $capitalGains = $this->findIncome(
            $incomes,
            4
        );

        $otherSources = $this->findIncome(
            $incomes,
            5
        );

        return [
            'salary' => [
                'gross_amount' => $this->money(
                    $salary?->gross_amount
                ),

                'exempt_amount' => $this->money(
                    $salary?->exempt_amount
                ),

                'taxable_amount' => $this->money(
                    $salary?->taxable_amount
                ),

                'tds_amount' => $this->money(
                    $salary?->tds_amount
                ),

                'tcs_amount' => $this->money(
                    $salary?->tcs_amount
                ),

                'advance_tax' => $this->money(
                    $salary?->advance_tax
                ),
            ],

            'house_property' => [
                'rental_income' => $this->money(
                    $houseProperty?->rental_income
                ),

                'municipal_tax' => $this->money(
                    $houseProperty?->municipal_tax
                ),

                'interest_on_housing_loan' => $this->money(
                    $houseProperty?->interest_on_housing_loan
                ),

                'gross_amount' => $this->money(
                    $houseProperty?->gross_amount
                ),

                'taxable_amount' => $this->money(
                    $houseProperty?->taxable_amount
                ),
            ],

            'business_profession' => [
                'gross_amount' => $this->money(
                    $business?->gross_amount
                ),

                'business_profit' => $this->money(
                    $business?->business_profit
                ),

                'taxable_amount' => $this->money(
                    $business?->taxable_amount
                ),
            ],

            'capital_gains' => [
                'short_term_gain' => $this->money(
                    $capitalGains?->short_term_gain
                ),

                'long_term_gain' => $this->money(
                    $capitalGains?->long_term_gain
                ),

                'gross_amount' => $this->money(
                    $capitalGains?->gross_amount
                ),

                'taxable_amount' => $this->money(
                    $capitalGains?->taxable_amount
                ),
            ],

            'other_sources' => [
                'interest_income' => $this->money(
                    $otherSources?->interest_income
                ),

                'dividend_income' => $this->money(
                    $otherSources?->dividend_income
                ),

                'other_income' => $this->money(
                    $otherSources?->other_income
                ),

                'gross_amount' => $this->money(
                    $otherSources?->gross_amount
                ),

                'taxable_amount' => $this->money(
                    $otherSources?->taxable_amount
                ),
            ],
        ];
    }

    /**
     * Deductions.
     *
     * Keep all records instead of assuming only 80C/80D etc.
     * The deduction table already stores section_code and amounts.
     */
    protected function buildDeductions(Collection $deductions): array
    {
        return $deductions
            ->map(function ($deduction) {
                return [
                    'id' => $deduction->id,

                    'deduction_type_id' =>
                        $deduction->deduction_type_id,

                    'section_code' =>
                        $deduction->section_code,

                    'section_name' =>
                        $deduction->section_name,

                    'description' =>
                        $deduction->description,

                    'claimed_amount' =>
                        $this->money(
                            $deduction->claimed_amount
                        ),

                    'eligible_amount' =>
                        $this->money(
                            $deduction->eligible_amount
                        ),

                    'approved_amount' =>
                        $this->money(
                            $deduction->approved_amount
                        ),

                    'disallowed_amount' =>
                        $this->money(
                            $deduction->disallowed_amount
                        ),

                    'proof_required' =>
                        (bool) $deduction->proof_required,

                    'proof_submitted' =>
                        (bool) $deduction->proof_submitted,

                    'is_verified' =>
                        (bool) $deduction->is_verified,

                    'status' =>
                        $deduction->status,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Tax summary.
     */
    protected function buildTax(ItrReturn $return): array
    {
        return [
            'gross_income' => $this->money(
                $return->gross_income
            ),

            'total_deductions' => $this->money(
                $return->total_deductions
            ),

            'taxable_income' => $this->money(
                $return->taxable_income
            ),

            'tax_liability' => $this->money(
                $return->tax_liability
            ),

            'interest_amount' => $this->money(
                $return->interest_amount
            ),

            'late_fee' => $this->money(
                $return->late_fee
            ),

            'relief_amount' => $this->money(
                $return->relief_amount
            ),

            'rebate_amount' => $this->money(
                $return->rebate_amount
            ),

            'tds_amount' => $this->money(
                $return->tds_amount
            ),

            'tcs_amount' => $this->money(
                $return->tcs_amount
            ),

            'advance_tax' => $this->money(
                $return->advance_tax
            ),

            'self_assessment_tax' => $this->money(
                $return->self_assessment_tax
            ),

            'refund_amount' => $this->money(
                $return->refund_amount
            ),

            'net_payable' => $this->money(
                $return->net_payable
            ),
        ];
    }

    /**
     * Payment information.
     */
    protected function buildPayment(
    ItrReturn $return
): array {
    $payments = $return->payments;

    $successfulPayment = $payments
        ->filter(function ($payment) {
            $status = $payment->payment_status;

            /*
             * PaymentStatus is a Backed Enum.
             * Use ->value instead of casting the Enum to string.
             */
            if ($status instanceof \BackedEnum) {
                $status = $status->value;
            }

            $status = strtolower(
                trim((string) ($status ?? ''))
            );

            return in_array(
                $status,
                [
                    'paid',
                    'success',
                    'successful',
                    'completed',
                ],
                true
            );
        })
        ->sortByDesc('paid_at')
        ->first();

    $paymentStatus = null;

    if ($successfulPayment) {
        $paymentStatus =
            $successfulPayment->payment_status;

        if ($paymentStatus instanceof \BackedEnum) {
            $paymentStatus =
                $paymentStatus->value;
        }

        $paymentStatus = strtolower(
            trim((string) $paymentStatus)
        );
    }

    return [
        'payment_required' => true,

        'payment_id' =>
            $successfulPayment?->id,

        'status' =>
            $paymentStatus,

        'amount' =>
            $this->money(
                $successfulPayment?->amount
            ),

        'currency' =>
            $successfulPayment?->currency
            ?? 'INR',

        'gateway' =>
            $successfulPayment?->payment_gateway,

        'transaction_id' =>
            $successfulPayment?->gateway_transaction_id,

        'paid_at' =>
            optional(
                $successfulPayment?->paid_at
            )->toISOString(),
    ];
}
    /**
     * Filing / verification information.
     */
    protected function buildVerification(ItrReturn $return): array
    {
        return [
            'is_validated' =>
                (bool) $return->is_validated,

            'validated_at' =>
                optional(
                    $return->validated_at
                )->toISOString(),

            'validation_errors' =>
                $return->validation_errors,

            'warnings' =>
                $return->warnings,

            'is_verified' =>
                (bool) $return->is_verified,

            'verified_at' =>
                optional(
                    $return->verified_at
                )->toISOString(),

            'verification_mode' =>
                $return->verification_mode,

            'workflow_stage' =>
                $return->workflow_stage,

            'completion_percentage' =>
                $return->completion_percentage,
        ];
    }

    /**
     * Find an income row by the existing income_type_id.
     */
    protected function findIncome(
        Collection $incomes,
        int $incomeTypeId
    ) {
        return $incomes->firstWhere(
            'income_type_id',
            $incomeTypeId
        );
    }

    /**
     * Normalize monetary values.
     */
    protected function money($value): float
    {
        return round(
            (float) ($value ?? 0),
            2
        );
    }

    /**
     * Normalize nullable strings.
     */
    protected function stringOrNull($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === ''
            ? null
            : $value;
    }
}