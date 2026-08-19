"use client";

import Link from "next/link";
import {
        Building2,
        CheckCircle2,
        Clock3,
        FileText,
        ArrowRight,
        Plus,
        CreditCard,
        CircleAlert,
} from "lucide-react";

import { useCompanies } from "@/hooks/useCompanies";

function getCompanyName(company: any) {
        return company.company_name || company.name || "Untitled Company";
}

function getServiceName(service?: string) {
        switch (service) {
                case "private_limited":
                        return "Private Limited Company";
                case "llp":
                        return "Limited Liability Partnership";
                case "opc":
                        return "One Person Company";
                case "section8":
                        return "Section 8 Company";
                case "foreign_company":
                        return "Foreign Company";
                default:
                        return "Company Registration";
        }
}

function getStatusLabel(status?: string) {
        switch (status) {
                case "draft":
                        return "Draft";
                case "submitted":
                        return "Submitted";
                case "under_review":
                        return "Under Review";
                case "documents_pending":
                        return "Documents Pending";
                case "payment_pending":
                        return "Payment Pending";
                case "processing":
                        return "Processing";
                case "approved":
                        return "Approved";
                case "completed":
                        return "Completed";
                case "rejected":
                        return "Rejected";
                case "pending":
                        return "Pending";
                default:
                        return "In Progress";
        }
}

function getStatusClasses(status?: string) {
        switch (status) {
                case "completed":
                case "approved":
                        return "bg-green-50 text-green-700 border-green-200";

                case "rejected":
                        return "bg-red-50 text-red-700 border-red-200";

                case "payment_pending":
                case "documents_pending":
                case "pending":
                        return "bg-amber-50 text-amber-700 border-amber-200";

                default:
                        return "bg-blue-50 text-blue-700 border-blue-200";
        }
}

function getProgress(company: any) {
        const status = company.status;

        if (status === "completed" || status === "approved") return 100;
        if (status === "processing") return 80;
        if (status === "under_review") return 80;
        if (status === "documents_pending") return 60;
        if (status === "payment_pending") return 50;
        if (status === "submitted") return 70;
        if (status === "pending") return 40;
        if (status === "draft") return 20;

        return 30;
}

