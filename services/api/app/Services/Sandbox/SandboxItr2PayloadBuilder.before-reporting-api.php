<?php

namespace App\Services\Sandbox;

use App\Models\ItrReturn;
use App\Models\ItrIncome;

class SandboxItr2PayloadBuilder
{
    /**
     * Build the external Sandbox ERI ITR-2 request.
     *
     * Important:
     * - This builder is intentionally separate from ItrPayloadBuilder.
     * - Aggregate capital-gain data is mapped only to fields that can be
     *   supported by the current Finclears schema. Transaction-level asset
     *   details are not fabricated when the database does not contain them.
     */
    public function build(ItrReturn $return): array
    {
        if ((int) $return->itr_type_id !== 2) {
            throw new \InvalidArgumentException(
                'SandboxItr2PayloadBuilder requires an ITR-2 return.'
            );
        }

        $return->loadMissing([
            'financialYear',
            'assessmentYear',
            'itrType',
            'taxRegime',
            'returnStatus',
            'incomes',
            'deductions',
            'payments',
        ]);

        $pan = strtoupper(
            trim((string) ($return->pan ?? ''))
        );

        $name = trim(
            (string) ($return->name ?? '')
        );

        $dob = $return->date_of_birth
            ? (string) $return->date_of_birth
            : null;

        $salary = $this->incomeModel($return, 1);
        $houseProperty = $this->incomeModel($return, 2);
        $capitalGain = $this->incomeModel($return, 4);
        $otherSources = $this->incomeModel($return, 5);

        $grossIncome = $this->money($return->gross_income);
        $taxableIncome = $this->money($return->taxable_income);

        $salaryGross = $this->money($salary?->gross_amount);
        $salaryTaxable = $this->money($salary?->taxable_amount);

        $stcg = $this->money($capitalGain?->short_term_gain);
        $ltcg = $this->money($capitalGain?->long_term_gain);
        $capitalGainTotal = $this->money(
            $capitalGain?->taxable_amount
                ?? ($stcg + $ltcg)
        );

        $interestIncome = $this->money($otherSources?->interest_income);
        $dividendIncome = $this->money($otherSources?->dividend_income);

        $otherGross = $this->money($otherSources?->gross_amount);
        $otherIncome = max(
            0,
            $otherGross - $interestIncome - $dividendIncome
        );

        $otherSourcesTotal = $this->money(
            $otherGross
        );

        $totalTds = $this->money($return->tds_amount);
        $totalTcs = $this->money($return->tcs_amount);
        $advanceTax = $this->money($return->advance_tax);
        $selfAssessmentTax = $this->money(
            $return->self_assessment_tax
        );
        $totalTaxesPaid = $this->money(
            $totalTds
                + $totalTcs
                + $advanceTax
                + $selfAssessmentTax
        );

        $deductionsTotal = $this->money(
            $return->total_deductions
        );

        // Derive deductions from the loaded deduction records as a fallback.
        // This keeps the external payload consistent even when the parent
        // ItrReturn total has not yet been recalculated.
        if ($deductionsTotal <= 0 && $return->deductions?->isNotEmpty()) {
            $deductionsTotal = $this->money(
                $return->deductions
                    ->where('is_active', true)
                    ->sum(function ($deduction) {
                        return $this->money(
                            $deduction->approved_amount
                                ?? $deduction->claimed_amount
                                ?? 0
                        );
                    })
            );
        }

        // The return's taxable_income is already the post-deduction amount.
        // Use gross income as the pre-deduction base here so deductions are not
        // subtracted twice when the parent return has been recalculated.
        $incomeAfterDeductions = max(
            0,
            $grossIncome - $deductionsTotal
        );

        return [
            'ITR' => [
                'ITR2' => [
                    'Form_ITR2' => [
                        'SchemaVer' => 'Ver1.0',
                        'Description' =>
                            'For Individuals and HUFs not having income from profits and gains of business or profession',
                        'FormVer' => 'Ver1.0',
                        'AssessmentYear' =>
                            $this->assessmentYearCode($return),
                        'FormName' => 'ITR-2',
                    ],

                    'PartA_GEN1' => [
                        'PersonalInfo' => [
                            'Status' => 'I',
                            'DOB' => $dob,
                            'AadhaarCardNo' =>
                                $this->nullableString(
                                    $return->aadhaar
                                ),
                            'AssesseeName' => [
                                'SurNameOrOrgName' =>
                                    $this->lastName($name),
                                'FirstName' =>
                                    $this->firstName($name),
                            ],
                            'PAN' => $pan,
                            'Address' => [],
                        ],
                        'FilingStatus' => [
                            'ConditionsResStatus' => '1',
                            'ResidentialStatus' => 'RES',
                            'OptOutNewTaxRegime' =>
                                $this->taxRegimeOptOut($return),
                            'AsseseeRepFlg' => 'N',
                            'CompDirectorPrvYrFlg' => 'N',
                            'FiiFpiFlag' => 'N',
                            'BenefitUs115HFlg' => 'N',
                        ],
                    ],

                    'ScheduleHP' => [
                        'TotalIncomeChargeableUnHP' =>
                            $this->money(
                                $houseProperty?->taxable_amount
                            ),
                        'PropertyDetails' => [],
                    ],

                    'ScheduleFSI' => [],
                    'ScheduleFA' => [],

                    'ScheduleEI' => [
                        'Others' => 0,
                        'InterestInc' => 0,
                        'GrossAgriRecpt' => 0,
                        'ExpIncAgri' => 0,
                        'TotalExemptInc' => $this->money(
                            $salary?->exempt_amount
                                ?? 0
                        ),
                    ],

                    'ScheduleAL' => [
                        'LiabilityInRelatAssets' => 0,
                        'ImmovableDetails' => [],
                        'MovableAsset' => [
                            'CashInHand' => 0,
                            'DepositsInBank' => 0,
                            'InsurancePolicies' => 0,
                            'JewelleryBullionEtc' => 0,
                            'SharesAndSecurities' => 0,
                            'ArchCollDrawPaintSulpArt' => 0,
                            'VehiclYachtsBoatsAircrafts' => 0,
                            'LoansAndAdvancesGiven' => 0,
                        ],
                    ],

                    'ScheduleVIA' => $this->buildScheduleVIA($return),

                    'ScheduleOS' => [
                        'TotOthSrcNoRaceHorse' =>
                            $otherSourcesTotal,
                        'IncOthThanOwnRaceHorse' => [
                            'DividendGross' => $dividendIncome,
                            'InterestGross' => $interestIncome,
                            'AnyOtherIncome' => $otherIncome,
                            'OthersGross' => $otherIncome,
                            'Deductions' => [
                                'Depreciation' => 0,
                                'UsrIntExp57' => 0,
                                'Expenses' => 0,
                                'DeductionUs57iia' => 0,
                                'IntExp57' => 0,
                                'TotDeductions' => 0,
                            ],
                        ],
                    ],

                    'ScheduleCGFor23' =>
                        $this->buildScheduleCGFor23(
                            $stcg,
                            $ltcg,
                            $capitalGainTotal
                        ),

                    'PartB-TI' => [
                        'CurrentYearLoss' => 0,
                        'CapGain' => [
                            'ShortTermLongTermTotal' =>
                                $this->money(
                                    $stcg + $ltcg
                                ),
                            'CapGains30Per115BBH' => 0,
                            'ShortTerm' => [
                                'ShortTerm20Per' => 0,
                                'ShortTerm15Per' => 0,
                                'ShortTerm30Per' => 0,
                                'ShortTermSplRateDTAA' => 0,
                                'ShortTermAppRate' => $stcg,
                                'TotalShortTerm' => $stcg,
                            ],
                            'LongTerm' => [
                                'LongTerm20Per' => 0,
                                'TotalLongTerm' => $ltcg,
                                'LongTermSplRateDTAA' => 0,
                                'LongTerm12_5Per' => $ltcg,
                                'LongTerm10Per' => 0,
                            ],
                            'TotalCapGains' =>
                                $capitalGainTotal,
                        ],

                        'TotalIncome' => $incomeAfterDeductions,
                        'GrossTotalIncome' => $grossIncome,
                        'AggregateIncome' => $grossIncome,
                        'DeemedIncomeUs115JC' => 0,
                        'DeductionsUnderScheduleVIA' =>
                            $deductionsTotal,
                        'BalanceAfterSetoffLosses' =>
                            $incomeAfterDeductions,
                        'LossesOfCurrentYearCarriedFwd' => 0,
                        'BroughtFwdLossesSetoff' => 0,
                        'IncFromOS' => [
                            'OtherSrcThanOwnRaceHorse' =>
                                $otherSourcesTotal,
                            'TotIncFromOS' =>
                                $otherSourcesTotal,
                            'FromOwnRaceHorse' => 0,
                            'IncChargblSplRate' => 0,
                        ],
                        'IncChargeTaxSplRate111A112' => 0,
                        'IncomeFromHP' =>
                            $this->money(
                                $houseProperty?->taxable_amount
                            ),
                        'TotalTI' => $incomeAfterDeductions,
                        'Salaries' => $salaryGross,
                        'NetAgricultureIncomeOrOtherIncomeForRate' => 0,
                        'IncChargeableTaxSplRates' =>
                            $capitalGainTotal,
                    ],

                    'ScheduleCYLA' =>
                        $this->buildScheduleCYLA(
                            $salaryGross,
                            $otherSourcesTotal,
                            $stcg,
                            $ltcg
                        ),

                    'PartB_TTI' => [
                        'TaxPaid' => [
                            'BalTaxPayable' =>
                                $this->money(
                                    $return->net_payable
                                ),
                            'TaxesPaid' => [
                                'TDS' => $totalTds,
                                'TCS' => $totalTcs,
                                'AdvanceTax' => $advanceTax,
                                'SelfAssessmentTax' =>
                                    $selfAssessmentTax,
                                'TotalTaxesPaid' => $totalTaxesPaid,
                            ],
                        ],
                        'ComputationOfTaxLiability' => [
                            'GrossTaxPayable' =>
                                $this->money(
                                    $return->tax_liability
                                ),
                            'TaxPayableOnTI' => [
                                'TaxAtNormalRatesOnAggrInc' => 0,
                                'TaxPayableOnTotInc' =>
                                    $this->money(
                                        $return->tax_liability
                                    ),
                                'RebateOnAgriInc' => 0,
                                'TaxAtSpecialRates' =>
                                    $capitalGainTotal,
                            ],
                            'Rebate87A' =>
                                $this->money(
                                    $return->rebate_amount
                                ),
                            'GrossTaxLiability' =>
                                $this->money(
                                    $return->tax_liability
                                ),
                            'NetTaxLiability' =>
                                $this->money(
                                    $return->net_payable
                                ),
                            'IntrstPay' => [
                                'TotalIntrstPay' =>
                                    $this->money(
                                        $return->interest_amount
                                    ),
                                'IntrstPayUs234A' => 0,
                                'IntrstPayUs234B' => 0,
                                'IntrstPayUs234C' => 0,
                                'LateFilingFee234F' =>
                                    $this->money(
                                        $return->late_fee
                                    ),
                            ],
                            'AggregateTaxInterestLiability' =>
                                $this->money(
                                    $return->interest_amount
                                        + $return->late_fee
                                ),
                        ],
                        'Refund' => [
                            'RefundDue' =>
                                $this->money(
                                    $return->refund_amount
                                ),
                        ],
                    ],

                    'Verification' => [
                        'Capacity' => 'S',
                        'Declaration' => [
                            'AssesseeVerName' => $name,
                            'AssesseeVerPAN' => $pan,
                            'FatherName' => null,
                        ],
                        'Date' => now()->toDateString(),
                        'Place' => null,
                    ],

                    'ScheduleIT' => [
                        'TaxPayment' => [],
                        'TotalTaxPayments' => $totalTaxesPaid,
                    ],

                    'CreationInfo' => [
                        'IntermediaryCity' => null,
                        'JSONCreationDate' =>
                            now()->toDateString(),
                        'Digest' => null,
                        'SWVersionNo' => '1.0',
                        'SWCreatedBy' => 'FINCLEARS',
                        'JSONCreatedBy' => 'FINCLEARS',
                    ],
                ],
            ],
        ];
    }

