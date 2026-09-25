"use client";

import {
  CalendarDays,
  FileText,
  UsersRound,
  WalletCards,
} from "lucide-react";

import RoleWorkspaceDashboard from "@/components/dashboard/RoleWorkspaceDashboard";

export default function HrmDashboardPage() {
  return (
    <RoleWorkspaceDashboard
      eyebrow="HRM workspace"
      title="People operations"
      description="Manage employee records, workforce attendance, leave operations, and HR documentation."
      actions={[
        {
          title: "Employees",
          description: "View and manage employee records and reporting structure.",
          href: "/hrm/employees",
          icon: UsersRound,
          permission: "employees.view",
        },
        {
          title: "Attendance",
          description: "Review attendance and resolve daily workforce records.",
          href: "/hrm/attendance",
          icon: CalendarDays,
          permission: "attendance.view",
        },
        {
          title: "Leave management",
          description: "Review leave applications, balances, and approvals.",
          href: "/hrm/leave",
          icon: CalendarDays,
          permission: "leave.view",
        },
        {
          title: "Employee letters",
          description: "Create and issue employee letters and documents.",
          href: "/hrm/letters",
          icon: FileText,
          permission: "letters.view",
        },
        {
          title: "Payroll",
          description: "Manage salary structures and payroll runs.",
          href: "/hrm/payroll",
          icon: WalletCards,
          permission: "payroll.view",
        },
      ]}
    />
  );
}
