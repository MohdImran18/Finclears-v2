"use client";

import { ReactNode } from "react";

import AuthGuard from "./AuthGuard";

import { usePermission } from "@/hooks/usePermission";

import { ROLES } from "@/constants/roles";

interface Props {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: Props) {
  const allowed =
    usePermission([
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
    ]);

  if (!allowed) {
    return null;
  }

  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