    protected function buildScheduleCGFor23(
        float $stcg,
        float $ltcg,
        float $total
    ): array {
        return [
            'ShortTermCapGainFor23' => [
                'SaleofLandBuild' => [
                    'SaleofLandBuildDtls' => [],
                ],
                'TotalSTCG' => $stcg,
                'TotalAmtTaxUsDTAAStcg' => 0,
                'EquityMFonSTT' => [],
                'TotalAmtNotTaxUsDTAAStcg' => 0,
                'SaleOnOtherAssets' => [
                    'CapgainonAssets' => 0,
                    'LossSec94of7Or94of8' => 0,
                    'FullValueConsdOthUnqshr' => 0,
                    'FullConsideration' => 0,
                    'DeductSec48' => [
                        'ImproveCost' => 0,
                        'ExpOnTrans' => 0,
                        'AquisitCost' => 0,
                        'TotalDedn' => 0,
                    ],
                    'FullValueConsdSec50CA' => 0,
                    'BalanceCG' => 0,
                    'FairMrktValueUnqshr' => 0,
                    'FullValueConsdRecvUnqshr' => 0,
                ],
                'TotalAmtDeemedStcg' => 0,
                'PassThrIncNatureSTCG' => 0,
                'PassThrIncNatureSTCG20Per' => 0,
                'PassThrIncNatureSTCGAppRate' => $stcg,
                'NRISecur115AD' => [
                    'CapgainonAssets' => 0,
                    'LossSec94of7Or94of8' => 0,
                    'FullValueConsdOthUnqshr' => 0,
                    'FullConsideration' => 0,
                    'DeductSec48' => [
                        'ImproveCost' => 0,
                        'ExpOnTrans' => 0,
                        'AquisitCost' => 0,
                        'TotalDedn' => 0,
                    ],
                    'FullValueConsdSec50CA' => 0,
                    'BalanceCG' => 0,
                    'FairMrktValueUnqshr' => 0,
                    'FullValueConsdRecvUnqshr' => 0,
                ],
                'PassThrIncNatureSTCG15Per' => 0,
                'NRITransacSec48Dtl' => [
                    'NRItaxSTTPaidTransferAE' => 0,
                    'NRItaxSTTPaid' => 0,
                    'NRItaxSTTNotPaid' => 0,
                    'NRItaxSTTPaidTransferBE' => 0,
                ],
                'PassThrIncNatureSTCG30Per' => 0,
                'UnutilizedStcgFlag' => 'N',
                'AmtDeemedStcg' => 0,
            ],

            'SumOfCGIncm' => $total,
            'IncmFromVDATrnsf' => 0,
            'AccruOrRecOfCG' => [
                'ShortTermUnder30Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'ShortTermUnderDTAARate' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'LongTermUnder10Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'LongTermUnderDTAARate' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'LongTermUnder12_5Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'LongTermUnder20Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'ShortTermUnderAppRate' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'ShortTermUnder20Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'VDATrnsfGainsUnder30Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
                'ShortTermUnder15Per' => [
                    'DateRange' => $this->emptyDateRange(),
                ],
            ],

            'DeducClaimInfo' => [
                'TotDeductClaim' => 0,
                'DeducClaimDtlsUs54' => [],
                'DeducClaimDtlsUs115F' => [],
                'DeducClaimDtlsUs54B' => [],
                'DeducClaimDtlsUs54EC' => [],
                'DeducClaimDtlsUs54F' => [],
            ],

            'LongTermCapGain23' => [
                'SaleofLandBuild' => [
                    'TotalExcessTax' => 0,
                    'TotalLTCGImmblPrprtyBE' => 0,
                    'TotalLTCGImmblPrprtyAE' => 0,
                    'TotalLTCGImmblPrprty' => 0,
                    'SaleofLandBuildDtls' => [],
                ],
                'PassThrIncNatureLTCG12_5Per' => $ltcg,
                'Proviso112Applicable' => [],
                'TotalAmtDeemedLtcg' => 0,
                'NRISaleofForeignAsset' => [
                    'DednSpecAssetus115AE' => 0,
                    'DednSpecAssetus115BE' => 0,
                    'BalonSpeciAssetTransferBE' => 0,
                    'BalonSpeciAssetTransferAE' => 0,
                    'SaleonSpecAsset' => 0,
                    'DednSpecAssetus115' => 0,
                    'SaleonSpecAssetTransferBE' => 0,
                    'BalonSpeciAsset' => 0,
                    'SaleonSpecAssetTransferAE' => 0,
                ],
                'PassThrIncNatureLTCG20Per' => 0,
                'PassThrIncNatureLTCG' => 0,
                'AmtDeemedLtcgTransferBE' => 0,
                'NRISaleOfEquityShareUs112A' => [
                    'DeductionUs54FBE' => 0,
                    'DeductionUs54F' => 0,
                    'CapgainonAssets' => 0,
                    'BalanceCGTransferBE' => 0,
                    'BalanceCGTransferAE' => 0,
                    'CapgainonAssetsTransferAE' => 0,
                    'BalanceCG' => 0,
                    'CapgainonAssetsTransferBE' => 0,
                    'DeductionUs54FAE' => 0,
                ],
                'AmtDeemedLtcgTransferAE' => 0,
                'TotalAmtNotTaxUsDTAALtcg' => 0,
                'PassThrIncNatureLTCGUs112A12_5Per' => 0,
                'TotalLTCG' => $ltcg,
                'TotalAmtTaxUsDTAALtcg' => 0,
                'UnutilizedLtcgFlag' => 'N',
                'SaleOfEquityShareUs112A' => [
                    'DeductionUs54FBE' => 0,
                    'DeductionUs54F' => 0,
                    'CapgainonAssets' => 0,
                    'BalanceCGTransferBE' => 0,
                    'BalanceCGTransferAE' => 0,
                    'CapgainonAssetsTransferAE' => 0,
                    'BalanceCG' => 0,
                    'CapgainonAssetsTransferBE' => 0,
                    'DeductionUs54FAE' => 0,
                ],
                'SaleofAssetNADtls' => [
                    'TotalCapgainonAssets' => 0,
                    'SaleofAssetNA_BE' => [
                        'DeductionUs54F' => 0,
                        'CapgainonAssets' => 0,
                        'FullValueConsdOthUnqshr' => 0,
                        'FullConsideration' => 0,
                        'DeductSec48' => [
                            'ImproveCost' => 0,
                            'ExpOnTrans' => 0,
                            'AquisitCost' => 0,
                            'TotalDedn' => 0,
                        ],
                        'FullValueConsdSec50CA' => 0,
                        'BalanceCG' => 0,
                        'FairMrktValueUnqshr' => 0,
                        'FullValueConsdRecvUnqshr' => 0,
                    ],
                    'SaleofAssetNA' => [
                        'DeductionUs54F' => 0,
                        'CapgainonAssets' => 0,
                        'FullValueConsdOthUnqshr' => 0,
                        'FullConsideration' => 0,
                        'DeductSec48' => [
                            'ImproveCost' => 0,
                            'ExpOnTrans' => 0,
                            'AquisitCost' => 0,
                            'TotalDedn' => 0,
                        ],
                        'FullValueConsdSec50CA' => 0,
                        'BalanceCG' => 0,
                        'FairMrktValueUnqshr' => 0,
                        'FullValueConsdRecvUnqshr' => 0,
                    ],
                ],
                'AmtDeemedLtcg' => 0,
                'PassThrIncNatureLTCGUs112A' => 0,
                'SaleofBondsDebntr' => [
                    'DeductionUs54F' => 0,
                    'CapgainonAssets' => 0,
                    'FullConsideration' => 0,
                    'DeductSec48' => [
                        'ImproveCost' => 0,
                        'ExpOnTrans' => 0,
                        'AquisitCost' => 0,
                        'TotalDedn' => 0,
                    ],
                    'BalanceCG' => 0,
                ],
                'PassThrIncNatureLTCG10Per' => 0,
            ],

            'TotScheduleCGFor23' => $total,
            'CurrYrLosses' => [
                'InLtcg12_5Per' => [
                    'LtclSetOff20Per' => 0,
                    'LtclSetOff10Per' => 0,
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOffDTAARate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'TotLossSetOff' => [
                    'LtclSetOff20Per' => 0,
                    'LtclSetOff10Per' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => 0,
                    'LtclSetOffDTAARate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'InLossSetOff' => [
                    'LtclSetOff20Per' => 0,
                    'LtclSetOff10Per' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => 0,
                    'LtclSetOffDTAARate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'InStcg20Per' => [
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => $stcg,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => $stcg,
                    'StclSetoffDTAARate' => 0,
                ],
                'InStcgAppRate' => [
                    'CurrYearIncome' => $stcg,
                    'StclSetoff15Per' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => $stcg,
                    'StclSetoffDTAARate' => 0,
                ],
                'InLtcgDTAARate' => [
                    'LtclSetOff20Per' => 0,
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'InStcg30Per' => [
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'StclSetoff20Per' => 0,
                    'CurrYrCapGain' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'InLtcg10Per' => [
                    'LtclSetOff20Per' => 0,
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => $ltcg,
                    'LtclSetOffDTAARate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => $ltcg,
                    'StclSetoffDTAARate' => 0,
                ],
                'InStcg15Per' => [
                    'CurrYearIncome' => 0,
                    'StclSetoffAppRate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                ],
                'InLtcg20Per' => [
                    'LtclSetOff10Per' => 0,
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
                'InStcgDTAARate' => [
                    'CurrYearIncome' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'CurrYrCapGain' => 0,
                ],
                'LossRemainSetOff' => [
                    'LtclSetOff20Per' => 0,
                    'LtclSetOff10Per' => 0,
                    'StclSetoff15Per' => 0,
                    'StclSetoffAppRate' => 0,
                    'LtclSetOff12_5Per' => 0,
                    'LtclSetOffDTAARate' => 0,
                    'StclSetoff20Per' => 0,
                    'StclSetoff30Per' => 0,
                    'StclSetoffDTAARate' => 0,
                ],
            ],
        ];
    }

    protected function buildScheduleVIA(
        ItrReturn $return
    ): array {
        $values = $this->emptyDeductions();
        $total = 0.0;

        foreach ($return->deductions ?? [] as $deduction) {
            $section = strtoupper(
                trim((string) (
                    $deduction->section_code ?? ''
                ))
            );

            $amount = $this->money(
                $deduction->approved_amount
                    ?? $deduction->claimed_amount
                    ?? 0
            );

            if ($amount <= 0) {
                continue;
            }

            $mapping = [
                '80C' => 'Section80C',
                '80D' => 'Section80D',
                '80E' => 'Section80E',
                '80G' => 'Section80G',
                '80GG' => 'Section80GG',
                '80TTA' => 'Section80TTA',
                '80TTB' => 'Section80TTB',
                '80U' => 'Section80U',
                '80DD' => 'Section80DD',
                '80DDB' => 'Section80DDB',
                '80EE' => 'Section80EE',
                '80EEA' => 'Section80EEA',
                '80EEB' => 'Section80EEB',
                '80GGA' => 'Section80GGA',
                '80GGC' => 'Section80GGC',
                '80QQB' => 'Section80QQB',
                '80RRB' => 'Section80RRB',
                '80CCC' => 'Section80CCC',
                '80CCD1B' => 'Section80CCD1B',
                '80CCH' => 'AnyOthSec80CCH',
            ];

            if (isset($mapping[$section])) {
                $key = $mapping[$section];
                $values['UsrDeductUndChapVIA'][$key] += $amount;
                $values['DeductUndChapVIA'][$key] += $amount;
                $total += $amount;
            }
        }

        $values['DeductUndChapVIA']['TotalChapVIADeductions'] =
            $this->money($total);

        return $values;
    }

    protected function emptyDeductions(): array
    {
        return [
            'UsrDeductUndChapVIA' => [
                'Section80DD' => 0,
                'Section80EE' => 0,
                'Section80GG' => 0,
                'Section80EEA' => 0,
                'Section80GGA' => 0,
                'Section80TTA' => 0,
                'Section80DDB' => 0,
                'Section80EEB' => 0,
                'Section80QQB' => 0,
                'Section80RRB' => 0,
                'Section80TTB' => 0,
                'Section80CCC' => 0,
                'Section80GGC' => 0,
                'Section80U' => 0,
                'Section80CCDEmployer' => 0,
                'Section80C' => 0,
                'Section80D' => 0,
                'Section80CCD1B' => 0,
                'Section80G' => 0,
                'AnyOthSec80CCH' => 0,
                'Section80E' => 0,
                'Section80CCDEmployeeOrSE' => 0,
            ],
            'DeductUndChapVIA' => [
                'Section80DD' => 0,
                'Section80EE' => 0,
                'Section80GG' => 0,
                'Section80EEA' => 0,
                'Section80GGA' => 0,
                'Section80TTA' => 0,
                'Section80DDB' => 0,
                'Section80EEB' => 0,
                'Section80RRB' => 0,
                'Section80QQB' => 0,
                'Section80TTB' => 0,
                'Section80CCC' => 0,
                'Section80GGC' => 0,
                'Section80U' => 0,
                'Section80CCDEmployer' => 0,
                'TotalChapVIADeductions' => 0,
                'Section80C' => 0,
                'Section80D' => 0,
                'Section80CCD1B' => 0,
                'Section80G' => 0,
                'AnyOthSec80CCH' => 0,
                'Section80E' => 0,
                'Section80CCDEmployeeOrSE' => 0,
            ],
        ];
    }

    protected function buildScheduleCYLA(
        float $salary,
        float $otherSources,
        float $stcg,
        float $ltcg
    ): array {
        $zero = [
            'HPlossCurYrSetoff' => 0,
            'OthSrcLossNoRaceHorseSetoff' => 0,
        ];

        return [
            'LTCGDTAARate' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'Salary' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => $salary,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => $salary,
                ],
            ],
            'STCGDTAARate' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'LossRemAftSetOff' => [
                'BalOthSrcLossNoRaceHorseAftSetoff' => 0,
                'BalHPlossCurYrAftSetoff' => 0,
            ],
            'LTCG20Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'HP' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    'OthSrcLossNoRaceHorseSetoff' => 0,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'LTCG12_5Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => $ltcg,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => $ltcg,
                ],
            ],
            'STCG20Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'TotalCurYr' => [
                'TotOthSrcLossNoRaceHorse' => 0,
                'TotHPlossCurYr' => 0,
            ],
            'OthSrcExclRaceHorse' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => $otherSources,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => $otherSources,
                ],
            ],
            'LTCG10Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'STCG30Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'OthSrcRaceHorse' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'STCG15Per' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => 0,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => 0,
                ],
            ],
            'STCGAppRate' => [
                'IncCYLA' => [
                    'IncOfCurYrUnderThatHead' => $stcg,
                    ...$zero,
                    'IncOfCurYrAfterSetOff' => $stcg,
                ],
            ],
            'TotalLossSetOff' => [
                'TotHPlossCurYrSetoff' => 0,
                'TotOthSrcLossNoRaceHorseSetoff' => 0,
            ],
        ];
    }

    protected function emptyDateRange(): array
    {
        return [
            'Upto15Of6' => 0,
            'Upto15Of9' => 0,
            'Up16Of3To31Of3' => 0,
            'Up16Of12To15Of3' => 0,
            'Up16Of9To15Of12' => 0,
        ];
    }

    protected function incomeModel(
        ItrReturn $return,
        int $incomeTypeId
    ): ?ItrIncome {
        return $return->incomes
            ->where('is_active', true)
            ->firstWhere(
                'income_type_id',
                $incomeTypeId
            );
    }

    protected function assessmentYearCode(
        ItrReturn $return
    ): string {
        $value = $return->assessmentYear?->name;

        if (!$value) {
            return '2026';
        }

        if (preg_match('/^\d{4}/', $value, $matches)) {
            return $matches[0];
        }

        return (string) $value;
    }

    protected function taxRegimeOptOut(
        ItrReturn $return
    ): string {
        $code = strtolower(
            (string) ($return->taxRegime?->code ?? '')
        );

        return $code === 'new'
            ? 'N'
            : 'Y';
    }

    protected function money(mixed $value): float
    {
        return round(
            (float) ($value ?? 0),
            2
        );
    }

    protected function nullableString(
        mixed $value
    ): ?string {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === ''
            ? null
            : $value;
    }

    protected function firstName(string $name): string
    {
        $parts = preg_split(
            '/\s+/',
            trim($name)
        );

        return $parts[0] ?? '';
    }

    protected function lastName(string $name): string
    {
        $parts = preg_split(
            '/\s+/',
            trim($name)
        );

        return count($parts) > 1
            ? (string) end($parts)
            : '';
    }
}