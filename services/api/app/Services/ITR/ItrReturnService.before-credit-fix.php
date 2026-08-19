<?php

namespace App\Services\ITR;

use App\Contracts\Repositories\ItrReturnRepositoryInterface;
use App\Models\AssessmentYear;
use App\Models\FinancialYear;
use App\Models\ItrIncome;
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

class ItrReturnService
{
    public function __construct(
        protected ItrReturnRepositoryInterface $repository,
        protected TaxCalculationService $taxCalculationService,
        protected PdfService $pdfService
    ) {
    }

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function findByUuid(string $uuid): ?ItrReturn
    {
        return $this->repository->findByUuid($uuid);
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

            $insertData = [
                'user_id' => auth()->id() ?: 1,
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

                'pan' => strtoupper($data['pan']),
                'aadhaar' => $data['aadhaar'],
                'mobile' => $data['mobile'],
                'email' => strtolower($data['email']),
            ];

            return $this->repository->create($insertData);
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
             * Fields that actually belong to itr_returns
             */
            $returnData = [];

            foreach ([
                'company_id',
                'gross_income',
            ] as $field) {

                if (array_key_exists($field, $data)) {
                    $returnData[$field] = $data[$field];
                }
            }

            /*
             * Save only valid itr_returns columns
             */
            if (!empty($returnData)) {
                $return->update($returnData);
            }

            /*
             * Save detailed income data
             */
            $userId = $return->user_id ?: (auth()->id() ?: 1);

            /*
             * Salary
             */
            if (
                array_key_exists('annual_salary', $data) ||
                array_key_exists('exempt_allowances', $data) ||
                array_key_exists('professional_tax', $data)
            ) {

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 1,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Salary',
                        'gross_amount' => $data['annual_salary'] ?? 0,
                        'exempt_amount' => $data['exempt_allowances'] ?? 0,
                        'taxable_amount' => max(
                            0,
                            ($data['annual_salary'] ?? 0)
                            - ($data['exempt_allowances'] ?? 0)
                            - ($data['professional_tax'] ?? 0)
                        ),
                        'tds_amount' => 0,
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

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 2,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'House Property',
                        'gross_amount' => $data['rental_income'] ?? 0,
                        'exempt_amount' => $data['municipal_tax'] ?? 0,
                        'taxable_amount' => max(
                            0,
                            ($data['rental_income'] ?? 0)
                            - ($data['municipal_tax'] ?? 0)
                            - ($data['home_loan_interest'] ?? 0)
                        ),
                        'rental_income' => $data['rental_income'] ?? 0,
                        'municipal_tax' => $data['municipal_tax'] ?? 0,
                        'interest_on_housing_loan' => $data['home_loan_interest'] ?? 0,
                        'tds_amount' => 0,
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

                ItrIncome::updateOrCreate(
                    [
                        'itr_return_id' => $return->id,
                        'income_type_id' => 3,
                    ],
                    [
                        'user_id' => $userId,
                        'company_id' => $return->company_id,
                        'income_source' => 'Business / Profession',
                        'gross_amount' => $data['business_income'] ?? 0,
                        'taxable_amount' => max(
                            0,
                            ($data['business_income'] ?? 0)
                            - ($data['business_expenses'] ?? 0)
                        ),
                        'business_profit' => max(
                            0,
                            ($data['business_income'] ?? 0)
                            - ($data['business_expenses'] ?? 0)
                        ),
                        'tds_amount' => 0,
                        'is_manual_entry' => true,
                        'is_active' => true,
                    ]
                );
            }

            /*
             * Capital Gains
             */
            if (
                array_key_exists('short_term_capital_gain', $data) ||
                array_key_exists('long_term_capital_gain', $data)
            ) {

                $stcg = $data['short_term_capital_gain'] ?? 0;
                $ltcg = $data['long_term_capital_gain'] ?? 0;

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
                        'tds_amount' => 0,
                        'is_manual_entry' => true,
                        'is_active' => true,
                    ]
                );
            }

            /*
             * Other Sources
             */
            if (
                array_key_exists('interest_income', $data) ||
                array_key_exists('dividend_income', $data) ||
                array_key_exists('other_income', $data)
            ) {

                $otherTotal =
                    ($data['interest_income'] ?? 0)
                    + ($data['dividend_income'] ?? 0)
                    + ($data['other_income'] ?? 0);

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
                        'interest_income' => $data['interest_income'] ?? 0,
                        'dividend_income' => $data['dividend_income'] ?? 0,
                        'tds_amount' => 0,
                        'is_manual_entry' => true,
                        'is_active' => true,
                    ]
                );
            }
                    /*
         * Recalculate ITR return income totals
         * from active detailed income records.
         */
        $incomeTotals = ItrIncome::where(
            'itr_return_id',
            $return->id
        )
            ->where('is_active', true)
            ->selectRaw('
                COALESCE(SUM(gross_amount), 0) as gross_income,
                COALESCE(SUM(taxable_amount), 0) as taxable_income
            ')
            ->first();

        $return->update([
            'gross_income' => $incomeTotals->gross_income ?? 0,
            'taxable_income' => $incomeTotals->taxable_income ?? 0,
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
    $data = [
        'gross_income' => (float) ($return->gross_income ?? 0),
        'deductions' => (float) ($return->total_deductions ?? 0),
        'taxable_income' => (float) ($return->taxable_income ?? 0),
    ];

    $result = $this->taxCalculationService->calculate($data);

    $return->update([
        'tax_liability' => $result['payable'] ?? 0,
        'net_payable' => $result['payable'] ?? 0,
    ]);

    return [
        ...$result,
        'saved' => true,
        'return' => [
            'tax_liability' => (float) $return->tax_liability,
            'net_payable' => (float) $return->net_payable,
        ],
    ];
}
    public function downloadPdf(
        ItrReturn $return
    ): BinaryFileResponse {
        return $this->pdfService->generate($return);
    }

    public function submitReturn(
        ItrReturn $return
    ): bool {
        return $return->update([
            'return_status_id' => ReturnStatus::where(
                'code',
                'submitted'
            )->value('id'),
        ]);
    }
}