export default function DashboardPage() {
        const { data, isLoading, isError } = useCompanies({
                per_page: 100,
        });

        const companies = data?.data ?? [];

        const totalCompanies = companies.length;

        const completedCompanies = companies.filter(
                (company: any) =>
                        company.status === "completed" ||
                        company.status === "approved",
        ).length;

        const pendingCompanies = companies.filter(
                (company: any) =>
                        company.status === "payment_pending" ||
                        company.status === "documents_pending" ||
                        company.status === "pending" ||
                        company.status === "under_review" ||
                        company.status === "processing",
        ).length;

        const paymentPending = companies.filter(
                (company: any) => company.payment_status === "pending",
        ).length;

        const recentCompanies = [...companies].slice(0, 5);

        return (
                <div className="mx-auto max-w-7xl space-y-8">

                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                        <p className="text-sm font-medium text-blue-600">
                                                Customer Dashboard
                                        </p>

                                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                                                Welcome back 👋
                                        </h1>

                                        <p className="mt-2 text-sm text-slate-500">
                                                Manage your company registrations, documents and payments from one place.
                                        </p>
                                </div>

                                <Link
                                        href="/dashboard/companies/create"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                        <Plus className="h-4 w-4" />
                                        Register New Company
                                </Link>
                        </div>

                        {/* Error */}
                        {isError && (
                                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        <CircleAlert className="h-5 w-5" />
                                        Unable to load your company registrations.
                                </div>
                        )}

                        {/* Stats */}
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <p className="text-sm font-medium text-slate-500">
                                                                Total Companies
                                                        </p>

                                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                                                {isLoading ? "—" : totalCompanies}
                                                        </p>
                                                </div>

                                                <div className="rounded-xl bg-blue-50 p-3">
                                                        <Building2 className="h-6 w-6 text-blue-600" />
                                                </div>
                                        </div>

                                        <p className="mt-4 text-xs text-slate-400">
                                                All your registrations
                                        </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <p className="text-sm font-medium text-slate-500">
                                                                In Progress
                                                        </p>

                                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                                                {isLoading ? "—" : pendingCompanies}
                                                        </p>
                                                </div>

                                                <div className="rounded-xl bg-amber-50 p-3">
                                                        <Clock3 className="h-6 w-6 text-amber-600" />
                                                </div>
                                        </div>

                                        <p className="mt-4 text-xs text-slate-400">
                                                Applications requiring attention
                                        </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <p className="text-sm font-medium text-slate-500">
                                                                Completed
                                                        </p>

                                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                                                {isLoading ? "—" : completedCompanies}
                                                        </p>
                                                </div>

                                                <div className="rounded-xl bg-green-50 p-3">
                                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                </div>
                                        </div>

                                        <p className="mt-4 text-xs text-slate-400">
                                                Successfully completed
                                        </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <p className="text-sm font-medium text-slate-500">
                                                                Payment Pending
                                                        </p>

                                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                                                {isLoading ? "—" : paymentPending}
                                                        </p>
                                                </div>

                                                <div className="rounded-xl bg-purple-50 p-3">
                                                        <CreditCard className="h-6 w-6 text-purple-600" />
                                                </div>
                                        </div>

                                        <p className="mt-4 text-xs text-slate-400">
                                                Payments awaiting completion
                                        </p>
                                </div>
                        </div>

                        {/* Main content */}
                        <div className="grid gap-6 lg:grid-cols-3">

                                {/* Companies */}
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

                                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                                <div>
                                                        <h2 className="text-lg font-bold text-slate-900">
                                                                My Company Applications
                                                        </h2>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                                Track your latest registrations
                                                        </p>
                                                </div>

                                                <Link
                                                        href="/dashboard/companies"
                                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                                >
                                                        View All
                                                </Link>
                                        </div>

                                        <div className="divide-y divide-slate-100">

                                                {isLoading && (
                                                        <div className="p-8 text-center text-sm text-slate-500">
                                                                Loading your companies...
                                                        </div>
                                                )}

                                                {!isLoading && recentCompanies.length === 0 && (
                                                        <div className="p-10 text-center">
                                                                <Building2 className="mx-auto h-10 w-10 text-slate-300" />

                                                                <h3 className="mt-4 font-semibold text-slate-900">
                                                                        No company registrations yet
                                                                </h3>

                                                                <p className="mt-1 text-sm text-slate-500">
                                                                        Start your first company registration today.
                                                                </p>

                                                                <Link
                                                                        href="/dashboard/companies/create"
                                                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                                >
                                                                        <Plus className="h-4 w-4" />
                                                                        Register Company
                                                                </Link>
                                                        </div>
                                                )}

                                                {recentCompanies.map((company: any) => {
                                                        const progress = getProgress(company);
                                                        const status = company.status;

                                                        return (
                                                                <div
                                                                        key={company.id}
                                                                        className="p-6 transition hover:bg-slate-50"
                                                                >
                                                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                                                                <div className="min-w-0 flex-1">

                                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                                                <h3 className="truncate text-base font-bold text-slate-900">
                                                                                                        {getCompanyName(company)}
                                                                                                </h3>

                                                                                                <span
                                                                                                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
                                                                                                >
                                                                                                        {getStatusLabel(status)}
                                                                                                </span>
                                                                                        </div>

                                                                                        <p className="mt-1 text-sm text-slate-500">
                                                                                                {getServiceName(company.service_type)}
                                                                                        </p>

                                                                                        <div className="mt-5">
                                                                                                <div className="mb-2 flex items-center justify-between text-xs">
                                                                                                        <span className="font-medium text-slate-500">
                                                                                                                Registration Progress
                                                                                                        </span>

                                                                                                        <span className="font-bold text-slate-700">
                                                                                                                {progress}%
                                                                                                        </span>
                                                                                                </div>

                                                                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                                                                        <div
                                                                                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                                                                                style={{
                                                                                                                        width: `${progress}%`,
                                                                                                                }}
                                                                                                        />
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                <Link
                                                                                        href={`/dashboard/companies/${company.id}`}
                                                                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-blue-600"
                                                                                >
                                                                                        View
                                                                                        <ArrowRight className="h-4 w-4" />
                                                                                </Link>
                                                                        </div>
                                                                </div>
                                                        );
                                                })}
                                        </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                        <div className="border-b border-slate-100 p-6">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                        Quick Actions
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                        Frequently used actions
                                                </p>
                                        </div>

                                        <div className="space-y-3 p-6">

                                                <Link
                                                        href="/dashboard/companies/create"
                                                        className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                        <div className="rounded-lg bg-blue-100 p-2.5">
                                                                <Plus className="h-5 w-5 text-blue-600" />
                                                        </div>

                                                        <div className="flex-1">
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                        Register Company
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                        Start a new application
                                                                </p>
                                                        </div>

                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                                </Link>

                                                <Link
                                                        href="/dashboard/companies"
                                                        className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                        <div className="rounded-lg bg-indigo-100 p-2.5">
                                                                <Building2 className="h-5 w-5 text-indigo-600" />
                                                        </div>

                                                        <div className="flex-1">
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                        My Companies
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                        Manage registrations
                                                                </p>
                                                        </div>

                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                                </Link>

                                                <Link
                                                        href="/dashboard/documents"
                                                        className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                        <div className="rounded-lg bg-emerald-100 p-2.5">
                                                                <FileText className="h-5 w-5 text-emerald-600" />
                                                        </div>

                                                        <div className="flex-1">
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                        Documents
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                        Upload and manage documents
                                                                </p>
                                                        </div>

                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                                </Link>

                                                <Link
                                                        href="/dashboard/payments"
                                                        className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                        <div className="rounded-lg bg-purple-100 p-2.5">
                                                                <CreditCard className="h-5 w-5 text-purple-600" />
                                                        </div>

                                                        <div className="flex-1">
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                        Payments
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                        View payment history
                                                                </p>
                                                        </div>

                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                                </Link>

                                        </div>
                                </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-7 text-white shadow-sm">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                                <h2 className="text-xl font-bold">
                                                        Need to register another company?
                                                </h2>

                                                <p className="mt-1 text-sm text-blue-100">
                                                        Start your registration and complete everything online.
                                                </p>
                                        </div>

                                        <Link
                                                href="/dashboard/companies/create"
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                                        >
                                                Start Registration
                                                <ArrowRight className="h-4 w-4" />
                                        </Link>
                                </div>
                        </div>

                </div>
        );
}
