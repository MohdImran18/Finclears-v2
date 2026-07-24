"use client";

import Link from "next/link";

import CompanyStatus from "./CompanyStatus";

import type {
  Company,
  CompanyStatus as CompanyStatusType,
} from "@/types/company";

interface Props {
  companies: Company[];
  loading: boolean;
}

export default function CompanyTable({
  companies,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="px-5 py-4 text-left">
              Company
            </th>

            <th className="px-5 py-4">
              Type
            </th>

            <th className="px-5 py-4">
              State
            </th>

            <th className="px-5 py-4">
              Status
            </th>

            <th className="px-5 py-4">
              Action
            </th>
          </tr>
        </thead>

        <tbody>

          {companies.map((company) => (

            <tr
              key={company.id}
              className="border-t"
            >

              <td className="px-5 py-4">
                {company.company_name ?? company.name}
              </td>

              <td className="px-5 py-4">
                {company.company_type ?? "-"}
              </td>

              <td className="px-5 py-4">
                {company.state ?? "-"}
              </td>

              <td className="px-5 py-4">
                <CompanyStatus
                  status={
                    (company.status ??
                      "draft") as CompanyStatusType
                  }
                />
              </td>

              <td className="px-5 py-4">

                <Link
                  href={`/dashboard/companies/edit/${company.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
