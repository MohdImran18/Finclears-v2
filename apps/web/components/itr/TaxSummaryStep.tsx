"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { getApiError } from "@/lib/getApiError";
import itrService from "@/services/itr.service";
import { useItrStore } from "@/store/itr";

interface TaxSummary {
    gross_total_income: number;
    total_deductions: number;
    taxable_income: number;
    basic_tax: number;
    rebate: number;
    cess: number;
    surcharge: number;
    net_tax_payable: number;
}

interface TaxSummaryStepProps {
    onContinue?: () => void;
}

export default function TaxSummaryStep({
    onContinue,
}: TaxSummaryStepProps) {
    const uuid = useItrStore((state) => state.uuid);

    const income = useItrStore((state) => state.income);

    const deductions = useItrStore(
        (state) => state.deductions
    );

    const setStep = useItrStore(
        (state) => state.setStep
    );

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] =
        useState<TaxSummary | null>(null);

    const fetchTax = useCallback(async () => {
        if (!uuid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                gross_income: income.grossIncome,

                deduction: deductions.total,

                taxable_income:
                    income.grossIncome -
                    deductions.total,
            };

            const response =
                await itrService.calculate(
                    uuid,
                    payload
                );

            console.log(
                "========== ITR TAX API RESPONSE =========="
            );

            console.log(response);

            console.log(
                "RESPONSE DATA:",
                response?.data
            );

            console.log(
                "RESPONSE DATA.DATA:",
                response?.data?.data
            );

            console.log(
                "=========================================="
            );

            const apiData =
                response?.data?.data ??
                response?.data ??
                {};

            const calculated = {
                ...apiData,
                ...(apiData.return ?? {}),
            };

            setSummary({
                gross_total_income: Number(
                    calculated.gross_income ??
                        calculated.gross_total_income ??
                        0
                ),

                total_deductions: Number(
                    calculated.deductions ??
                        calculated.total_deductions ??
                        0
                ),

                taxable_income: Number(
                    calculated.taxable_income ?? 0
                ),

                basic_tax: Number(
                    calculated.tax_liability ??
                        calculated.basic_tax ??
                        0
                ),

                rebate: Number(
                    calculated.rebate_amount ??
                        calculated.rebate ??
                        0
                ),

                cess: Number(
                    calculated.cess ?? 0
                ),

                surcharge: Number(
                    calculated.surcharge ?? 0
                ),

                net_tax_payable: Number(
                    calculated.net_payable ??
                        calculated.net_tax_payable ??
                        0
                ),
            });

            toast.success(
                "Tax calculated successfully."
            );
        } catch (error: unknown) {
            console.error(
                "Tax calculation error:",
                error
            );

            toast.error(
                getApiError(
                    error,
                    "Unable to calculate tax."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [uuid, income, deductions]);

    useEffect(() => {
        void fetchTax();
    }, [fetchTax]);

    const formatCurrency = (
        value: number
    ) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(value);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                Calculating Tax...
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex h-64 items-center justify-center">
                No Tax Summary Available.
            </div>
        );
    }

    const rows = [
        {
            label: "Gross Total Income",
            value: formatCurrency(
                summary.gross_total_income
            ),
        },
        {
            label: "Total Deductions",
            value: formatCurrency(
                summary.total_deductions
            ),
        },
        {
            label: "Taxable Income",
            value: formatCurrency(
                summary.taxable_income
            ),
        },
        {
            label: "Basic Tax",
            value: formatCurrency(
                summary.basic_tax
            ),
        },
        {
            label: "Rebate",
            value: formatCurrency(
                summary.rebate
            ),
        },
        {
            label: "Health & Education Cess",
            value: formatCurrency(
                summary.cess
            ),
        },
        {
            label: "Surcharge",
            value: formatCurrency(
                summary.surcharge
            ),
        },
        {
            label: "Net Tax Payable",
            value: formatCurrency(
                summary.net_tax_payable
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">
                    Tax Summary
                </h2>

                <p className="mt-2 text-slate-500">
                    Review your calculated tax
                    before submission.
                </p>
            </div>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Tax Computation
                    </h3>

                    <Badge variant="success">
                        Calculated
                    </Badge>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
                            >
                                <span className="text-sm text-slate-600">
                                    {row.label}
                                </span>

                                <span className="font-semibold">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Tax Payable
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-blue-700">
                                    {formatCurrency(
                                        summary.net_tax_payable
                                    )}
                                </h2>
                            </div>

                            <Badge variant="success">
                                Ready to Review
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                >
                    Previous
                </Button>

                <Button
                    onClick={onContinue}
                >
                    Continue to Review
                </Button>
            </div>
        </div>
    );
}