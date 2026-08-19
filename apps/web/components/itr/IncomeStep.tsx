"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useMemo, useTransition } from "react";
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
import { useItrStore } from "@/store/itr";

const schema = z.object({
    annual_salary: z.coerce.number().min(0),

    exempt_allowances: z.coerce.number().min(0),

    professional_tax: z.coerce.number().min(0),

    tds_amount: z.coerce.number().min(0),

    tcs_amount: z.coerce.number().min(0),

    advance_tax: z.coerce.number().min(0),

    rental_income: z.coerce.number().min(0),

    municipal_tax: z.coerce.number().min(0),

    home_loan_interest: z.coerce.number().min(0),

    business_income: z.coerce.number().min(0),

    business_expenses: z.coerce.number().min(0),

    short_term_capital_gain: z.coerce.number().min(0),

    long_term_capital_gain: z.coerce.number().min(0),

    interest_income: z.coerce.number().min(0),

    dividend_income: z.coerce.number().min(0),

    other_income: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

export default function IncomeStep() {
    const uuid = useItrStore((state) => state.uuid);

    const income = useItrStore(
        (state) => state.income
    );

    const setIncome = useItrStore(
        (state) => state.setIncome
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
    } = useForm<FormData>({
        resolver: zodResolver(schema),

        defaultValues: {
            annual_salary:
                Number(income.salary ?? 0),

            exempt_allowances: 0,

            professional_tax: 0,

            tds_amount: 0,

            tcs_amount: 0,

            advance_tax: 0,

            rental_income:
                Number(income.houseProperty ?? 0),

            municipal_tax: 0,

            home_loan_interest: 0,

            business_income: 0,

            business_expenses: 0,

            short_term_capital_gain: 0,

            long_term_capital_gain: 0,

            interest_income: 0,

            dividend_income: 0,

            other_income:
                Number(income.otherSources ?? 0),
        },
    });

    const annual_salary =
        watch("annual_salary");

    const exempt_allowances =
        watch("exempt_allowances");

    const professional_tax =
        watch("professional_tax");

    const tds_amount =
        watch("tds_amount");

    const tcs_amount =
        watch("tcs_amount");

    const advance_tax =
        watch("advance_tax");

    const rental_income =
        watch("rental_income");

    const municipal_tax =
        watch("municipal_tax");

    const home_loan_interest =
        watch("home_loan_interest");

    const business_income =
        watch("business_income");

    const business_expenses =
        watch("business_expenses");

    const short_term_capital_gain =
        watch("short_term_capital_gain");

    const long_term_capital_gain =
        watch("long_term_capital_gain");

    const interest_income =
        watch("interest_income");

    const dividend_income =
        watch("dividend_income");

    const other_income =
        watch("other_income");

    /*
    |--------------------------------------------------------------------------
    | Gross Income
    |--------------------------------------------------------------------------
    */

    const grossIncome = useMemo(() => {
        const salary =
            Number(annual_salary) || 0;

        const exempt =
            Number(exempt_allowances) || 0;

        const professional =
            Number(professional_tax) || 0;

        const rental =
            Number(rental_income) || 0;

        const municipal =
            Number(municipal_tax) || 0;

        const homeLoan =
            Number(home_loan_interest) || 0;

        const business =
            Number(business_income) || 0;

        const businessExpense =
            Number(business_expenses) || 0;

        const stcg =
            Number(short_term_capital_gain) || 0;

        const ltcg =
            Number(long_term_capital_gain) || 0;

        const interest =
            Number(interest_income) || 0;

        const dividend =
            Number(dividend_income) || 0;

        const other =
            Number(other_income) || 0;

        return Math.max(
            0,
            salary -
                exempt -
                professional +
                rental -
                municipal -
                homeLoan +
                business -
                businessExpense +
                stcg +
                ltcg +
                interest +
                dividend +
                other
        );
    }, [
        annual_salary,
        exempt_allowances,
        professional_tax,
        rental_income,
        municipal_tax,
        home_loan_interest,
        business_income,
        business_expenses,
        short_term_capital_gain,
        long_term_capital_gain,
        interest_income,
        dividend_income,
        other_income,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Sync local income store
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const newIncome = {
            salary:
                Number(annual_salary) || 0,

            houseProperty:
                Number(rental_income) || 0,

            otherSources:
                Number(other_income) || 0,

            grossIncome:
                Number(grossIncome) || 0,
        };

        const currentIncome =
            useItrStore.getState().income;

        if (
            currentIncome.salary !==
                newIncome.salary ||
            currentIncome.houseProperty !==
                newIncome.houseProperty ||
            currentIncome.otherSources !==
                newIncome.otherSources ||
            currentIncome.grossIncome !==
                newIncome.grossIncome
        ) {
            setIncome(newIncome);
        }
    }, [
        annual_salary,
        rental_income,
        other_income,
        grossIncome,
        setIncome,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Save Income + Recalculate Tax
    |--------------------------------------------------------------------------
    */

    const onSubmit = (values: FormData) => {
        if (!uuid) {
            toast.error(
                "Please complete Personal Information first."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize all numeric values
        |--------------------------------------------------------------------------
        */

        const payload = {
            annual_salary:
                Number(values.annual_salary) || 0,

            exempt_allowances:
                Number(values.exempt_allowances) || 0,

            professional_tax:
                Number(values.professional_tax) || 0,

            tds_amount:
                Number(values.tds_amount) || 0,

            tcs_amount:
                Number(values.tcs_amount) || 0,

            advance_tax:
                Number(values.advance_tax) || 0,

            rental_income:
                Number(values.rental_income) || 0,

            municipal_tax:
                Number(values.municipal_tax) || 0,

            home_loan_interest:
                Number(values.home_loan_interest) || 0,

            business_income:
                Number(values.business_income) || 0,

            business_expenses:
                Number(values.business_expenses) || 0,

            short_term_capital_gain:
                Number(
                    values.short_term_capital_gain
                ) || 0,

            long_term_capital_gain:
                Number(
                    values.long_term_capital_gain
                ) || 0,

            interest_income:
                Number(values.interest_income) || 0,

            dividend_income:
                Number(values.dividend_income) || 0,

            other_income:
                Number(values.other_income) || 0,

            gross_income:
                Number(grossIncome) || 0,
        };

        /*
        |--------------------------------------------------------------------------
        | Debug
        |--------------------------------------------------------------------------
        */

        console.log(
            "========== ITR INCOME SUBMIT =========="
        );

        console.log(
            "ITR UUID:",
            uuid
        );

        console.log(
            "Annual Salary:",
            payload.annual_salary
        );

        console.log(
            "Gross Income:",
            payload.gross_income
        );

        console.log(
            "TDS:",
            payload.tds_amount
        );

        console.log(
            "TCS:",
            payload.tcs_amount
        );

        console.log(
            "Advance Tax:",
            payload.advance_tax
        );

        console.log(
            "FULL PAYLOAD:",
            payload
        );

        console.log(
            "======================================="
        );

        startTransition(async () => {
            try {
                /*
                |--------------------------------------------------------------------------
                | Step 1: Save Income Details
                |--------------------------------------------------------------------------
                */

                const updateResponse =
                    await itrService.update(
                        uuid,
                        payload
                    );

                console.log(
                    "ITR UPDATE RESPONSE:",
                    updateResponse.data
                );

                /*
                |--------------------------------------------------------------------------
                | Step 2: Recalculate Tax
                |--------------------------------------------------------------------------
                */

                const taxResponse =
                    await itrService.calculate(
                        uuid,
                        {
                            gross_income:
                                payload.gross_income,

                            taxable_income:
                                payload.gross_income,

                            deductions: 0,

                            tds_amount:
                                payload.tds_amount,

                            tcs_amount:
                                payload.tcs_amount,

                            advance_tax:
                                payload.advance_tax,

                            self_assessment_tax: 0,
                        }
                    );

                console.log(
                    "ITR TAX CALCULATION RESPONSE:",
                    taxResponse.data
                );

                toast.success(
                    "Income details saved and tax recalculated successfully."
                );

                setStep(3);
            } catch (error: unknown) {
                console.error(
                    "ITR INCOME SAVE ERROR:",
                    error
                );

                if (
                    axios.isAxiosError(error)
                ) {
                    console.error(
                        "API ERROR RESPONSE:",
                        error.response?.data
                    );

                    toast.error(
                        error.response?.data
                            ?.message ??
                        "Unable to save income details."
                    );
                } else if (
                    error instanceof Error
                ) {
                    toast.error(
                        error.message
                    );
                } else {
                    toast.error(
                        "Unable to save income details."
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
                    Income Details
                </h2>

                <p className="mt-2 text-slate-500">
                    Enter income from all applicable
                    sources.
                </p>
            </div>

            {/* Salary Income */}

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        Salary Income
                    </h3>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Annual Salary"
                        error={
                            errors.annual_salary
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter annual salary"
                            {...register(
                                "annual_salary",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Exempt Allowances"
                        error={
                            errors
                                .exempt_allowances
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter exempt allowances"
                            {...register(
                                "exempt_allowances",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Professional Tax"
                        error={
                            errors
                                .professional_tax
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter professional tax"
                            {...register(
                                "professional_tax",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="TDS Deducted"
                        error={
                            errors.tds_amount
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter TDS deducted"
                            {...register(
                                "tds_amount",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="TCS Collected"
                        error={
                            errors.tcs_amount
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter TCS collected"
                            {...register(
                                "tcs_amount",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Advance Tax"
                        error={
                            errors.advance_tax
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter advance tax"
                            {...register(
                                "advance_tax",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            {/* House Property */}

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        House Property
                    </h3>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Rental Income"
                        error={
                            errors.rental_income
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "rental_income",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Municipal Tax"
                        error={
                            errors.municipal_tax
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "municipal_tax",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Home Loan Interest"
                        error={
                            errors
                                .home_loan_interest
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "home_loan_interest",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            {/* Business */}

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        Business / Profession
                    </h3>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Business Income"
                        error={
                            errors.business_income
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "business_income",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Business Expenses"
                        error={
                            errors.business_expenses
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "business_expenses",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            {/* Capital Gains */}

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        Capital Gains
                    </h3>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Short Term Capital Gain"
                        error={
                            errors
                                .short_term_capital_gain
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "short_term_capital_gain",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Long Term Capital Gain"
                        error={
                            errors
                                .long_term_capital_gain
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "long_term_capital_gain",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            {/* Other Sources */}

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        Other Sources
                    </h3>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="Interest Income"
                        error={
                            errors.interest_income
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "interest_income",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Dividend Income"
                        error={
                            errors.dividend_income
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "dividend_income",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>

                    <Field
                        label="Other Income"
                        error={
                            errors.other_income
                                ?.message
                        }
                    >
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                                "other_income",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                        />
                    </Field>
                </CardContent>
            </Card>

            {/* Gross Income */}

            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">
                                Gross Total Income
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-blue-700">
                                ₹
                                {grossIncome.toLocaleString(
                                    "en-IN"
                                )}
                            </h2>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
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