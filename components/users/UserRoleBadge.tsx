"use client";

import type { UserRole } from "@/types/user";

interface Props {
  role: UserRole;
}

const styles: Record<UserRole, string> = {
  admin:
    "bg-blue-100 text-blue-700",

  employee:
    "bg-purple-100 text-purple-700",

  client:
    "bg-green-100 text-green-700",

  "super-admin": "bg-red-100 text-red-700",
  manager: "bg-yellow-100 text-yellow-700",
  accountant: "bg-purple-100 text-purple-700",
};

const labels: Record<UserRole, string> = {
  admin: "Admin",

  employee: "Employee",

  client: "Client",

  "super-admin": "Super Admin",
  manager: "Manager",
  accountant: "Accountant",
};

export default function UserRoleBadge({
  role,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[role]}`}
    >
      {labels[role]}
    </span>
  );
}

