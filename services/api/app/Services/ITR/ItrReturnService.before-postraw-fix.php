<?php

namespace App\Services\ITR;

use App\Contracts\Repositories\ItrReturnRepositoryInterface;
use App\Enums\PaymentStatus;
use App\Models\AssessmentYear;
use App\Models\FinancialYear;
use App\Models\ItrIncome;
use App\Models\ItrDeduction;
use App\Models\ItrReturn;
use App\Models\ItrType;
use App\Models\ReturnStatus;
use App\Models\TaxRegime;
use App\Services\Pdf\PdfService;
use App\Services\Tax\TaxCalculationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Services\Sandbox\SandboxService;
use App\Services\ITR\ItrPayloadBuilder;
use App\Services\Sandbox\SandboxItr2PayloadBuilder;
class ItrReturnService
{
    public function __construct(
    protected ItrReturnRepositoryInterface $repository,
    protected TaxCalculationService $taxCalculationService,
    protected PdfService $pdfService,
    protected SandboxService $sandboxService,
    protected ItrPayloadBuilder $itrPayloadBuilder,
    protected SandboxItr2PayloadBuilder $sandboxItr2PayloadBuilder
    ) 
    {
    }

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function findByUuid(string $uuid): ?ItrReturn
    {
        return $this->repository->findByUuid($uuid);
    }

