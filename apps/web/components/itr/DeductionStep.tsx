"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import itrService from "@/services/itr.service";
import { useItrStore } from "@/store/itr";

const schema = z.object({
    section80c: z.coerce.number().min(0).max(150000),

    section80d: z.coerce.number().min(0),

    section80ccd1b: z.coerce.number().min(0).max(50000),

    section80g: z.coerce.number().min(0),

    section80tta: z.coerce.number().min(0),

    section80eea: z.coerce.number().min(0),
});

type FormData = z.output<typeof schema>;

export default function DeductionStep() {

    const uuid = useItrStore((state) => state.uuid);

    const income = useItrStore((state) => state.income);

    const deductions = useItrStore((state) => state.deductions);

    const setDeductions = useItrStore(
        (state) => state.setDeductions
    );

    const setTax = useItrStore(
        (state) => state.setTax
    );

    const setStep = useItrStore(
        (state) => state.setStep
    );

    const [pending, startTransition] =
        useTransition();

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
        resolver: zodResolver(schema),

        defaultValues: {
            section80c: deductions.section80c,

            section80d: deductions.section80d,

            section80ccd1b:
                deductions.section80ccd1b,

            section80g: 0,

            section80tta:
                deductions.section80tta,

            section80eea: 0,
        },
    });

    const values = watch();

    const totalDeduction = useMemo(() => {

        return (
            values.section80c +
            values.section80d +
            values.section80ccd1b +
            values.section80g +
            values.section80tta +
            values.section80eea
        );

    }, [values]);

    const taxableIncome = useMemo(() => {

        return Math.max(
            0,
            income.grossIncome - totalDeduction
        );

    }, [
        income.grossIncome,
        totalDeduction,
    ]);

    

    const onSubmit = (values: FormData) => {

        if (!uuid) {

            toast.error(
                "Please complete Personal Information first."
            );

            return;
        }

        startTransition(async () => {

            try {

                await itrService.update(uuid, {

                    ...values,

                    total_deduction:
                        totalDeduction,

                    taxable_income:
                        taxableIncome,

                });

                setDeductions({

                    section80c:
                        values.section80c,

                    section80d:
                        values.section80d,

                    section80ccd1b:
                        values.section80ccd1b,

                    section80tta:
                        values.section80tta,

                    total:
                        totalDeduction,

                });

                setTax({
                    taxableIncome,
                });

                toast.success(
                    "Deductions saved successfully."
                );

                setStep(4);

            } catch (error: unknown) {

                if (axios.isAxiosError(error)) {

                    toast.error(
                        error.response?.data?.message ??
                        "Unable to save deductions."
                    );

                } else if (error instanceof Error) {

                    toast.error(error.message);

                } else {

                    toast.error(
                        "Unable to save deductions."
                    );

                }

            }

        });

    };

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >

            <div>

                <h2 className="text-2xl font-bold">
                    Deductions
                </h2>

                <p className="mt-2 text-slate-500">
                    Enter all eligible deductions under the Income Tax Act.
                </p>

            </div>

            <Card>

                <CardHeader>

                    <h3 className="text-lg font-semibold">
                        Chapter VI-A Deductions
                    </h3>

                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">

                    <Field
                        label="Section 80C"
                        error={errors.section80c?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80c", { valueAsNumber: true })}
                        />
                    </Field>

                    <Field
                        label="Section 80D"
                        error={errors.section80d?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80d", { valueAsNumber: true })}
                        />
                    </Field>

                    <Field
                        label="Section 80CCD (1B)"
                        error={errors.section80ccd1b?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80ccd1b", { valueAsNumber: true })}
                        />
                    </Field>

                    <Field
                        label="Section 80G"
                        error={errors.section80g?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80g", { valueAsNumber: true })}
                        />
                    </Field>

                    <Field
                        label="Section 80TTA"
                        error={errors.section80tta?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80tta", { valueAsNumber: true })}
                        />
                    </Field>

                    <Field
                        label="Section 80EEA"
                        error={errors.section80eea?.message}
                    >
                        <Input
                            type="number"
                            {...register("section80eea", { valueAsNumber: true })}
                        />
                    </Field>

                </CardContent>

            </Card>

            <Card className="border-green-200 bg-green-50">

                <CardContent className="py-6">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Deduction
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-green-700">
                                ₹{totalDeduction.toLocaleString("en-IN")}
                            </h2>

                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Taxable Income
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-blue-700">
                                ₹{taxableIncome.toLocaleString("en-IN")}
                            </h2>

                        </div>

                    </div>

                </CardContent>

            </Card>

            <div className="flex justify-between">

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={pending}
                >
                    Previous
                </Button>

                <Button
                    type="submit"
                    disabled={pending}
                >
                    {pending
                        ? "Saving..."
                        : "Continue"}
                </Button>

            </div>

        </form>

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







