"use client";

import {
  CalendarDays,
  FileText,
  UserRound,
  WalletCards,
} from "lucide-react";

import RoleWorkspaceDashboard from "@/components/dashboard/RoleWorkspaceDashboard";

export default function EmployeeDashboardPage() {
  return (
    <RoleWorkspaceDashboard
      eyebrow="Employee workspace"
      title="My workspace"
      description="Access your employee profile, attendance, leave, payslip, and company documents in one place."
      actions={[
        {
          title: "My profile",
          description: "View your employment details, documents, and personal information.",
          href: "/hrm/employees",
          icon: UserRound,
          permission: "employees.view",
          useEmployeeProfile: true,
        },
        {
          title: "My attendance",
          description: "Review your attendance and record today’s work status.",
          href: "/hrm/attendance",
          icon: CalendarDays,
          permission: "attendance.view",
        },
        {
          title: "My leave",
          description: "Apply for leave and review your leave balance and history.",
          href: "/hrm/leave",
          icon: CalendarDays,
          permission: "leave.view",
        },
        {
          title: "My payroll",
          description: "Review available payroll records and salary information.",
          href: "/hrm/payroll",
          icon: WalletCards,
          permission: "payroll.view",
        },
        {
          title: "My letters",
          description: "View and download employee letters issued to you.",
          href: "/hrm/letters",
          icon: FileText,
          permission: "letters.view",
        },
      ]}
    />
  );
}
