<?php

namespace App\Services\ITR;

use App\Models\ItrReturn;
use Illuminate\Support\Collection;

class ItrPayloadBuilder
{
    public function build(ItrReturn $return): array
    {
        $return->load([
            'financialYear',
            'assessmentYear',
            'itrType',
            'taxRegime',
            'returnStatus',
            'incomes',
            'deductions',
            'payments',
        ]);

        return [
            'meta' => $this->buildMeta($return),

            'taxpayer' => $this->buildTaxpayer($return),

            'income' => $this->buildIncome(
                $return->incomes
            ),

            'deductions' => $this->buildDeductions(
                $return->deductions
            ),

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

    protected function buildMeta(ItrReturn $return): array
    {
        return [
            'itr_return_id' => $return->id,
            'uuid' => $return->uuid,

            'return_number' =>
                $return->return_number,

            'financial_year_id' =>
                $return->financial_year_id,

            'financial_year' =>
                $return->financialYear?->name,

            'assessment_year_id' =>
                $return->assessment_year_id,

            'assessment_year' =>
                $return->assessmentYear?->name,

            'itr_type_id' =>
                $return->itr_type_id,

            'itr_type' =>
                $return->itrType?->code,

            'tax_regime_id' =>
                $return->tax_regime_id,

            'tax_regime' =>
                $return->taxRegime?->code,

            'filing_type' =>
                $return->filing_type,

            'return_status_id' =>
                $return->return_status_id,

            'return_status' =>
                $return->returnStatus?->code,
        ];
    }

    protected function buildTaxpayer(ItrReturn $return): array
    {
        return [
            'user_id' =>
                $return->user_id,

            'name' =>
                $this->nullableString(
                    $return->name ?? null
                ),

            'date_of_birth' =>
                $this->nullableString(
                    $return->date_of_birth ?? null
                ),

            'pan' =>
                $this->nullableString(
                    strtoupper(
                        trim(
                            (string) (
                                $return->pan ?? ''
                            )
                        )
                    )
                ),

            'aadhaar' =>
                $this->nullableString(
                    $return->aadhaar ?? null
                ),

            'mobile' =>
                $this->nullableString(
                    $return->mobile ?? null
                ),

            'email' =>
                $this->nullableString(
                    $return->email ?? null
                ),
        ];
    }

    protected function buildIncome(
        Collection $incomes
    ): array {
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
                'gross_amount' =>
                    $this->money(
                        $salary?->gross_amount
                    ),

                'exempt_amount' =>
                    $this->money(
                        $salary?->exempt_amount
                    ),

                'taxable_amount' =>
                    $this->money(
                        $salary?->taxable_amount
                    ),

                'tds_amount' =>
                    $this->money(
                        $salary?->tds_amount
                    ),

                'tcs_amount' =>
                    $this->money(
                        $salary?->tcs_amount
                    ),

                'advance_tax' =>
                    $this->money(
                        $salary?->advance_tax
                    ),
            ],

            'house_property' => [
                'rental_income' =>
                    $this->money(
                        $houseProperty?->rental_income
                    ),

                'municipal_tax' =>
                    $this->money(
                        $houseProperty?->municipal_tax
                    ),

                'interest_on_housing_loan' =>
                    $this->money(
                        $houseProperty?->interest_on_housing_loan
                    ),

                'gross_amount' =>
                    $this->money(
                        $houseProperty?->gross_amount
                    ),

                'taxable_amount' =>
                    $this->money(
                        $houseProperty?->taxable_amount
                    ),
            ],

            'business_profession' => [
                'gross_amount' =>
                    $this->money(
                        $business?->gross_amount
                    ),

                'business_profit' =>
                    $this->money(
                        $business?->business_profit
                    ),

                'taxable_amount' =>
                    $this->money(
                        $business?->taxable_amount
                    ),
            ],

            'capital_gains' => [
                'short_term_gain' =>
                    $this->money(
                        $capitalGains?->short_term_gain
                    ),

                'long_term_gain' =>
                    $this->money(
                        $capitalGains?->long_term_gain
                    ),

                'gross_amount' =>
                    $this->money(
                        $capitalGains?->gross_amount
                    ),

                'taxable_amount' =>
                    $this->money(
                        $capitalGains?->taxable_amount
                    ),
            ],

            'other_sources' => [
                'interest_income' =>
                    $this->money(
                        $otherSources?->interest_income
                    ),

                'dividend_income' =>
                    $this->money(
                        $otherSources?->dividend_income
                    ),

                'other_income' =>
                    $this->money(
                        $otherSources?->other_income
                    ),

                'gross_amount' =>
                    $this->money(
                        $otherSources?->gross_amount
                    ),

                'taxable_amount' =>
                    $this->money(
                        $otherSources?->taxable_amount
                    ),
            ],
        ];
    }

    protected function buildDeductions(
        Collection $deductions
    ): array {
        return $deductions
            ->map(function ($deduction) {
                return [
                    'id' =>
                        $deduction->id,

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

                    'proof_submission_date' =>
                        $deduction->proof_submission_date,

                    'is_verified' =>
                        (bool) $deduction->is_verified,

                    'verified_at' =>
                        optional(
                            $deduction->verified_at
                        )->toISOString(),

                    'status' =>
                        $deduction->status,
                ];
            })
            ->values()
            ->all();
    }

    protected function buildTax(
        ItrReturn $return
    ): array {
        return [
            'gross_income' =>
                $this->money(
                    $return->gross_income
                ),

            'total_deductions' =>
                $this->money(
                    $return->total_deductions
                ),

            'taxable_income' =>
                $this->money(
                    $return->taxable_income
                ),

            'tax_liability' =>
                $this->money(
                    $return->tax_liability
                ),

            'refund_amount' =>
                $this->money(
                    $return->refund_amount
                ),

            'net_payable' =>
                $this->money(
                    $return->net_payable
                ),
        ];
    }

   protected function buildPayment(
    ItrReturn $return
): array {
    $payments = $return->payments;

    $successfulPayment = $payments
        ->filter(function ($payment) {
            $status = $payment->payment_status
                ?? $payment->status
                ?? null;

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
            $successfulPayment->payment_status
            ?? $successfulPayment->status
            ?? null;

        if ($paymentStatus instanceof \BackedEnum) {
            $paymentStatus = $paymentStatus->value;
        }

        $paymentStatus = strtolower(
            trim((string) ($paymentStatus ?? ''))
        );

        if ($paymentStatus === '') {
            $paymentStatus = null;
        }
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

    protected function buildVerification(
        ItrReturn $return
    ): array {
        return [
            'is_validated' =>
                (bool) $return->is_validated,

            'validated_at' =>
                optional(
                    $return->validated_at
                )->toISOString(),

            'is_verified' =>
                (bool) $return->is_verified,

            'verification_date' =>
                optional(
                    $return->verification_date
                )->toDateString(),

            'filing_date' =>
                optional(
                    $return->filing_date
                )->toDateString(),

            'verification_mode' =>
                $return->verification_mode ?? null,
        ];
    }

    protected function findIncome(
        Collection $incomes,
        int $incomeTypeId
    ) {
        return $incomes->firstWhere(
            'income_type_id',
            $incomeTypeId
        );
    }

    protected function money($value): float
    {
        return round(
            (float) ($value ?? 0),
            2
        );
    }

    protected function nullableString(
        $value
    ): ?string {
        if ($value === null) {
            return null;
        }

        $value = trim(
            (string) $value
        );

        return $value === ''
            ? null
            : $value;
    }
}