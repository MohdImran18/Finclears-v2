import { ROLES } from "@/constants/roles";

export const PERMISSIONS = {
  dashboard: [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.EMPLOYEE,
    ROLES.CLIENT,
  ],

  users: [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ],

  companies: [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.EMPLOYEE,
  ],

  documents: [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.EMPLOYEE,
    ROLES.CLIENT,
  ],

  payments: [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ],

  settings: [
    ROLES.SUPER_ADMIN,
  ],
} as const;