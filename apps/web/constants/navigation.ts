import {
  LayoutDashboard,
  Building2,
  FileText,
  ShoppingCart,
  CreditCard,
  Bell,
  User,
  Settings,
  Users,
  BarChart3,
  LineChart,
} from "lucide-react";

import { ROLES } from "./roles";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
  group?: string;
}

/* ==========================================================
 * Customer Navigation
 * ========================================================== */

export const CUSTOMER_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    group: "General",
    roles: [ROLES.CLIENT],
  },
  {
    label: "My Companies",
    href: ROUTES.COMPANY,
    icon: Building2,
    group: "Business",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Documents",
    href: ROUTES.DOCUMENTS,
    icon: FileText,
    group: "Business",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Orders",
    href: ROUTES.ORDERS,
    icon: ShoppingCart,
    group: "Business",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Payments",
    href: ROUTES.PAYMENTS,
    icon: CreditCard,
    group: "Business",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
    group: "General",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Profile",
    href: ROUTES.PROFILE,
    icon: User,
    group: "Account",
    roles: [ROLES.CLIENT],
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
    group: "Account",
    roles: [ROLES.CLIENT],
  },
];

/* ==========================================================
 * Admin Navigation
 * ========================================================== */

export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    group: "General",
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
    icon: Building2,
    group: "Management",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Users",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    group: "Management",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "Orders",
    href: ROUTES.ADMIN_ORDERS,
    icon: ShoppingCart,
    group: "Operations",
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
    icon: CreditCard,
    group: "Operations",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.ACCOUNTANT,
    ],
  },
  {
    label: "Documents",
    href: ROUTES.ADMIN_DOCUMENTS,
    icon: FileText,
    group: "Operations",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  
  {
    label: "Reports",
    href: ROUTES.ADMIN_REPORTS,
    icon: BarChart3,
    group: "Analytics",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "Settings",
    href: ROUTES.ADMIN_SETTINGS,
    icon: Settings,
    group: "System",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
];

/* ==========================================================
 * Combined Navigation
 * ========================================================== */

export const NAVIGATION = [
  ...CUSTOMER_NAVIGATION,
  ...ADMIN_NAVIGATION,
];

export const sidebarNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: FileText,
  },
];

