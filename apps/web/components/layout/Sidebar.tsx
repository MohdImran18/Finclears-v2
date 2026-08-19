"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

import { sidebarNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="rounded-xl bg-indigo-600 p-2">
          <Building2 className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Finclears
          </h1>

          <p className="text-xs text-slate-500">
            Business Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {sidebarNavigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
            

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Finclears
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Version 1.0 MVP
          </p>
        </div>
      </div>
    </aside>
  );
}

