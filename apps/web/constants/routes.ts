/* ==========================================================
 * Application Routes
 * ========================================================== */

export const ROUTES = {
  /* ==========================================================
   * Public Website
   * ========================================================== */

  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  PRICING: "/pricing",
  BLOG: "/blog",
  CONTACT: "/contact",

  /* ==========================================================
   * Authentication
   * ========================================================== */

  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  OTP: "/auth/otp",

  /* ==========================================================
   * Customer Dashboard
   * ========================================================== */

  DASHBOARD: "/dashboard",
  DASHBOARD_OVERVIEW: "/dashboard/overview",

  COMPANY: "/dashboard/companies",
  COMPANY_CREATE: "/dashboard/companies/create",

  DOCUMENTS: "/dashboard/documents",
  DOCUMENT_UPLOAD: "/dashboard/documents/upload",

  ORDERS: "/dashboard/orders",
  PAYMENTS: "/dashboard/payments",
  NOTIFICATIONS: "/dashboard/notifications",

  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",

  KYC: "/dashboard/kyc",
  INVOICES: "/dashboard/invoices",
  SUPPORT: "/dashboard/support",

  /* ==========================================================
   * Admin Dashboard
   * ========================================================== */

  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",

  ADMIN_USERS: "/admin/users",
  ADMIN_USER_CREATE: "/admin/users/create",

  ADMIN_COMPANIES: "/admin/companies",
  ADMIN_COMPANY_CREATE: "/admin/companies/create",

  ADMIN_DOCUMENTS: "/admin/documents",

  ADMIN_ORDERS: "/admin/orders",

  ADMIN_PAYMENTS: "/admin/payments",

  ADMIN_SERVICES: "/admin/services",

  ADMIN_REPORTS: "/admin/reports",

  ADMIN_SETTINGS: "/admin/settings",

  /* ==========================================================
   * API
   * ========================================================== */

  API: "/api",
} as const;

export type RouteKey = keyof typeof ROUTES;