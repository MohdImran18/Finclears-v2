"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
        useCompany,
        useUpdateCompany,
} from "@/hooks/useCompanies";

import type {
        Company,
        UpdateCompanyRequest,
} from "@/types/company";

export default function EditCompanyPage() {
        const params = useParams();
        const router = useRouter();

        const id = Number(params.id);

        const { data, isLoading, isError } = useCompany(id);
        const mutation = useUpdateCompany();

        const [form, setForm] = useState<UpdateCompanyRequest>({});

        useEffect(() => {
                const company = data?.data;

                if (!company) return;

                setForm({
                        company_name:
                                company.company_name ?? company.name ?? "",

                        company_type: company.company_type,

                        service_type: company.service_type,

                        business_activity:
                                company.business_activity ?? "",

                        authorized_capital:
                                company.authorized_capital ?? 0,

                        paid_up_capital:
                                company.paid_up_capital ?? 0,

                        state: company.state ?? "",

                        city: company.city ?? "",

                        address: company.address ?? "",

                        pin_code: company.pin_code ?? "",

                        promoters: company.directors ?? [],

                        shareholders: company.shareholders ?? [],
                });
        }, [data]);

        function updateField(
                field: keyof UpdateCompanyRequest,
                value: unknown,
        ) {
                setForm((current) => ({
                        ...current,
                        [field]: value,
                }));
        }

        async function submit(
                event: React.FormEvent<HTMLFormElement>,
        ) {
                event.preventDefault();

                try {
                        await mutation.mutateAsync({
                                id,
                                data: form,
                        });

                        toast.success(
                                "Company updated successfully.",
                        );

                        router.push(
                                `/dashboard/companies/${id}`,
                        );
                } catch (error: any) {
                        console.error(
                                "Company update failed:",
                                error,
                        );

                        toast.error(
                                error?.response?.data?.message ??
                                error?.message ??
                                "Company update failed.",
                        );
                }
        }

        if (isLoading) {
                return (
                        <div className="rounded-xl bg-white p-8">
                                Loading company...
                        </div>
                );
        }

        if (isError || !data?.data) {
                return (
                        <div className="space-y-4">
                                <h1 className="text-2xl font-bold">
                                        Company Not Found
                                </h1>

                                <button
                                        type="button"
                                        onClick={() =>
                                                router.push(
                                                        "/dashboard/companies",
                                                )
                                        }
                                        className="text-blue-600 hover:underline"
                                >
                                        ← Back to Companies
                                </button>
                        </div>
                );
        }

        return (
                <div className="space-y-8">
                        <div>
                                <button
                                        type="button"
                                        onClick={() =>
                                                router.push(
                                                        `/dashboard/companies/${id}`,
                                                )
                                        }
                                        className="text-sm text-blue-600 hover:underline"
                                >
                                        ← Back to Company
                                </button>

                                <h1 className="mt-3 text-3xl font-bold">
                                        Edit Company
                                </h1>

                                <p className="mt-1 text-slate-500">
                                        Update company registration details.
                                </p>
                        </div>

                        <form
                                onSubmit={submit}
                                className="space-y-6"
                        >
                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-6 text-xl font-semibold">
                                                Company Details
                                        </h2>

                                        <div className="grid gap-5 md:grid-cols-2">
                                                <Field
                                                        label="Company Name"
                                                        value={
                                                                form.company_name ??
                                                                ""
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "company_name",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <Field
                                                        label="Business Activity"
                                                        value={
                                                                form.business_activity ??
                                                                ""
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "business_activity",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <NumberField
                                                        label="Authorized Capital"
                                                        value={
                                                                form.authorized_capital ??
                                                                0
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "authorized_capital",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <NumberField
                                                        label="Paid Up Capital"
                                                        value={
                                                                form.paid_up_capital ??
                                                                0
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "paid_up_capital",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <Field
                                                        label="State"
                                                        value={
                                                                form.state ?? ""
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "state",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <Field
                                                        label="City"
                                                        value={
                                                                form.city ?? ""
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "city",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <Field
                                                        label="PIN Code"
                                                        value={
                                                                form.pin_code ?? ""
                                                        }
                                                        onChange={(value) =>
                                                                updateField(
                                                                        "pin_code",
                                                                        value,
                                                                )
                                                        }
                                                />

                                                <div className="md:col-span-2">
                                                        <label className="mb-2 block text-sm font-medium">
                                                                Address
                                                        </label>

                                                        <textarea
                                                                value={
                                                                        form.address ??
                                                                        ""
                                                                }
                                                                onChange={(e) =>
                                                                        updateField(
                                                                                "address",
                                                                                e.target.value,
                                                                        )
                                                                }
                                                                rows={4}
                                                                className="w-full rounded-lg border p-3"
                                                        />
                                                </div>
                                        </div>
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-4 text-xl font-semibold">
                                                Directors
                                        </h2>

                                        {form.promoters?.length ? (
                                                <div className="space-y-3">
                                                        {form.promoters.map(
                                                                (director, index) => (
                                                                        <div
                                                                                key={
                                                                                        director.id ??
                                                                                        index
                                                                                }
                                                                                className="rounded-lg border p-4"
                                                                        >
                                                                                <p className="font-semibold">
                                                                                        {
                                                                                                director.name
                                                                                        }
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        {
                                                                                                director.email
                                                                                        }
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        {
                                                                                                director.phone
                                                                                        }
                                                                                </p>
                                                                        </div>
                                                                ),
                                                        )}
                                                </div>
                                        ) : (
                                                <p className="text-slate-500">
                                                        No directors found.
                                                </p>
                                        )}
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-4 text-xl font-semibold">
                                                Shareholders
                                        </h2>

                                        {form.shareholders?.length ? (
                                                <div className="space-y-3">
                                                        {form.shareholders.map(
                                                                (
                                                                        shareholder,
                                                                        index,
                                                                ) => (
                                                                        <div
                                                                                key={
                                                                                        shareholder.id ??
                                                                                        index
                                                                                }
                                                                                className="rounded-lg border p-4"
                                                                        >
                                                                                <p className="font-semibold">
                                                                                        {
                                                                                                shareholder.name
                                                                                        }
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        PAN:{" "}
                                                                                        {
                                                                                                shareholder.pan
                                                                                        }
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        Shares:{" "}
                                                                                        {
                                                                                                shareholder.shares
                                                                                        }
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        Percentage:{" "}
                                                                                        {
                                                                                                shareholder.percentage
                                                                                        }
                                                                                        %
                                                                                </p>
                                                                        </div>
                                                                ),
                                                        )}
                                                </div>
                                        ) : (
                                                <p className="text-slate-500">
                                                        No shareholders found.
                                                </p>
                                        )}
                                </section>

                                <div className="flex justify-between">
                                        <button
                                                type="button"
                                                onClick={() =>
                                                        router.push(
                                                                `/dashboard/companies/${id}`,
                                                        )
                                                }
                                                className="rounded-lg border px-6 py-3"
                                        >
                                                Cancel
                                        </button>

                                        <button
                                                type="submit"
                                                disabled={mutation.isPending}
                                                className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
                                        >
                                                {mutation.isPending
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                        </button>
                                </div>
                        </form>
                </div>
        );
}

function Field({
        label,
        value,
        onChange,
}: {
        label: string;
        value: string;
        onChange: (value: string) => void;
}) {
        return (
                <div>
                        <label className="mb-2 block text-sm font-medium">
                                {label}
                        </label>

                        <input
                                value={value}
                                onChange={(e) =>
                                        onChange(e.target.value)
                                }
                                className="w-full rounded-lg border p-3"
                        />
                </div>
        );
}

function NumberField({
        label,
        value,
        onChange,
}: {
        label: string;
        value: number;
        onChange: (value: number) => void;
}) {
        return (
                <div>
                        <label className="mb-2 block text-sm font-medium">
                                {label}
                        </label>

                        <input
                                type="number"
                                value={value}
                                onChange={(e) =>
                                        onChange(
                                                Number(e.target.value),
                                        )
                                }
                                className="w-full rounded-lg border p-3"
                        />
                </div>
        );
}
