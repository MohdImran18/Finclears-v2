"use client";

import CompanyWizard from "@/components/company/CompanyWizard";

export default function CreateCompanyPage() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">

        New Company Registration

      </h1>

      <CompanyWizard />

    </div>
  );
}
