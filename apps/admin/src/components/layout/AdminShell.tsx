"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import EmployeePresenceProvider from "@/components/monitoring/EmployeePresenceProvider";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <EmployeePresenceProvider />

      <div className="adminShell">
        <AdminSidebar />

        <div className="adminMain">
          <AdminHeader />

          <main className="adminContent">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}