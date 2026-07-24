import { ROLES } from "./roles";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

/* ==========================================================
 * Customer Navigation
 * ========================================================== */

const CUSTOMER_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "layout-dashboard",
    roles: [ROLES.CLIENT],
  },
  {
    label: "My Companies",
    href: ROUTES.COMPANY,
    icon: "building-2",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Documents",
    href: ROUTES.DOCUMENTS,
    icon: "file-text",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Orders",
    href: ROUTES.ORDERS,
    icon: "shopping-cart",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Payments",
    href: ROUTES.PAYMENTS,
    icon: "credit-card",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Profile",
    href: ROUTES.PROFILE,
    icon: "user",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: "settings",
    roles: [ROLES.CLIENT],
  },
];

/* ==========================================================
 * Admin Navigation
 * ========================================================== */

const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "layout-dashboard",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.ACCOUNTANT,
      ROLES.EMPLOYEE,
    ],
  },

  {
    label: "Companies",
    href: ROUTES.ADMIN_COMPANIES,
    icon: "building-2",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MANAGER,
    ],
  },

  {
    label: "Users",
    href: ROUTES.ADMIN_USERS,
    icon: "users",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    label: "Orders",
    href: ROUTES.ADMIN_ORDERS,
    icon: "shopping-cart",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    label: "Payments",
    href: ROUTES.ADMIN_PAYMENTS,
    icon: "credit-card",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    label: "Documents",
    href: ROUTES.ADMIN_DOCUMENTS,
    icon: "file-text",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    label: "Settings",
    href: ROUTES.ADMIN_SETTINGS,
    icon: "settings",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },
];

export const NAVIGATION: NavigationItem[] = [
  ...CUSTOMER_NAVIGATION,
  ...ADMIN_NAVIGATION,
];