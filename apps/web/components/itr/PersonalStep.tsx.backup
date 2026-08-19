"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import itrService from "@/services/itr.service";
import { useItrStore } from "@/store/itr";

const schema = z.object({
    assessment_year: z.string().min(1),

    financial_year: z.string().min(1),

    return_type: z.string().min(1),

    tax_regime: z.string().min(1),

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

    email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function PersonalStep() {
    const reset = useItrStore((state) => state.reset);
    const setUuid = useItrStore((state) => state.setUuid);

    const setStep = useItrStore((state) => state.setStep);

    const setPersonal = useItrStore(
        (state) => state.setPersonal
    );

    const [pending, startTransition] =
        useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),

        defaultValues: {
            assessment_year: "2026-27",
            financial_year: "2025-26",

            return_type: "ITR-1",

            tax_regime: "new",
            pan: "",
            aadhaar: "",
            mobile: "",
            email: "",
        },
    });

    const onSubmit = (values: FormData) => {
        startTransition(async () => {
            try {
                const response =
                    await itrService.create({
    assessment_year: values.assessment_year,
    financial_year: values.financial_year,
    return_type: values.return_type,
    tax_regime: values.tax_regime,
    pan: values.pan,
    aadhaar: values.aadhaar,
    mobile: values.mobile,
    email: values.email,
});

                const uuid =
                    response.data?.uuid ??
                    response.data?.data?.uuid;

                if (!uuid) {
                    throw new Error(
                        "ITR UUID not received from server."
                    );
                }

                reset();

            setUuid(uuid);

                

                setPersonal({
                    assessmentYear:
                        values.assessment_year,

                    financialYear:
                        values.financial_year,

                    pan: values.pan.toUpperCase(),

                    aadhaar: values.aadhaar,

                    mobile: values.mobile,

                    email: values.email,
                });

                setStep(2);

                toast.success(
                    "Draft ITR created successfully."
                );
            } catch (error) {
    console.log("========== ERROR ==========");

    console.log(error);

    if (axios.isAxiosError(error)) {
        console.log("STATUS:", error.response?.status);

        console.log("DATA:", error.response?.data);

        console.log("REQUEST:", error.config?.data);

        toast.error(
            JSON.stringify(error.response?.data)
        );
    } else {
        console.error(error);
    }
}
        });
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
                                errors.pan?.message
                            }
                        >
                            <Input
                                {...register(
                                    "pan",
                                    {
                                        setValueAs:
                                            (
                                                value
                                            ) =>
                                                value.toUpperCase(),
                                    }
                                )}
                                className="uppercase"
                                maxLength={10}
                            />
                        </Field>

                        <Field
                            label="Aadhaar Number"
                            error={
                                errors.aadhaar
                                    ?.message
                            }
                        >
                            <Input
                                maxLength={12}
                                inputMode="numeric"
                                {...register(
                                    "aadhaar"
                                )}
                            />
                        </Field>

                        <Field
                            label="Mobile Number"
                            error={
                                errors.mobile
                                    ?.message
                            }
                        >
                            <Input
                                maxLength={10}
                                inputMode="numeric"
                                {...register(
                                    "mobile"
                                )}
                            />
                        </Field>

                        <Field
                            label="Email Address"
                            error={
                                errors.email
                                    ?.message
                            }
                        >
                            <Input
                                type="email"
                                {...register(
                                    "email"
                                )}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={pending}
                        >
                            {pending
                                ? "Creating Draft..."
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
            <label className="mb-2 block text-sm font-medium">
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






