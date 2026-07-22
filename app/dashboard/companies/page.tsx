"use client";

import Link from "next/link";

import { useCompanies } from "@/hooks/useCompanies";

import CompanyTable from "@/components/company/CompanyTable";

export default function CompaniesPage() {
  const {
    data,
    isLoading,
  } = useCompanies();

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          Company Registrations
        </h1>

        <Link
          href="/dashboard/companies/create"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          + New Registration
        </Link>

      </div>

      <CompanyTable
        companies={data?.data ?? []}
        loading={isLoading}
      />

    </div>
  );
}