    public function findExistingDraft(array $data): ?ItrReturn
    {
        $financialYear = FinancialYear::where(
            'name',
            $data['financial_year']
        )->first();

        $assessmentYear = AssessmentYear::where(
            'name',
            $data['assessment_year']
        )->first();

        $itrType = ItrType::where(
            'code',
            $data['return_type']
        )->first();

        $draftStatus = ReturnStatus::where(
            'code',
            'draft'
        )->first();

        if (
            !$financialYear ||
            !$assessmentYear ||
            !$itrType ||
            !$draftStatus
        ) {
            return null;
        }

        return ItrReturn::where(
            'user_id',
            auth()->id()
        )
            ->where(
                'pan',
                strtoupper($data['pan'])
            )
            ->where(
                'financial_year_id',
                $financialYear->id
            )
            ->where(
                'assessment_year_id',
                $assessmentYear->id
            )
            ->where(
                'itr_type_id',
                $itrType->id
            )
            ->where(
                'return_status_id',
                $draftStatus->id
            )
            ->first();
    }
    public function createReturn(array $data): ItrReturn
{
    Log::info('========== ITR REQUEST DATA ==========');
    Log::info($data);

    return DB::transaction(function () use ($data) {

        $financialYear = FinancialYear::where(
            'name',
            $data['financial_year']
        )->firstOrFail();

        $assessmentYear = AssessmentYear::where(
            'name',
            $data['assessment_year']
        )->firstOrFail();

        $itrType = ItrType::where(
            'code',
            $data['return_type']
        )->firstOrFail();

        $taxRegime = TaxRegime::where(
            'code',
            $data['tax_regime']
        )->firstOrFail();

        $draftStatus = ReturnStatus::where(
            'code',
            'draft'
        )->firstOrFail();

        $pan = strtoupper(trim($data['pan']));
        $userId = auth()->id() ?: 1;

        /*
         * --------------------------------------------------------------
         * DUPLICATE CHECK
         * --------------------------------------------------------------
         *
         * Database unique constraint:
         *
         * pan + assessment_year_id + itr_type_id
         *
         * Therefore we MUST check the same combination before INSERT.
         *
         * If the same user already has a draft return, reuse it instead
         * of creating another record.
         */

        $existingReturn = ItrReturn::where(
            'pan',
            $pan
        )
            ->where(
                'assessment_year_id',
                $assessmentYear->id
            )
            ->where(
                'itr_type_id',
                $itrType->id
            )
            ->first();

        /*
         * Same PAN + AY + ITR Type already exists.
         */
        if ($existingReturn) {

            /*
             * ----------------------------------------------------------
             * SAME USER + DRAFT
             * ----------------------------------------------------------
             *
             * This is the normal "continue existing ITR" case.
             *
             * Return the existing record instead of inserting a new one.
             */
            if (
                (int) $existingReturn->user_id === (int) $userId &&
                (int) $existingReturn->return_status_id === (int) $draftStatus->id
            ) {
                Log::info(
                    'Existing draft ITR found. Reusing existing return.',
                    [
                        'itr_return_id' => $existingReturn->id,
                        'uuid' => $existingReturn->uuid,
                        'user_id' => $existingReturn->user_id,
                        'pan' => $pan,
                        'assessment_year_id' => $assessmentYear->id,
                        'itr_type_id' => $itrType->id,
                    ]
                );

                return $existingReturn->fresh();
            }

            /*
             * ----------------------------------------------------------
             * SAME USER BUT NON-DRAFT
             * ----------------------------------------------------------
             *
             * The database does not allow another return with the same
             * PAN + Assessment Year + ITR Type.
             */
            if (
                (int) $existingReturn->user_id === (int) $userId
            ) {
                throw new \Symfony\Component\HttpKernel\Exception\HttpException(
                    409,
                    'An ITR return already exists for this PAN, assessment year and ITR type.'
                );
            }

            /*
             * ----------------------------------------------------------
             * DIFFERENT USER
             * ----------------------------------------------------------
             *
             * PAN is already associated with another user's return.
             */
            throw new \Symfony\Component\HttpKernel\Exception\HttpException(
                409,
                'This PAN is already associated with an ITR return for the selected assessment year and ITR type.'
            );
        }

        /*
         * --------------------------------------------------------------
         * CREATE NEW RETURN
         * --------------------------------------------------------------
         */

        $insertData = [
            'user_id' => $userId,

            'company_id' => $data['company_id'] ?? null,

            'financial_year_id' => $financialYear->id,

            'assessment_year_id' => $assessmentYear->id,

            'itr_type_id' => $itrType->id,

            'tax_regime_id' => $taxRegime->id,

            'return_status_id' => $draftStatus->id,

            'return_number' => sprintf(
                'ITR-%s-%04d',
                now()->format('YmdHis'),
                random_int(1000, 9999)
            ),

            'pan' => $pan,

            'aadhaar' => $data['aadhaar'] ?? null,

            'mobile' => $data['mobile'] ?? null,

            'email' => isset($data['email'])
                ? strtolower(trim($data['email']))
                : null,
        ];

        $newReturn = $this->repository->create($insertData);

        Log::info(
            'New ITR return created successfully.',
            [
                'itr_return_id' => $newReturn->id,
                'uuid' => $newReturn->uuid,
                'user_id' => $newReturn->user_id,
                'pan' => $newReturn->pan,
                'assessment_year_id' => $newReturn->assessment_year_id,
                'itr_type_id' => $newReturn->itr_type_id,
            ]
        );

        return $newReturn;
    });
}
    /**
     * Update ITR Return + Income Details
     */
    public function updateReturn(
        int $id,
        array $data
    ): bool {

        return DB::transaction(function () use ($id, $data) {

            $return = ItrReturn::findOrFail($id);

            /*
             * Fields that belong directly to itr_returns.
             *
             * Important:
             * Only update fields that were actually sent.
             * This prevents partial updates from resetting
             * existing income/tax values to zero.
             */
            $returnData = [];

            foreach ([
                'company_id',
                'gross_income',
                'total_deductions',
                'taxable_income',
                'tax_liability',
                'interest_amount',
                'late_fee',
                'relief_amount',
                'rebate_amount',
                'tds_amount',
                'tcs_amount',
                'advance_tax',
                'self_assessment_tax',
                'refund_amount',
                'net_payable',
            ] as $field) {

                if (array_key_exists($field, $data)) {
                    $returnData[$field] = $data[$field];
                }
            }

            if (!empty($returnData)) {
                $return->update($returnData);
            }

            /*
             * Save detailed income data.
             */
            $userId = $return->user_id ?: (auth()->id() ?: 1);

            /*
             * Salary
             *
             * Partial-update safe.
             *
             * If only tds_amount is sent, existing salary,
             * exempt amount and taxable amount are preserved.
             */
            if (
                array_key_exists('annual_salary', $data) ||
                array_key_exists('exempt_allowances', $data) ||
                array_key_exists('professional_tax', $data) ||
                array_key_exists('tds_amount', $data) ||
                array_key_exists('tcs_amount', $data) ||
                array_key_exists('advance_tax', $data)
            ) {

                $salaryIncome = ItrIncome::where(
                    'itr_return_id',
                    $return->id
                )
                    ->where('income_type_id', 1)
                    ->where('is_active', true)
                    ->first();

                $annualSalary = array_key_exists(
                    'annual_salary',
                    $data
                )
                    ? (float) $data['annual_salary']
                    : (float) ($salaryIncome->gross_amount ?? 0);

                $exemptAllowances = array_key_exists(
                    'exempt_allowances',
                    $data
                )
                    ? (float) $data['exempt_allowances']
                    : (float) ($salaryIncome->exempt_amount ?? 0);

                $professionalTax = array_key_exists(
                    'professional_tax',
                    $data
                )
                    ? (float) $data['professional_tax']
                    : 0;

                $tdsAmount = array_key_exists(
                    'tds_amount',
                    $data
                )
                    ? (float) $data['tds_amount']
                    : (float) ($salaryIncome->tds_amount ?? 0);

                $tcsAmount = array_key_exists(
                    'tcs_amount',
                    $data
                )
                    ? (float) $data['tcs_amount']
                    : (float) ($salaryIncome->tcs_amount ?? 0);

                $advanceTax = array_key_exists(
                    'advance_tax',
                    $data
                )
                    ? (float) $data['advance_tax']
                    : (float) ($salaryIncome->advance_tax ?? 0);

                $taxableSalary = max(
                    0,
                    $annualSalary
                    - $exemptAllowances
                    - $professionalTax
                );

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 1,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Salary',

                        'gross_amount' => $annualSalary,

                        'exempt_amount' => $exemptAllowances,

                        'taxable_amount' => $taxableSalary,

                        'tds_amount' => $tdsAmount,

                        'tcs_amount' => $tcsAmount,

                        'advance_tax' => $advanceTax,

                        'is_manual_entry' => true,

                        'is_active' => true,
                    ]
                );
            }

                    /*
             * House Property
             */
            if (
                array_key_exists('rental_income', $data) ||
                array_key_exists('municipal_tax', $data) ||
                array_key_exists('home_loan_interest', $data)
            ) {

                $existingHouseProperty = ItrIncome::where(
                    'itr_return_id',
                    $return->id
                )
                    ->where('income_type_id', 2)
                    ->where('is_active', true)
                    ->first();

                $rentalIncome = array_key_exists(
                    'rental_income',
                    $data
                )
                    ? (float) $data['rental_income']
                    : (float) ($existingHouseProperty->rental_income ?? 0);

                $municipalTax = array_key_exists(
                    'municipal_tax',
                    $data
                )
                    ? (float) $data['municipal_tax']
                    : (float) ($existingHouseProperty->municipal_tax ?? 0);

                $homeLoanInterest = array_key_exists(
                    'home_loan_interest',
                    $data
                )
                    ? (float) $data['home_loan_interest']
                    : (float) ($existingHouseProperty->interest_on_housing_loan ?? 0);

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 2,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'House Property',

                        'gross_amount' => $rentalIncome,

                        'exempt_amount' => $municipalTax,

                        'taxable_amount' => max(
                            0,
                            $rentalIncome
                            - $municipalTax
                            - $homeLoanInterest
                        ),

                        'rental_income' => $rentalIncome,

                        'municipal_tax' => $municipalTax,

                        'interest_on_housing_loan' => $homeLoanInterest,

                        'is_manual_entry' => true,

                        'is_active' => true,
                    ]
                );
            }

            /*
             * Business / Profession
             */
            if (
                array_key_exists('business_income', $data) ||
                array_key_exists('business_expenses', $data)
            ) {

                $existingBusiness = ItrIncome::where(
                    'itr_return_id',
                    $return->id
                )
                    ->where('income_type_id', 3)
                    ->where('is_active', true)
                    ->first();

                $businessIncome = array_key_exists(
                    'business_income',
                    $data
                )
                    ? (float) $data['business_income']
                    : (float) ($existingBusiness->gross_amount ?? 0);

                $businessExpenses = array_key_exists(
                    'business_expenses',
                    $data
                )
                    ? (float) $data['business_expenses']
                    : 0;

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 3,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Business / Profession',

                        'gross_amount' => $businessIncome,

                        'taxable_amount' => max(
                            0,
                            $businessIncome
                            - $businessExpenses
                        ),

                        'business_profit' => max(
                            0,
                            $businessIncome
                            - $businessExpenses
                        ),

                        'is_manual_entry' => true,

                        'is_active' => true,
                    ]
                );
            }

            /*
             * Capital Gains
             */
            if (
                array_key_exists(
                    'short_term_capital_gain',
                    $data
                ) ||
                array_key_exists(
                    'long_term_capital_gain',
                    $data
                )
            ) {

                $existingCapitalGain = ItrIncome::where(
                    'itr_return_id',
                    $return->id
                )
                    ->where('income_type_id', 4)
                    ->where('is_active', true)
                    ->first();

                $stcg = array_key_exists(
                    'short_term_capital_gain',
                    $data
                )
                    ? (float) $data['short_term_capital_gain']
                    : (float) ($existingCapitalGain->short_term_gain ?? 0);

                $ltcg = array_key_exists(
                    'long_term_capital_gain',
                    $data
                )
                    ? (float) $data['long_term_capital_gain']
                    : (float) ($existingCapitalGain->long_term_gain ?? 0);

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 4,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Capital Gains',

                        'gross_amount' => $stcg + $ltcg,

                        'taxable_amount' => $stcg + $ltcg,

                        'short_term_gain' => $stcg,

                        'long_term_gain' => $ltcg,

                        'is_manual_entry' => true,

                        'is_active' => true,
                    ]
                );
            }

            /*
             * Other Sources
             */
            if (
                array_key_exists(
                    'interest_income',
                    $data
                ) ||
                array_key_exists(
                    'dividend_income',
                    $data
                ) ||
                array_key_exists(
                    'other_income',
                    $data
                )
            ) {

                $existingOther = ItrIncome::where(
                    'itr_return_id',
                    $return->id
                )
                    ->where('income_type_id', 5)
                    ->where('is_active', true)
                    ->first();

                $interestIncome = array_key_exists(
                    'interest_income',
                    $data
                )
                    ? (float) $data['interest_income']
                    : (float) ($existingOther->interest_income ?? 0);

                $dividendIncome = array_key_exists(
                    'dividend_income',
                    $data
                )
                    ? (float) $data['dividend_income']
                    : (float) ($existingOther->dividend_income ?? 0);

                $otherIncome = array_key_exists(
                    'other_income',
                    $data
                )
                    ? (float) $data['other_income']
                    : 0;

                $otherTotal =
                    $interestIncome
                    + $dividendIncome
                    + $otherIncome;

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 5,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Other Sources',

                        'gross_amount' => $otherTotal,

                        'taxable_amount' => $otherTotal,

                        'interest_income' => $interestIncome,

                        'dividend_income' => $dividendIncome,

                        'is_manual_entry' => true,

                        'is_active' => true,
                    ]
                );
            }

            /*
             * Recalculate ITR return income totals
             * from active detailed income records.
             *
             * TDS is a tax credit.
             * It must NOT reduce gross income
             * or taxable income.
             */
            $incomeTotals = ItrIncome::where(
                'itr_return_id',
                $return->id
            )
                ->where('is_active', true)
                ->selectRaw('
                    COALESCE(SUM(gross_amount), 0) as gross_income,
                    COALESCE(SUM(taxable_amount), 0) as taxable_income,
                    COALESCE(SUM(tds_amount), 0) as tds_amount,
                    COALESCE(SUM(tcs_amount), 0) as tcs_amount,
                    COALESCE(SUM(advance_tax), 0) as advance_tax,
                    COALESCE(SUM(self_assessment_tax), 0) as self_assessment_tax
                ')
                ->first();



                $deductionTotal = ItrDeduction::where(
    'itr_return_id',
    $return->id
)
    ->where('is_active', true)
    ->whereIn('status', ['verified', 'approved', 'submitted'])
    ->sum('approved_amount');

$grossIncome = (float) (
    $incomeTotals->gross_income ?? 0
);

$totalDeductions = (float) $deductionTotal;

$taxableIncome = max(
    0,
    $grossIncome - $totalDeductions
);



            $return->update([
                'gross_income' =>
                    $incomeTotals->gross_income ?? 0,

                'total_deductions' => $totalDeductions,

                'taxable_income' =>
                    $taxableIncome,

                'tds_amount' =>
                    $incomeTotals->tds_amount ?? 0,

                'tcs_amount' =>
                    $incomeTotals->tcs_amount ?? 0,

                'advance_tax' =>
                    $incomeTotals->advance_tax ?? 0,

                'self_assessment_tax' =>
                    $incomeTotals->self_assessment_tax ?? 0,
            ]);

            return true;
        });
    }

    public function deleteReturn(int $id): bool
    {
        return $this->repository->delete($id);
    }

        public function calculateTax(ItrReturn $return)
    {
        /*
         * Recalculate active income totals before tax calculation.
         */
        $incomeTotals = ItrIncome::where(
            'itr_return_id',
            $return->id
        )
            ->where('is_active', true)
            ->selectRaw('
                COALESCE(SUM(gross_amount), 0) as gross_income,
                COALESCE(SUM(taxable_amount), 0) as taxable_income,
                COALESCE(SUM(tds_amount), 0) as tds_amount,
                COALESCE(SUM(tcs_amount), 0) as tcs_amount,
                COALESCE(SUM(advance_tax), 0) as advance_tax,
                COALESCE(SUM(self_assessment_tax), 0) as self_assessment_tax
            ')
            ->first();

        $deductionTotal = ItrDeduction::where('itr_return_id', $return->id)
            ->where('is_active', true)
            ->whereIn('status', ['verified', 'approved', 'submitted'])
            ->sum('approved_amount');

        $grossIncome = (float) ($incomeTotals->gross_income ?? 0);
        $totalDeductions = (float) $deductionTotal;
        $taxableIncome = max(0, $grossIncome - $totalDeductions);

        /*
         * Sync income totals back to ITR return.
         */
        $return->update([
            'gross_income' =>
                (float) (
                    $incomeTotals->gross_income ?? 0
                ),

            'total_deductions' => $totalDeductions,

            'taxable_income' => $taxableIncome,

            'tds_amount' =>
                (float) (
                    $incomeTotals->tds_amount ?? 0
                ),

            'tcs_amount' =>
                (float) (
                    $incomeTotals->tcs_amount ?? 0
                ),

            'advance_tax' =>
                (float) (
                    $incomeTotals->advance_tax ?? 0
                ),

            'self_assessment_tax' =>
                (float) (
                    $incomeTotals->self_assessment_tax ?? 0
                ),
        ]);

        $return->refresh();

        /*
         * Tax calculation input.
         */
        $data = [
            'gross_income' => (float) (
                $return->gross_income ?? 0
            ),

            'deductions' => (float) (
                $return->total_deductions ?? 0
            ),

            'taxable_income' => (float) (
                $return->taxable_income ?? 0
            ),

            'tds_amount' => (float) (
                $return->tds_amount ?? 0
            ),

            'tcs_amount' => (float) (
                $return->tcs_amount ?? 0
            ),

            'advance_tax' => (float) (
                $return->advance_tax ?? 0
            ),

            'self_assessment_tax' => (float) (
                $return->self_assessment_tax ?? 0
            ),
        ];

        /*
         * Calculate tax.
         */
        $result = $this->taxCalculationService->calculate(
            $data
        );

        /*
         * Save tax result.
         */
        $return->update([

            /*
             * Tax liability before tax credits.
             */
            'tax_liability' =>
                $result['tax_liability'] ?? 0,

            /*
             * Tax credits.
             */
            'tds_amount' =>
                $result['tds_amount']
                ?? $data['tds_amount'],

            'tcs_amount' =>
                $result['tcs_amount']
                ?? $data['tcs_amount'],

            'advance_tax' =>
                $result['advance_tax']
                ?? $data['advance_tax'],

            'self_assessment_tax' =>
                $result['self_assessment_tax']
                ?? $data['self_assessment_tax'],

            /*
             * Final settlement.
             */
            'refund_amount' =>
                $result['refund_amount'] ?? 0,

            'net_payable' =>
                $result['net_payable'] ?? 0,
        ]);

        /*
         * Return fresh values.
         */
        $return->refresh();

        return [
            ...$result,

            'saved' => true,

            'return' => [

                'tax_liability' =>
                    (float) $return->tax_liability,

                'tds_amount' =>
                    (float) $return->tds_amount,

                'tcs_amount' =>
                    (float) $return->tcs_amount,

                'advance_tax' =>
                    (float) $return->advance_tax,

                'self_assessment_tax' =>
                    (float) $return->self_assessment_tax,

                'refund_amount' =>
                    (float) $return->refund_amount,

                'net_payable' =>
                    (float) $return->net_payable,
            ],
        ];
    }

    public function downloadPdf(
        ItrReturn $return
    ): BinaryFileResponse {
        return $this->pdfService->generate($return);
    }

    /**
     * Validate an ITR return against the Sandbox ERI API.
     *
     * This is deliberately a validation-only operation.
     * It does not mark the return as submitted.
     */
    public function validateReturn(
        ItrReturn $return
    ): array {
        $return->refresh();

        $pan = strtoupper(
            trim((string) $return->pan)
        );

        if ($pan === '') {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'PAN is required before Sandbox validation.',
                'validation_errors' => [
                    [
                        'message' => 'PAN is required.',
                    ],
                ],
                'warnings' => [],
                'response' => null,
                'return' => $return,
            ];
        }

        /*
         * The current Sandbox transformer supports ITR-2 only.
         * The builder itself also enforces this constraint.
         */
        $payload = $this->sandboxItr2PayloadBuilder->build(
            $return
        );

        /*
         * Sandbox ERI ITR validation endpoint.
         *
         * /it/compliance/eri/tax-payers/{tax_payer_id}/itrs/validate
         *
         * The request body is generated by SandboxItr2PayloadBuilder
         * and follows the ITR -> ITR2 structure from the Sandbox
         * OpenAPI example.
         */
        $endpoint = sprintf(
            '/it/compliance/eri/tax-payers/%s/itrs/validate',
            rawurlencode($pan)
        );

        try {
            $response = $this->sandboxService->post(
                $endpoint,
                $payload,
                60
            );

            /*
             * HTTP 200 does not necessarily mean ITR validation succeeded.
             * Sandbox can return data.successFlag=false with validation
             * messages inside the response.
             */
            $parsed = $this->parseValidationResponse(
                $response
            );

            $return->update([
                'api_request' => $payload,
                'api_response' => $response,
                'is_validated' => $parsed['success'],
                'validated_at' => $parsed['success']
                    ? now()
                    : null,
                'validation_errors' =>
                    empty($parsed['validation_errors'])
                        ? null
                        : $parsed['validation_errors'],
                'warnings' =>
                    empty($parsed['warnings'])
                        ? null
                        : $parsed['warnings'],
                'api_reference' =>
                    $parsed['api_reference'],
                'workflow_stage' => 'review',
            ]);

            if (!$parsed['success']) {
                return [
                    'success' => false,
                    'status' => 422,
                    'message' =>
                        'Sandbox validation returned validation errors.',
                    'validation_errors' =>
                        $parsed['validation_errors'],
                    'warnings' =>
                        $parsed['warnings'],
                    'response' => $response,
                    'return' => $return->fresh(),
                ];
            }

            return [
                'success' => true,
                'status' => 200,
                'message' =>
                    'ITR validated successfully by Sandbox.',
                'validation_errors' => [],
                'warnings' =>
                    $parsed['warnings'],
                'response' => $response,
                'return' => $return->fresh(),
            ];
        } catch (\Throwable $e) {
            /*
             * SandboxService throws RuntimeException for non-2xx
             * responses. Preserve the exact message for audit/debugging.
             */
            Log::error(
                'Sandbox ITR validation failed.',
                [
                    'itr_return_id' => $return->id,
                    'uuid' => $return->uuid,
                    'endpoint' => $endpoint,
                    'exception' => $e->getMessage(),
                ]
            );

            $error = [
                'message' => $e->getMessage(),
            ];

            $return->update([
                'api_request' => $payload,
                'api_response' => [
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                ],
                'is_validated' => false,
                'validated_at' => null,
                'validation_errors' => [$error],
                'warnings' => [],
                'api_reference' => null,
                'workflow_stage' => 'review',
            ]);

            return [
                'success' => false,
                'status' => 422,
                'message' => 'Sandbox validation failed.',
                'validation_errors' => [$error],
                'warnings' => [],
                'response' => [
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                ],
                'return' => $return->fresh(),
            ];
        }
    }

