import { ROLES } from "./roles";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

/* ==========================================================
 * Customer Portal
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
    href: "/companies",
    icon: "building-2",
    roles: [ROLES.CLIENT],
  },

  {
    label: "Documents",
    href: "/documents",
    icon: "file-text",
    roles: [ROLES.CLIENT],
  },

  {
    label: "Orders",
    href: "/orders",
    icon: "shopping-cart",
    roles: [ROLES.CLIENT],
  },

  {
    label: "Payments",
    href: "/payments",
    icon: "credit-card",
    roles: [ROLES.CLIENT],
  },

  {
    label: "Profile",
    href: "/profile",
    icon: "user",
    roles: [ROLES.CLIENT],
  },

  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
    roles: [ROLES.CLIENT],
  },

];

/* ==========================================================
 * Admin Portal
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
    href: "/admin/companies",
    icon: "building-2",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MANAGER,
    ],
  },

  {
    label: "Users",
    href: "/admin/users",
    icon: "users",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    label: "Orders",
    href: "/admin/orders",
    icon: "shopping-cart",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    label: "Documents",
    href: "/admin/documents",
    icon: "file-text",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: "settings",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
    ],
  },

];

export const NAVIGATION = [
  ...CUSTOMER_NAVIGATION,
  ...ADMIN_NAVIGATION,
];