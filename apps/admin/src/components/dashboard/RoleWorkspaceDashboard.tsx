"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { useAuth } from "@/lib/auth/AuthProvider";
import { hasPermission } from "@/lib/auth/permissions";

export interface WorkspaceAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  useEmployeeProfile?: boolean;
}

interface RoleWorkspaceDashboardProps {
  eyebrow: string;
  title: string;
  description: string;
  actions: WorkspaceAction[];
}

export default function RoleWorkspaceDashboard({
  eyebrow,
  title,
  description,
  actions,
}: RoleWorkspaceDashboardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-full bg-slate-50 p-6 md:p-8">
        <p className="text-sm font-medium text-slate-500">
          Loading workspace...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-full bg-slate-50 p-6 md:p-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Your session is unavailable. Please sign in again.
        </div>
      </main>
    );
  }

  const visibleActions = actions.filter(
    (action) =>
      !action.permission || hasPermission(user, action.permission)
  );

  return (
    <main className="min-h-full bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl bg-gradient-to-br from-[#075f5a] to-[#087f78] px-6 py-8 text-white shadow-sm md:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
            <LayoutDashboard size={15} />
            {eyebrow}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
            {description}
          </p>

          <p className="mt-5 text-sm font-semibold text-white">
            Welcome back, {user.name}.
          </p>
        </header>

        <section className="mt-7">
          <h2 className="text-lg font-bold text-slate-900">
            Your workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Access the tasks assigned to your role.
          </p>

          {visibleActions.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleActions.map((action) => {
                const Icon = action.icon;
                const href =
                  action.useEmployeeProfile && user.employee_profile?.id
                    ? `/hrm/employees/${user.employee_profile.id}`
                    : action.href;

                return (
                  <Link
                    key={action.title}
                    href={href}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#70b8b2] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-xl bg-emerald-50 p-3 text-[#087f78]">
                        <Icon size={21} />
                      </span>

                      <ArrowRight
                        size={19}
                        className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#087f78]"
                      />
                    </div>

                    <h3 className="mt-5 font-bold text-slate-900">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
              No workspace actions are available for this account.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
