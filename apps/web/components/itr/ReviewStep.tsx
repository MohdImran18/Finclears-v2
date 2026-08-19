"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

interface ReviewData {
    personal: {
        name: string;
        pan: string;
        aadhaar?: string;
        email: string;
        mobile: string;
    };

    income: {
        salary: number;
        house_property?: number;
        other_sources?: number;
        gross_income: number;
    };

    deductions: {
        total: number;
        "80c"?: number;
        "80d"?: number;
        "80ccd"?: number;
        "80tta"?: number;
    };

    tax: {
        old_regime: {
            tax: number;
        };

        new_regime: {
            tax: number;
        };

        recommended: string;

        payable: number;
    };
}

interface Props {
    review: ReviewData | null;

    onPrevious?: () => void;

    onContinue?: () => void;
}

const formatCurrency = (
    amount: number
) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);

export default function ReviewStep({
    review,
    onPrevious,
    onContinue,
}: Props) {
    if (!review) {
        return (
            <Card>
                <CardContent className="flex h-56 items-center justify-center">
                    Loading Review...
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">

            <div>

                <h2 className="text-2xl font-bold">
                    Review Your ITR
                </h2>

                <p className="mt-2 text-slate-500">
                    Verify all information before proceeding to payment.
                </p>

            </div>

            <Card>

                <CardHeader>

                    <h3 className="text-lg font-semibold">
                        Personal Information
                    </h3>

                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">

                    <Info
                        label="Full Name"
                        value={review.personal.name}
                    />

                    <Info
                        label="PAN Number"
                        value={review.personal.pan}
                    />

                    <Info
                        label="Email"
                        value={review.personal.email}
                    />

                    <Info
                        label="Mobile"
                        value={review.personal.mobile}
                    />

                </CardContent>

            </Card>

            <Card>

                <CardHeader>

                    <h3 className="text-lg font-semibold">
                        Income Summary
                    </h3>

                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">

                    <Info
                        label="Salary Income"
                        value={formatCurrency(
                            review.income.salary
                        )}
                    />

                    <Info
                        label="Gross Total Income"
                        value={formatCurrency(
                            review.income.gross_income
                        )}
                    />

                </CardContent>

            </Card>
                        <Card>

                <CardHeader>

                    <h3 className="text-lg font-semibold">
                        Deductions
                    </h3>

                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">

                    <Info
                        label="Section 80C"
                        value={formatCurrency(
                            review.deductions["80c"] ?? 0
                        )}
                    />

                    <Info
                        label="Section 80D"
                        value={formatCurrency(
                            review.deductions["80d"] ?? 0
                        )}
                    />

                    <Info
                        label="Section 80CCD(1B)"
                        value={formatCurrency(
                            review.deductions["80ccd"] ?? 0
                        )}
                    />

                    <Info
                        label="Section 80TTA"
                        value={formatCurrency(
                            review.deductions["80tta"] ?? 0
                        )}
                    />

                    <Info
                        label="Total Deductions"
                        value={formatCurrency(
                            review.deductions.total
                        )}
                    />

                </CardContent>

            </Card>

            <Card>

                <CardHeader className="flex items-center justify-between">

                    <h3 className="text-lg font-semibold">
                        Tax Summary
                    </h3>

                    <Badge
                        variant={
                            review.tax.recommended
                                .toLowerCase()
                                .includes("new")
                                ? "success"
                                : "warning"
                        }
                    >
                        {review.tax.recommended}
                    </Badge>

                </CardHeader>

                <CardContent className="space-y-4">

                    <Info
                        label="Old Regime Tax"
                        value={formatCurrency(
                            review.tax.old_regime.tax
                        )}
                    />

                    <Info
                        label="New Regime Tax"
                        value={formatCurrency(
                            review.tax.new_regime.tax
                        )}
                    />

                    <Info
                        label="Recommended Regime"
                        value={review.tax.recommended}
                    />

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

                        <p className="text-sm text-slate-500">
                            Total Tax Payable
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-blue-700">
                            {formatCurrency(
                                review.tax.payable
                            )}
                        </h2>

                    </div>

                </CardContent>

            </Card>

            <div className="flex items-center justify-between">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                >
                    Previous
                </Button>

                <Button
                    type="button"
                    onClick={onContinue}
                >
                    Continue to Payment
                </Button>

            </div>

        </div>
    );
}

interface InfoProps {
    label: string;

    value: string;
}

function Info({
    label,
    value,
}: InfoProps) {
    return (
        <div className="rounded-lg border bg-white p-4">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900">
                {value}
            </p>

        </div>
    );
}