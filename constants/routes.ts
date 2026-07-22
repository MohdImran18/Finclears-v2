export const ROUTES = {
  // Public
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  PRICING: "/pricing",
  BLOG: "/blog",
  CONTACT: "/contact",

  // Authentication
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  OTP: "/otp",

  // Dashboard Root
  DASHBOARD: "/dashboard",

  // Dashboard Pages
  DASHBOARD_OVERVIEW: "/dashboard/overview",
  ORDERS: "/dashboard/orders",
  DOCUMENTS: "/dashboard/documents",
  PAYMENTS: "/dashboard/payments",
  NOTIFICATIONS: "/dashboard/notifications",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",

  // Customer
  COMPANY: "/dashboard/company",
  KYC: "/dashboard/kyc",
  INVOICES: "/dashboard/invoices",
  SUPPORT: "/dashboard/support",

  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_COMPANIES: "/admin/companies",
  ADMIN_SERVICES: "/admin/services",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",

  // API
  API: "/api",
} as const;

export type RouteKey = keyof typeof ROUTES;
