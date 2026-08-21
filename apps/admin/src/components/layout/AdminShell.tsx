"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="adminShell">
      <AdminSidebar />

      <div className="adminMain">
        <AdminHeader />

        <main className="adminContent">
          {children}
        </main>
      </div>
    </div>
  );
}
