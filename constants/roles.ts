export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  ACCOUNTANT: "accountant",
  EMPLOYEE: "employee",
  CLIENT: "client",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];
