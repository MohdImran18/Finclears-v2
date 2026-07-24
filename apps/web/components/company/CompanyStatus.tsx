"use client";

import type { CompanyStatus as CompanyStatusType } from "@/types/company";

interface Props {
  status?: CompanyStatusType;
}

export default function CompanyStatus({
  status = "draft",
}: Props) {
  const styles: Record<CompanyStatusType, string> = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-blue-100 text-blue-700",
    under_review: "bg-indigo-100 text-indigo-700",
    documents_pending: "bg-yellow-100 text-yellow-700",
    payment_pending: "bg-orange-100 text-orange-700",
    processing: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
