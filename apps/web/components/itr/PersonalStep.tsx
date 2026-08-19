"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import itrService from "@/services/itr.service";
import kycService from "@/services/kyc.service";

import { useItrStore } from "@/store/itr";

const schema = z.object({
    assessment_year: z.string().min(1),

    financial_year: z.string().min(1),

    return_type: z.string().min(1),

    tax_regime: z.string().min(1),

    name: z.string().min(
        2,
        "Full name is required"
    ),

    date_of_birth: z.string().min(
        1,
        "Date of birth is required"
    ),

    pan: z.string().regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN Number"
    ),

    aadhaar: z.string().regex(
        /^[0-9]{12}$/,
        "Invalid Aadhaar Number"
    ),

    mobile: z.string().regex(
        /^[6-9][0-9]{9}$/,
        "Invalid Mobile Number"
    ),

    email: z.string().email(
        "Invalid email address"
    ),
});

type FormData = z.infer<
    typeof schema
>;

export default function PersonalStep() {
    const reset = useItrStore(
        (state) => state.reset
    );

    const setUuid = useItrStore(
        (state) => state.setUuid
    );

    const setStep = useItrStore(
        (state) => state.setStep
    );

    const setPersonal = useItrStore(
        (state) => state.setPersonal
    );

    const existingUuid = useItrStore(
        (state) => state.uuid
    );

    const [pending, startTransition] =
        useTransition();

    const [panVerifying, setPanVerifying] =
        useState(false);

    const [panVerified, setPanVerified] =
        useState(false);

    const [aadhaarSending, setAadhaarSending] =
        useState(false);

    const [aadhaarVerifying, setAadhaarVerifying] =
        useState(false);

    const [aadhaarVerified, setAadhaarVerified] =
        useState(false);

    const [otpSent, setOtpSent] =
        useState(false);

    const [referenceId, setReferenceId] =
        useState('');

    const [otp, setOtp] =
        useState('');

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),

        defaultValues: {
            assessment_year: "2026-27",
            financial_year: "2025-26",

            return_type: "ITR-1",

            tax_regime: "new",

            name: "",

            date_of_birth: "",

            pan: "",

            aadhaar: "",

            mobile: "",

            email: "",
        },
    });

    /*
     * Creates the ITR draft first.
     *
     * PAN verification requires an ITR UUID.
     */
    const createDraft = async (
    values: FormData
) => {
    const pan = values.pan.toUpperCase();

    /*
     * First check whether this PAN already has
     * a draft for the selected AY / ITR type.
     */
    const existingResponse =
        await itrService.checkExisting({
            assessment_year:
                values.assessment_year,

            financial_year:
                values.financial_year,

            return_type:
                values.return_type,

            tax_regime:
                values.tax_regime,

            pan,

            aadhaar:
                values.aadhaar,

            mobile:
                values.mobile,

            email:
                values.email,
        });

    const existingData =
        existingResponse?.data?.data;

    const existingReturn =
        existingData?.data ??
        existingData;

    const existingDraftUuid =
        existingReturn?.uuid ??
        null;

    /*
     * Existing draft found:
     * reuse its UUID instead of creating
     * another itr_returns record.
     */
    if (existingDraftUuid) {
        setUuid(existingDraftUuid);

        setPersonal({
            assessmentYear:
                values.assessment_year,

            financialYear:
                values.financial_year,

            pan,

            aadhaar:
                values.aadhaar,

            mobile:
                values.mobile,

            email:
                values.email,

            name:
                values.name,

            dateOfBirth:
                values.date_of_birth,
        });

        return existingDraftUuid;
    }

    /*
     * No existing draft found.
     * Create a new ITR draft.
     */
    const response =
        await itrService.create({
            assessment_year:
                values.assessment_year,

            financial_year:
                values.financial_year,

            return_type:
                values.return_type,

            tax_regime:
                values.tax_regime,

            pan,

            aadhaar:
                values.aadhaar,

            mobile:
                values.mobile,

            email:
                values.email,
        });

    const uuid =
        response.data?.uuid ??
        response.data?.data?.uuid;

    if (!uuid) {
        throw new Error(
            "ITR UUID not received from server."
        );
    }

    setUuid(uuid);

    setPersonal({
        assessmentYear:
            values.assessment_year,

        financialYear:
            values.financial_year,

        pan,

        aadhaar:
            values.aadhaar,

        mobile:
            values.mobile,

        email:
            values.email,

        name:
            values.name,

        dateOfBirth:
            values.date_of_birth,
    });

    return uuid;
};

