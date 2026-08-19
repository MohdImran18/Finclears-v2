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

interface ItrWizardPageProps {
    searchParams?: Promise<{
        uuid?: string;
    }>;
}

export default function ItrWizardPage({
    searchParams,
}: ItrWizardPageProps) {
    const [urlUuid, setUrlUuid] =
        useState<string | null>(null);

    const step = useItrStore(
        (state) => state.currentStep
    );

    const setStep = useItrStore(
        (state) => state.setStep
    );

    const reset = useItrStore(
        (state) => state.reset
    );

    const storeUuid = useItrStore(
        (state) => state.uuid
    );

    const personal = useItrStore(
        (state) => state.personal
    );

    const income = useItrStore(
        (state) => state.income
    );

    const deductions = useItrStore(
        (state) => state.deductions
    );

    const tax = useItrStore(
        (state) => state.tax
    );

    const [loadingReview, setLoadingReview] =
        useState(false);

    const [review, setReview] =
        useState<any>(null);

    /*
     * Read UUID from Next.js searchParams.
     */
    useEffect(() => {
        let mounted = true;

        const loadParams = async () => {
            if (!searchParams) {
                if (mounted) {
                    setUrlUuid(null);
                }

                return;
            }

            const params = await searchParams;

            if (mounted) {
                setUrlUuid(
                    params?.uuid ?? null
                );
            }
        };

        void loadParams();

        return () => {
            mounted = false;
        };
    }, [searchParams]);

    /*
     * NEW ITR:
     *
     * /itr
     *
     * Clear old persisted Zustand data.
     *
     * EXISTING ITR:
     *
     * /itr?uuid=xxxx
     *
     * Do not reset existing data.
     */
    useEffect(() => {
        if (urlUuid === null) {
            reset();
            setStep(1);
        }
    }, [urlUuid, reset, setStep]);

    /*
     * If an existing UUID is present,
     * keep it in Zustand.
     */
    useEffect(() => {
        if (
            urlUuid &&
            storeUuid !== urlUuid
        ) {
            useItrStore
                .getState()
                .setUuid(urlUuid);
        }
    }, [urlUuid, storeUuid]);

    const handleReview = async () => {
        try {
            setLoadingReview(true);

            const uuid =
                urlUuid ||
                useItrStore.getState().uuid;

            if (!uuid) {
                toast.error(
                    "ITR UUID is missing. Please complete Personal Information first."
                );

                setStep(1);

                return;
            }

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

                uuid,
            };

            console.log(
                "========== GENERATING ITR REVIEW =========="
            );

            console.log(
                "UUID:",
                uuid
            );

            console.log(
                "REVIEW PAYLOAD:",
                payload
            );

            const response =
                await ReviewService.generate(
                    payload
                );

            console.log(
                "REVIEW API RESPONSE:",
                response
            );

            console.log(
                "REVIEW RESPONSE DATA:",
                response?.data
            );

            const reviewData =
                response?.data?.data ??
                response?.data;

            if (!reviewData) {
                throw new Error(
                    "Review response is empty."
                );
            }

            setReview(reviewData);

            setStep(5);

            toast.success(
                "Review generated successfully."
            );
        } catch (error) {
            console.error(
                "========== REVIEW ERROR =========="
            );

            console.error(error);

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
                return (
                    <TaxSummaryStep
                        onContinue={
                            handleReview
                        }
                    />
                );

            case 5:
                return (
                    <ReviewStep
                        review={review}
                        onPrevious={() =>
                            setStep(4)
                        }
                        onContinue={() =>
                            setStep(6)
                        }
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
                    Complete your Income Tax Return
                    in a few simple steps.
                </p>
            </div>

            <Stepper
                currentStep={step}
            />

            <div className="rounded-2xl border bg-white p-8 shadow-sm">
                {renderStep()}
            </div>
        </div>
    );
}