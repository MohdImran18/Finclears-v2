"use client";

import { useEffect, useState } from "react";

import DeductionStep from "@/components/itr/DeductionStep";
import IncomeStep from "@/components/itr/IncomeStep";
import PaymentStep from "@/components/itr/PaymentStep";
import PersonalStep from "@/components/itr/PersonalStep";
import ReviewStep from "@/components/itr/ReviewStep";
import Stepper from "@/components/itr/Stepper";
import TaxSummaryStep from "@/components/itr/TaxSummaryStep";
import VerificationStep from "@/components/itr/VerificationStep";

import ReviewService from "@/services/review.service";

import { useItrStore } from "@/store/itr";

import { toast } from "sonner";

export default function ItrWizardPage() {
    const step = useItrStore((state) => state.currentStep);

    const setStep = useItrStore((state) => state.setStep);

    const reset = useItrStore((state) => state.reset);

    const personal = useItrStore((state) => state.personal);

    const income = useItrStore((state) => state.income);

    const deductions = useItrStore((state) => state.deductions);

    const tax = useItrStore((state) => state.tax);

    const [loadingReview, setLoadingReview] =
        useState(false);

    const [review, setReview] =
        useState<any>(null);

    useEffect(() => {
        reset();
    }, [reset]);

    const handleReview = async () => {
        try {
            setLoadingReview(true);

            const payload = {
                name: personal.name,

                pan: personal.pan,

                aadhaar: personal.aadhaar,

                mobile: personal.mobile,

                email: personal.email,

                salary: income.salary,

                house_property:
                    income.houseProperty,

                other_sources:
                    income.otherSources,

                gross_income:
                    income.grossIncome,

                deductions:
                    deductions.total,

                taxable_income:
                    tax.taxableIncome,

                "80c":
                    deductions.section80c,

                "80d":
                    deductions.section80d,

                "80ccd":
                    deductions.section80ccd1b,

                "80tta":
                    deductions.section80tta,
            };

            const response =
                await ReviewService.generate(
                    payload
                );

            setReview(response.data.data);

            setStep(5);

            toast.success(
                "Review generated successfully."
            );
        } catch {
            toast.error(
                "Unable to generate review."
            );
        } finally {
            setLoadingReview(false);
        }
    };
	    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalStep />;

            case 2:
                return <IncomeStep />;

            case 3:
                return <DeductionStep />;

            case 4:
                return <TaxSummaryStep />;

            case 5:
                return (
                    <ReviewStep
                        review={review}
                        onPrevious={() => setStep(4)}
                        onContinue={() => setStep(6)}
                    />
                );

            case 6:
                return <PaymentStep />;

            case 7:
                return <VerificationStep />;

            default:
                return <PersonalStep />;
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Income Tax Return Filing
                </h1>

                <p className="mt-2 text-slate-500">
                    Complete your Income Tax Return in a few simple
                    steps.
                </p>
            </div>

            <Stepper currentStep={step} />

            <div className="rounded-2xl border bg-white p-8 shadow-sm">
                {renderStep()}
            </div>

            {step === 4 && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        disabled={loadingReview}
                        onClick={handleReview}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loadingReview
                            ? "Generating Review..."
                            : "Continue to Review"}
                    </button>
                </div>
            )}
        </div>
    );
}
