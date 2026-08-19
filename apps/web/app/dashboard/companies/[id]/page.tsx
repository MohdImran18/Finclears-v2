"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useCompany } from "@/hooks/useCompanies";

export default function CompanyDetailPage() {
        const params = useParams();

        const id = Number(params.id);

        const { data, isLoading, isError } = useCompany(id);

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

                                <Link
                                        href="/dashboard/companies"
                                        className="text-blue-600 hover:underline"
                                >
                                        Ã¢â€ Â Back to Companies
                                </Link>
                        </div>
                );
        }

        const company = data.data;

        return (
                <div className="space-y-8">
                        <div className="flex items-center justify-between">
                                <div>
                                        <Link
                                                href="/dashboard/companies"
                                                className="text-sm text-blue-600 hover:underline"
                                        >
                                                Ã¢â€ Â Back to Companies
                                        </Link>

                                        <h1 className="mt-2 text-3xl font-bold">
                                                {company.company_name ?? company.name}
                                        </h1>
                                </div>

                                <Link
                                        href={`/dashboard/companies/edit/${company.id}`}
                                        className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                                >
                                        Edit Company
                                </Link>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Company Details
                                        </h2>

                                        <div className="space-y-4">
                                                <Detail
                                                        label="Company Name"
                                                        value={company.company_name}
                                                />

                                                <Detail
                                                        label="Company Type"
                                                        value={company.company_type}
                                                />

                                                <Detail
                                                        label="Service Type"
                                                        value={company.service_type}
                                                />

                                                <Detail
                                                        label="Business Activity"
                                                        value={company.business_activity}
                                                />

                                                <Detail
                                                        label="Authorized Capital"
                                                        value={company.authorized_capital}
                                                />

                                                <Detail
                                                        label="Paid Up Capital"
                                                        value={company.paid_up_capital}
                                                />
                                        </div>
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Contact & Address
                                        </h2>

                                        <div className="space-y-4">
                                                <Detail
                                                        label="Email"
                                                        value={company.email}
                                                />

                                                <Detail
                                                        label="Phone"
                                                        value={company.phone}
                                                />

                                                <Detail
                                                        label="State"
                                                        value={company.state}
                                                />

                                                <Detail
                                                        label="City"
                                                        value={company.city}
                                                />

                                                <Detail
                                                        label="Address"
                                                        value={company.address}
                                                />

                                                <Detail
                                                        label="PIN Code"
                                                        value={company.pin_code}
                                                />
                                        </div>
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Registration Status
                                        </h2>

                                        <div className="space-y-4">
                                                <Detail
                                                        label="Status"
                                                        value={company.status}
                                                />

                                                <Detail
                                                        label="Payment Status"
                                                        value={company.payment_status}
                                                />

                                                <Detail
                                                        label="CIN"
                                                        value={company.cin}
                                                />

                                                <Detail
                                                        label="LLPIN"
                                                        value={company.llpin}
                                                />

                                                <Detail
                                                        label="PAN"
                                                        value={company.pan_number}
                                                />

                                                <Detail
                                                        label="TAN"
                                                        value={company.tan_number}
                                                />

                                                <Detail
                                                        label="GST"
                                                        value={company.gst_number}
                                                />
                                        </div>
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Directors
                                        </h2>

                                        {company.directors?.length ? (
                                                <div className="space-y-4">
                                                        {company.directors.map((director) => (
                                                                <div
                                                                        key={director.id}
                                                                        className="rounded-lg border p-4"
                                                                >
                                                                        <p className="font-semibold">
                                                                                {director.name}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                {director.email ?? "-"}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                {director.phone ?? "-"}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                DIN: {director.din ?? "-"}
                                                                        </p>
                                                                </div>
                                                        ))}
                                                </div>
                                        ) : (
                                                <p className="text-slate-500">
                                                        No directors added.
                                                </p>
                                        )}
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Shareholders
                                        </h2>

                                        {company.shareholders?.length ? (
                                                <div className="space-y-4">
                                                        {company.shareholders.map((shareholder) => (
                                                                <div
                                                                        key={shareholder.id}
                                                                        className="rounded-lg border p-4"
                                                                >
                                                                        <p className="font-semibold">
                                                                                {shareholder.name}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                {shareholder.email ?? "-"}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                PAN: {shareholder.pan ?? "-"}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                Shares: {shareholder.shares ?? 0}
                                                                        </p>

                                                                        <p className="text-sm text-slate-600">
                                                                                Percentage: {shareholder.percentage ?? 0}%
                                                                        </p>
                                                                </div>
                                                        ))}
                                                </div>
                                        ) : (
                                                <p className="text-slate-500">
                                                        No shareholders added.
                                                </p>
                                        )}
                                </section>

                                <section className="rounded-xl bg-white p-6 shadow">
                                        <h2 className="mb-5 text-xl font-semibold">
                                                Documents
                                        </h2>

                                        {company.documents?.length ? (
                                                <div className="space-y-3">
                                                        {company.documents.map((document) => (
                                                                <div
                                                                        key={document.id}
                                                                        className="rounded-lg border p-4"
                                                                >
                                                                        <p className="font-medium">
                                                                                {document.type}
                                                                        </p>

                                                                        <p className="text-sm text-slate-500">
                                                                                Status: {document.status}
                                                                        </p>
                                                                </div>
                                                        ))}
                                                </div>
                                        ) : (
                                                <p className="text-slate-500">
                                                        No documents uploaded.
                                                </p>
                                        )}
                                </section>
                        </div>
                </div>
        );
}

function Detail({
        label,
        value,
}: {
        label: string;
        value: unknown;
}) {
        return (
                <div>
                        <p className="text-sm text-slate-500">{label}</p>

                        <p className="font-medium">
                                {value === null || value === undefined || value === ""
                                        ? "-"
                                        : String(value)}
                        </p>
                </div>
        );
}
