"use client";

import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  UsersRound,
} from "lucide-react";

import RoleWorkspaceDashboard from "@/components/dashboard/RoleWorkspaceDashboard";

export default function ManagerDashboardPage() {
  return (
    <RoleWorkspaceDashboard
      eyebrow="Manager workspace"
      title="Team operations"
      description="Track your reporting team, follow up on leads, and manage the operational work assigned to you."
      actions={[
        {
          title: "My team",
          description: "View your reporting structure and employee records you can access.",
          href: "/hrm/employees",
          icon: UsersRound,
          permission: "employees.view",
        },
        {
          title: "Leads",
          description: "Manage lead ownership, follow-ups, and team pipeline work.",
          href: "/crm/leads",
          icon: ClipboardCheck,
          permission: "leads.view",
        },
        {
          title: "Attendance",
          description: "Review attendance records for the team in your scope.",
          href: "/hrm/attendance",
          icon: CalendarDays,
          permission: "attendance.view",
        },
        {
          title: "Leave requests",
          description: "Review leave applications and pending approvals.",
          href: "/hrm/leave",
          icon: CalendarDays,
          permission: "leave.view",
        },
        {
          title: "Reports",
          description: "Open operational reports available to your role.",
          href: "/reports",
          icon: BarChart3,
          permission: "reports.view",
        },
      ]}
    />
  );
}
