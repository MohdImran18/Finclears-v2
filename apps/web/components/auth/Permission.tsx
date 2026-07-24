"use client";

import { ReactNode } from "react";

import { usePermission } from "@/hooks/usePermission";

interface Props {
  allow: readonly string[];
  children: ReactNode;
}

export default function Permission({
  allow,
  children,
}: Props) {
  const allowed =
    usePermission(allow);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
