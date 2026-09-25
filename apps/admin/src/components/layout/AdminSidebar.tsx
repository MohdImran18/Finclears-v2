"use client";

import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  FileText,
  ShoppingCart,
  CreditCard,
  Headphones,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  UserRound,
  Network,
  CalendarDays,
  WalletCards,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/AuthProvider";
import { hasPermission } from "@/lib/auth/permissions";
import { getWorkspaceRoute } from "@/lib/auth/workspaceRoute";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  permission?: string;
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <aside className="adminSidebar">
        <div className="sidebarBrand">
          <div className="brandMark">F</div>

          <div>
            <div className="brandName">Finclears</div>
            <div className="brandLabel">WORKSPACE</div>
          </div>
        </div>
      </aside>
    );
  }

  const isAdmin =
    user?.role === "admin" ||
    user?.spatie_roles?.includes("admin") ||
    user?.spatie_roles?.includes("super-admin");

  const isHrWorkspace =
    user?.spatie_roles?.includes("hr-manager") ||
    user?.spatie_roles?.includes("hr-executive");
  const isManagerWorkspace =
    user?.spatie_roles?.includes("department-manager") ||
    user?.spatie_roles?.includes("team-lead");
  const workspaceLabel = isAdmin
    ? "ADMIN PANEL"
    : isHrWorkspace
      ? "HR WORKSPACE"
      : isManagerWorkspace
        ? "MANAGER WORKSPACE"
        : "EMPLOYEE WORKSPACE";

  const workspaceItems: NavItem[] = [
    {
      label: "Dashboard",
      href: user ? getWorkspaceRoute(user) : "/",
      icon: LayoutDashboard,
    },
    {
      label: "Leads",
      href: "/crm/leads",
      icon: Users,
      permission: "leads.view",
    },
    {
      label: "Customers",
      href: "/crm/customers",
      icon: Users,
      permission: "customers.view",
    },
  ];

  const operationItems: NavItem[] = [
    {
      label: "Services",
      href: "/services",
      icon: BriefcaseBusiness,
      permission: "services.view",
    },
    {
      label: "Blogs",
      href: "/blogs",
      icon: FileText,
      permission: "blogs.view",
    },
    {
      label: "Orders",
      href: "/crm/orders",
      icon: ShoppingCart,
      permission: "orders.view",
    },
    {
      label: "Payments",
      href: "/crm/payments",
      icon: CreditCard,
      permission: "payments.view",
    },
    {
      label: "Support",
      href: "/support",
      icon: Headphones,
      permission: "support.view",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: BarChart3,
      permission: "reports.view",
    },
  ];

  const hrmItems: NavItem[] = [
    {
      label: "Employees",
      href: "/hrm/employees",
      icon: UserRound,
      permission: "employees.view",
    },
    {
      label: "Departments",
      href: "/hrm/departments",
      icon: Building2,
      permission: "departments.view",
    },
    {
      label: "Designations",
      href: "/hrm/designations",
      icon: Network,
      permission: "designations.view",
    },
    {
      label: "Leave",
      href: "/hrm/leave",
      icon: CalendarDays,
      permission: "leave.view",
    },
    {
      label: "Attendance",
      href: "/hrm/attendance",
      icon: CalendarDays,
      permission: "attendance.view",
    },
    {
      label: "Payroll",
      href: "/hrm/payroll",
      icon: WalletCards,
      permission: "payroll.view",
    },
    {
      label: "Letters",
      href: "/hrm/letters",
      icon: FileText,
      permission: "letters.view",
    },
  ];

  const visibleWorkspaceItems = workspaceItems.filter(
    (item) =>
      !item.permission ||
      hasPermission(user, item.permission)
  );

  const visibleOperationItems = operationItems.filter(
    (item) =>
      !item.permission ||
      hasPermission(user, item.permission)
  );

  const visibleHrmItems = hrmItems.filter(
    (item) =>
      !item.permission ||
      hasPermission(user, item.permission)
  );

  const isHrmActive = pathname.startsWith("/hrm");

  function navigate(href: string) {
    router.push(href);
  }

  function renderItem(item: NavItem, sub = false) {
    const Icon = item.icon;

    const active =
      pathname === item.href ||
      (item.href !== "/" &&
        pathname.startsWith(item.href));

    return (
      <button
        key={item.label}
        type="button"
        className={`navItem ${
          sub ? "navSubItem" : ""
        } ${active ? "active" : ""}`}
        onClick={() => navigate(item.href)}
      >
        <Icon size={sub ? 15 : 17} />
        <span>{item.label}</span>
      </button>
    );
  }

  return (
    <aside className="adminSidebar">
      <div className="sidebarBrand">
        <div className="brandMark">F</div>

        <div>
          <div className="brandName">Finclears</div>
          <div className="brandLabel">
            {workspaceLabel}
          </div>
        </div>
      </div>

      <nav className="sidebarNav">

        <div className="navSectionLabel">
          WORKSPACE
        </div>

        {visibleWorkspaceItems.map((item) =>
          renderItem(item)
        )}

        {visibleHrmItems.length > 0 && (
          <>
            <div className="navSectionLabel secondary">
              HRM
            </div>

            <div className="hrmSubNav">
              {visibleHrmItems.map((item) =>
                renderItem(item, true)
              )}
            </div>
          </>
        )}

        {visibleOperationItems.length > 0 && (
          <>
            <div className="navSectionLabel secondary">
              OPERATIONS
            </div>

            {visibleOperationItems.map((item) =>
              renderItem(item)
            )}
          </>
        )}

        {isAdmin && (
          <>
            <div className="navSectionLabel secondary">
              ADMINISTRATION
            </div>

            <button
              type="button"
              className={`navItem ${
                pathname.startsWith("/users")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/users")}
            >
              <ShieldCheck size={17} />
              <span>Users & Roles</span>
            </button>

            <button
              type="button"
              className={`navItem ${
                pathname.startsWith("/settings")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/settings")}
            >
              <Settings size={17} />
              <span>Settings</span>
            </button>
          </>
        )}

      </nav>

      <div className="sidebarFooter">
        <div className="securityIcon">
          <ShieldCheck size={16} />
        </div>

        <div>
          <strong>
            {isAdmin ? "Admin Access" : "Employee Access"}
          </strong>
          <span>
            {user?.name || "Current User"}
          </span>
        </div>
      </div>
    </aside>
  );
}