/*
 * Save draft + verify PAN.
 *
 * This is intentionally separate from
 * moving to the Income step.
 */const handlePanVerification = async () => {
    const values =
        getValues();

    const dobParts =
        values.date_of_birth.split("-");

    const formattedDob =
        dobParts.length === 3
            ? `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`
            : values.date_of_birth;


        const validation =
            schema.safeParse(values);

        if (!validation.success) {
            const firstError =
                validation.error
                    .issues[0]
                    ?.message;

            toast.error(
                firstError ??
                    "Please complete your personal details."
            );

            return;
        }

        setPanVerifying(true);

        try {
            const uuid =
                await createDraft(values);

            const response =
                await kycService.verifyPan({
                    itr_return_uuid:
                        uuid,

                    pan:
                        values.pan.toUpperCase(),

                    name:
                        values.name,

                    date_of_birth:
                    formattedDob,
                });

            const verification =
    response.data?.data?.verification ?? null;

console.log(
    "========== PAN VERIFICATION =========="
);

console.log(
    "PAN RESPONSE:",
    response
);

console.log(
    "PAN RESPONSE DATA:",
    response?.data
);

console.log(
    "PAN VERIFICATION OBJECT:",
    verification
);

const verificationStatus =
    verification?.status ?? null;

console.log(
    "PAN VERIFICATION STATUS:",
    verificationStatus
);

if (
    verificationStatus ===
    "verified"
) {
    setPanVerified(true);

    toast.success(
        "PAN verified successfully."
    );
} else {
    setPanVerified(false);

    toast.error(
        "PAN verification failed. Please check your PAN, name and date of birth."
    );
}        } catch (error) {
            console.error(
                "========== PAN VERIFICATION ERROR =========="
            );

            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                console.error(
                    "STATUS:",
                    error.response?.status
                );

                console.error(
                    "DATA:",
                    error.response?.data
                );

                toast.error(
                    error.response?.data
                        ?.message ??
                        "Unable to verify PAN."
                );
            } else {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Unable to verify PAN."
                );
            }
        } finally {
            setPanVerifying(false);
        }
    };

    /**
     * Send Aadhaar OTP from the same Personal Information step.
     * PAN verification must be completed first because the ITR UUID
     * is created/reused during PAN verification.
     */
    const handleSendAadhaarOtp = async () => {
        const values = getValues();

        if (!panVerified) {
            toast.error(
                "Please verify your PAN before Aadhaar verification."
            );
            return;
        }

        if (!/^[0-9]{12}$/.test(values.aadhaar)) {
            toast.error("Please enter a valid 12 digit Aadhaar number.");
            return;
        }

        try {
            setAadhaarSending(true);

            const uuid =
                existingUuid ||
                (await createDraft(values));

            if (!uuid) {
                throw new Error(
                    "ITR UUID not available for Aadhaar verification."
                );
            }

            const response =
                await kycService.sendAadhaarOtp({
                    itr_return_uuid: uuid,
                    aadhaar: values.aadhaar,
                });

           const ref = response.data?.data?.reference_id ?? null;

            if (ref === null || ref === undefined || ref === "") {
                throw new Error(
                    "Aadhaar OTP reference ID was not received."
                );
            }

            setReferenceId(String(ref));
            setOtpSent(true);
            setAadhaarVerified(false);
            setOtp("");

            toast.success(
                response.data?.message ??
                    "Aadhaar OTP sent successfully."
            );
        } catch (error) {
            console.error(
                "========== AADHAAR OTP SEND ERROR ==========",
                error
            );

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Unable to send Aadhaar OTP."
                );
            } else {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Unable to send Aadhaar OTP."
                );
            }
        } finally {
            setAadhaarSending(false);
        }
    };

    /**
     * Verify Aadhaar OTP without leaving the Personal Information step.
     */
    const handleVerifyAadhaarOtp = async () => {
        const values = getValues();

        if (!otpSent || !referenceId) {
            toast.error("Please send the Aadhaar OTP first.");
            return;
        }

        if (!/^[0-9]{6}$/.test(otp)) {
            toast.error("Please enter the 6 digit OTP.");
            return;
        }

        const uuid =
            existingUuid ||
            (await createDraft(values));

        if (!uuid) {
            toast.error(
                "ITR UUID not available for Aadhaar verification."
            );
            return;
        }

        try {
            setAadhaarVerifying(true);

            const response =
                await kycService.verifyAadhaarOtp({
                    itr_return_uuid: uuid,
                    aadhaar: values.aadhaar,
                    reference_id: referenceId,
                    otp,
                });

            const status =
                response.data?.data?.verification?.status ??
                "";

            if (status === "verified") {
                setAadhaarVerified(true);
                toast.success(
                    response.data?.message ??
                        "Aadhaar verified successfully."
                );
            } else {
                setAadhaarVerified(false);
                toast.error(
                    "Aadhaar verification failed. Please check the OTP."
                );
            }
        } catch (error) {
            console.error(
                "========== AADHAAR OTP VERIFY ERROR ==========",
                error
            );

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Unable to verify Aadhaar OTP."
                );
            } else {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Unable to verify Aadhaar OTP."
                );
            }
        } finally {
            setAadhaarVerifying(false);
        }
    };

    /*
     * Continue to Income.
     *
     * PAN must be verified first.
     */
    const onSubmit = (
        values: FormData
    ) => {
        if (!panVerified) {
            toast.error(
                "Please verify your PAN before continuing."
            );

            return;
        }

        startTransition(
            async () => {
                try {
                    const uuid =
                        await createDraft(
                            values
                        );

                    setUuid(uuid);

                    setPersonal({
                        assessmentYear:
                            values.assessment_year,

                        financialYear:
                            values.financial_year,

                        pan:
                            values.pan.toUpperCase(),

                        aadhaar:
                            values.aadhaar,

                        mobile:
                            values.mobile,

                        email:
                            values.email,

                        name:
                            values.name,

                        dateOfBirth:
                            values.date_of_birth,
                    });

                    setStep(2);

                    toast.success(
                        "Personal details saved successfully."
                    );
                } catch (error) {
                    console.error(
                        "========== ITR CREATE ERROR =========="
                    );

                    console.error(error);

                    if (
                        axios.isAxiosError(
                            error
                        )
                    ) {
                        toast.error(
                            error.response
                                ?.data
                                ?.message ??
                                "Unable to create ITR draft."
                        );
                    } else {
                        toast.error(
                            error instanceof Error
                                ? error.message
                                : "Unable to create ITR draft."
                        );
                    }
                }
            }
        );
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <div>
                    <h2 className="text-2xl font-bold">
                        Personal Information
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter your details to
                        start filing your ITR.
                    </p>
                </div>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field
                            label="Full Name"
                            error={
                                errors
                                    .name
                                    ?.message
                            }
                        >
                            <Input
                                {...register(
                                    "name"
                                )}
                                placeholder="Enter your full name"
                            />
                        </Field>

                        <Field
                            label="Date of Birth"
                            error={
                                errors
                                    .date_of_birth
                                    ?.message
                            }
                        >
                            <Input
                                type="date"
                                {...register(
                                    "date_of_birth"
                                )}
                            />
                        </Field>

                        <Field
                            label="Assessment Year"
                            error={
                                errors
                                    .assessment_year
                                    ?.message
                            }
                        >
                            <Input
                                {...register(
                                    "assessment_year"
                                )}
                            />
                        </Field>

                        <Field
                            label="Financial Year"
                            error={
                                errors
                                    .financial_year
                                    ?.message
                            }
                        >
                            <Input
                                {...register(
                                    "financial_year"
                                )}
                            />
                        </Field>

                        <Field
                            label="PAN Number"
                            error={
                                errors
                                    .pan
                                    ?.message
                            }
                        >
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <Input
                                        {...register(
                                            "pan",
                                            {
                                                setValueAs:
                                                    (
                                                        value
                                                    ) =>
                                                        value
                                                            .toUpperCase()
                                                            .trim(),
                                            }
                                        )}
                                        className="uppercase"
                                        maxLength={10}
                                        placeholder="ABCDE1234F"
                                        disabled={
                                            panVerified
                                        }
                                    />

                                    <Button
                                        type="button"
                                        onClick={
                                            handlePanVerification
                                        }
                                        disabled={
                                            panVerifying ||
                                            panVerified
                                        }
                                    >
                                        {panVerifying
                                            ? "Verifying..."
                                            : panVerified
                                                ? "PAN Verified"
                                                : "Verify PAN"}
                                    </Button>
                                </div>

                                {panVerified && (
                                    <p className="text-sm font-medium text-green-600">
                                        PAN verified successfully.
                                    </p>
                                )}
                            </div>
                        </Field>

                        <Field
                            label="Aadhaar Number"
                            error={
                                errors
                                    .aadhaar
                                    ?.message
                            }
                        >
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <Input
                                        maxLength={12}
                                        inputMode="numeric"
                                        placeholder="12 digit Aadhaar number"
                                        disabled={aadhaarVerified}
                                        {...register(
                                            "aadhaar",
                                            {
                                                onChange: () => {
                                                    setOtpSent(false);
                                                    setAadhaarVerified(false);
                                                    setReferenceId("");
                                                    setOtp("");
                                                },
                                            }
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        onClick={
                                            handleSendAadhaarOtp
                                        }
                                        disabled={
                                            !panVerified ||
                                            aadhaarSending ||
                                            aadhaarVerified
                                        }
                                    >
                                        {aadhaarSending
                                            ? "Sending..."
                                            : otpSent
                                                ? "OTP Sent"
                                                : "Send OTP"}
                                    </Button>
                                </div>

                                {otpSent && !aadhaarVerified && (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex gap-3">
                                            <Input
                                                value={otp}
                                                onChange={(event) =>
                                                    setOtp(
                                                        event.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 6)
                                                    )
                                                }
                                                maxLength={6}
                                                inputMode="numeric"
                                                placeholder="Enter 6 digit OTP"
                                            />

                                            <Button
                                                type="button"
                                                onClick={
                                                    handleVerifyAadhaarOtp
                                                }
                                                disabled={
                                                    aadhaarVerifying ||
                                                    otp.length !== 6
                                                }
                                            >
                                                {aadhaarVerifying
                                                    ? "Verifying..."
                                                    : "Verify Aadhaar"}
                                            </Button>
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            OTP sent successfully. Enter the OTP to verify Aadhaar.
                                        </p>
                                    </div>
                                )}

                                {aadhaarVerified && (
                                    <p className="text-sm font-medium text-green-600">
                                        Aadhaar verified successfully.
                                    </p>
                                )}
                            </div>
                        </Field>

                        <Field
                            label="Mobile Number"
                            error={
                                errors
                                    .mobile
                                    ?.message
                            }
                        >
                            <Input
                                maxLength={10}
                                inputMode="numeric"
                                placeholder="10 digit mobile number"
                                {...register(
                                    "mobile"
                                )}
                            />
                        </Field>

                        <Field
                            label="Email Address"
                            error={
                                errors
                                    .email
                                    ?.message
                            }
                        >
                            <Input
                                type="email"
                                placeholder="Email address"
                                {...register(
                                    "email"
                                )}
                            />
                        </Field>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handlePanVerification
                            }
                            disabled={
                                panVerifying ||
                                panVerified
                            }
                        >
                            {panVerifying
                                ? "Verifying PAN..."
                                : panVerified
                                    ? "PAN Verified"
                                    : "Save Draft & Verify PAN"}
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                pending ||
                                panVerifying ||
                                aadhaarSending ||
                                aadhaarVerifying ||
                                !panVerified ||
                                !aadhaarVerified
                            }
                        >
                            {pending
                                ? "Saving..."
                                : !aadhaarVerified
                                    ? "Verify Aadhaar to Continue"
                                    : "Continue"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

interface FieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

function Field({
    label,
    error,
    children,
}: FieldProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