/**
 * Normalize Sandbox ERI validation responses.
 *
 * Supports:
 * - HTTP/API success with successFlag=true
 * - HTTP/API success with successFlag=false
 * - validation ERROR messages
 * - WARNING messages
 * - unknown response shapes
 */
protected function parseValidationResponse(
    mixed $response
): array {
    $result = [
        'success' => false,
        'validation_errors' => [],
        'warnings' => [],
        'api_reference' => null,
        'response' => $response,
    ];

    if (!is_array($response)) {
        $result['validation_errors'][] = [
            'message' => 'Sandbox returned an invalid response format.',
        ];

        return $result;
    }

    $data = [];

    if (isset($response['data']) && is_array($response['data'])) {
        $data = $response['data'];
    }

    /*
     * Sandbox ERI commonly exposes:
     *
     * data.successFlag
     * data.messages
     * data.errors
     */
    $successFlag = null;

    if (array_key_exists('successFlag', $data)) {
        $successFlag = (bool) $data['successFlag'];
    } elseif (array_key_exists('successFlag', $response)) {
        $successFlag = (bool) $response['successFlag'];
    } elseif (array_key_exists('success', $data)) {
        $successFlag = (bool) $data['success'];
    } elseif (array_key_exists('success', $response)) {
        $successFlag = (bool) $response['success'];
    }

    /*
     * Preserve API/reference identifiers when Sandbox provides them.
     */
    foreach ([
        'reference',
        'referenceId',
        'reference_id',
        'transaction_id',
        'transactionId',
        'api_reference',
    ] as $key) {
        if (
            array_key_exists($key, $response) &&
            $response[$key] !== null
        ) {
            $result['api_reference'] = $response[$key];
            break;
        }

        if (
            array_key_exists($key, $data) &&
            $data[$key] !== null
        ) {
            $result['api_reference'] = $data[$key];
            break;
        }
    }

    /*
     * Collect messages from both common locations.
     */
    $messages = [];

    foreach ([
        $data['messages'] ?? null,
        $response['messages'] ?? null,
        $data['errors'] ?? null,
        $response['errors'] ?? null,
    ] as $items) {
        if (!is_array($items)) {
            continue;
        }

        foreach ($items as $item) {
            if (is_array($item)) {
                $messages[] = $item;
            }
        }
    }

    foreach ($messages as $message) {
        $type = strtoupper(
            trim((string) (
                $message['type']
                ?? $message['severity']
                ?? ''
            ))
        );

        $description =
            $message['desc']
            ?? $message['description']
            ?? $message['message']
            ?? null;

        $normalized = [
            'code' =>
                $message['code'] ?? null,

            'fieldName' =>
                $message['fieldName']
                ?? $message['field']
                ?? null,

            'type' =>
                $type !== ''
                    ? $type
                    : null,

            'message' =>
                $description !== null
                    ? (string) $description
                    : 'Sandbox validation message.',
        ];

        if (
            in_array(
                $type,
                ['WARNING', 'WARN'],
                true
            )
        ) {
            $result['warnings'][] = $normalized;

            continue;
        }

        if (
            $type === 'ERROR'
            || $type === 'ERR'
        ) {
            $result['validation_errors'][] =
                $normalized;

            continue;
        }

        /*
         * Unknown/untyped messages are treated as validation
         * errors when successFlag is explicitly false.
         */
        if ($successFlag === false) {
            $result['validation_errors'][] =
                $normalized;

            continue;
        }

        /*
         * Untyped messages on an otherwise successful response
         * are treated as warnings.
         */
        $result['warnings'][] = $normalized;
    }

    /*
     * Explicit errors array that may not have been included above.
     */
    if (empty($result['validation_errors'])) {
        foreach ([
            $data['errors'] ?? null,
            $response['errors'] ?? null,
        ] as $errors) {
            if (!is_array($errors)) {
                continue;
            }

            foreach ($errors as $error) {
                if (is_array($error)) {
                    $result['validation_errors'][] = [
                        'code' =>
                            $error['code'] ?? null,

                        'fieldName' =>
                            $error['fieldName']
                            ?? $error['field']
                            ?? null,

                        'type' =>
                            strtoupper(
                                (string) (
                                    $error['type']
                                    ?? 'ERROR'
                                )
                            ),

                        'message' =>
                            (string) (
                                $error['desc']
                                ?? $error['description']
                                ?? $error['message']
                                ?? 'Sandbox validation error.'
                            ),
                    ];
                }
            }
        }
    }

    /*
     * Final validation decision.
     *
     * Explicit successFlag=false always wins.
     * Any normalized ERROR also means failure.
     */
    if ($successFlag === false) {
        $result['success'] = false;

        if (
            empty(
                $result['validation_errors']
            )
        ) {
            $result['validation_errors'][] = [
                'message' =>
                    'Sandbox validation failed.',
            ];
        }

        return $result;
    }

    if (
        !empty(
            $result['validation_errors']
        )
    ) {
        $result['success'] = false;

        return $result;
    }

    /*
     * Only explicitly successful responses are accepted.
     */
    $result['success'] =
        $successFlag === true;

    if (!$result['success']) {
        $result['validation_errors'][] = [
            'message' =>
                'Sandbox response did not contain an explicit success flag.',
        ];
    }

    return $result;
}





    /**
     * Extract warning messages from Sandbox responses.
     */
    protected function extractValidationWarnings(
        mixed $response
    ): array {
        if (!is_array($response)) {
            return [];
        }

        $warnings = [];

        foreach ([
            $response['warnings'] ?? null,
            $response['warning'] ?? null,
            $response['data']['warnings'] ?? null,
            $response['data']['warning'] ?? null,
        ] as $source) {
            if (is_array($source)) {
                foreach ($source as $warning) {
                    if (is_array($warning)) {
                        $warnings[] = [
                            'code' => $warning['code'] ?? null,
                            'field_name' =>
                                $warning['fieldName']
                                ?? $warning['field_name']
                                ?? null,
                            'type' => strtoupper(
                                trim((string) ($warning['type'] ?? 'WARNING'))
                            ),
                            'message' => trim(
                                (string) (
                                    $warning['desc']
                                    ?? $warning['message']
                                    ?? ''
                                )
                            ),
                        ];
                    } elseif ($warning !== null) {
                        $warnings[] = [
                            'message' => (string) $warning,
                        ];
                    }
                }
            } elseif ($source !== null) {
                $warnings[] = [
                    'message' => (string) $source,
                ];
            }
        }

        $messages = $response['data']['messages'] ?? null;

        if (is_array($messages)) {
            foreach ($messages as $message) {
                if (!is_array($message)) {
                    continue;
                }

                $type = strtoupper(
                    trim((string) ($message['type'] ?? ''))
                );

                if ($type === 'WARNING' || $type === 'WARN') {
                    $warnings[] = [
                        'code' => $message['code'] ?? null,
                        'field_name' =>
                            $message['fieldName']
                            ?? $message['field_name']
                            ?? null,
                        'type' => $type,
                        'message' => trim(
                            (string) (
                                $message['desc']
                                ?? $message['message']
                                ?? ''
                            )
                        ),
                    ];
                }
            }
        }

        return array_values(
            array_filter(
                $warnings,
                static fn (array $warning): bool =>
                    trim((string) ($warning['message'] ?? '')) !== ''
                    || !empty($warning['code'])
            )
        );
    }
    public function submitReturn(
        ItrReturn $return
    ): array {
        $return->refresh();

        /*
         * 1. KYC verification is mandatory.
         */
        if (!$return->is_verified) {
            return [
                'success' => false,
                'status' => 422,
                'message' =>
                    'ITR cannot be submitted before KYC verification.',
                'return' => $return,
            ];
        }

        /*
         * 2. Tax calculation must be completed.
         */
        if (
            (float) $return->taxable_income === 0.0
            && (float) $return->tax_liability === 0.0
            && (float) $return->refund_amount === 0.0
            && (float) $return->net_payable === 0.0
        ) {
            return [
                'success' => false,
                'status' => 422,
                'message' =>
                    'Please calculate tax before submitting the ITR.',
                'return' => $return,
            ];
        }

        /*
         * 3. Successful payment is mandatory.
         */
        $payment = $return->payments()
            ->where('payment_status', PaymentStatus::SUCCESS)
            ->latest('id')
            ->first();

        if (!$payment) {
            return [
                'success' => false,
                'status' => 402,
                'message' =>
                    'Successful payment is required before ITR submission.',
                'return' => $return,
            ];
        }

        /*
         * 4. Sandbox validation is mandatory.
         */
        if (!$return->is_validated) {
            return [
                'success' => false,
                'status' => 422,
                'message' =>
                    'ITR must pass Sandbox validation before submission.',
                'return' => $return,
            ];
        }

        /*
         * 5. Actual filing remains disabled until the filing
         *    endpoint is configured and production-tested.
         */
        if (
            !filter_var(
                config('services.sandbox.itr_filing_enabled', false),
                FILTER_VALIDATE_BOOL
            )
        ) {
            return [
                'success' => false,
                'status' => 503,
                'message' => 'ITR filing is currently disabled.',
                'return' => $return,
            ];
        }

        /*
         * 6. Actual filing.
         */
        $return->update([
            'workflow_stage' => 'filing',
        ]);

        try {
            $payload = $return->api_request;

            if (is_string($payload)) {
                $payload = json_decode(
                    $payload,
                    true
                );
            }

            if (!is_array($payload) || empty($payload)) {
                throw new \RuntimeException(
                    'Validated ITR payload is missing.'
                );
            }

            $response = $this->sandboxService->fileItr(
                $payload
            );

            $return->update([
                'api_response' => $response,
            ]);

            $reference =
                $response['transaction_id']
                ?? $response['reference_id']
                ?? $response['api_reference']
                ?? $response['data']['transaction_id']
                ?? $response['data']['reference_id']
                ?? null;

            $acknowledgement =
                $response['acknowledgement_number']
                ?? $response['acknowledgementNumber']
                ?? $response['data']['acknowledgement_number']
                ?? $response['data']['acknowledgementNumber']
                ?? null;

            $receipt =
                $response['receipt_number']
                ?? $response['receiptNumber']
                ?? $response['data']['receipt_number']
                ?? $response['data']['receiptNumber']
                ?? null;

            $success =
                ($response['success'] ?? false) === true
                || !empty($acknowledgement)
                || !empty($receipt);

            if (!$success) {
                $return->update([
                    'workflow_stage' => 'filing_failed',
                    'api_reference' => $reference,
                ]);

                return [
                    'success' => false,
                    'status' => 422,
                    'message' =>
                        $response['message']
                        ?? $response['error']
                        ?? 'ITR filing failed.',
                    'reference' => $reference,
                    'acknowledgement_number' => $acknowledgement,
                    'receipt_number' => $receipt,
                    'response' => $response,
                    'return' => $return->fresh(),
                ];
            }

            $return->update([
                'api_reference' => $reference,
                'acknowledgement_number' => $acknowledgement,
                'receipt_number' => $receipt,
                'filing_date' => now(),
                'workflow_stage' => 'filed',
                'return_status_id' => ReturnStatus::where(
                    'code',
                    'submitted'
                )->value('id'),
            ]);

            return [
                'success' => true,
                'status' => 200,
                'message' => 'ITR filed successfully.',
                'reference' => $reference,
                'acknowledgement_number' => $acknowledgement,
                'receipt_number' => $receipt,
                'response' => $response,
                'return' => $return->fresh(),
            ];

        } catch (\Throwable $e) {
            $return->update([
                'workflow_stage' => 'filing_failed',
                'api_response' => [
                    'success' => false,
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                ],
            ]);

            throw $e;
        }
    }
}

