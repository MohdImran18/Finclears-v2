/**
 * ============================================================
 * FinClears V2
 * API Endpoints
 * ============================================================
 */

const V1 = "/v1";

export const API = {
  /* =========================================
   * Authentication
   * ======================================= */

  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  USER: "/me",
  REFRESH_TOKEN: "/refresh-token",

  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  VERIFY_EMAIL: "/verify-email",


  /* =========================================
   * Dashboard
   * ======================================= */

  DASHBOARD: "/dashboard",
  DASHBOARD_STATS: "/dashboard/stats",
  DASHBOARD_ACTIVITY: "/dashboard/activity",

  /* =========================================
   * Orders
   * ======================================= */

  ORDERS: "/orders",
  ORDER_DETAILS: "/orders",
  ORDER_STATUS: "/orders/status",

  /* =========================================
   * Documents
   * ======================================= */

  DOCUMENTS: "/documents",
  DOCUMENT_UPLOAD: "/documents/upload",
  DOCUMENT_DOWNLOAD: "/documents/download",

  /* =========================================
   * Payments
   * ======================================= */

  PAYMENTS: "/payments",
  PAYMENT_HISTORY: "/payments/history",
  PAYMENT_INVOICE: "/payments/invoice",

  /* =========================================
   * Notifications
   * ======================================= */

  NOTIFICATIONS: "/notifications",
  NOTIFICATION_READ: "/notifications/read",
  NOTIFICATION_MARK_ALL: "/notifications/read-all",

  /* =========================================
   * Profile
   * ======================================= */

  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",

  /* =========================================
   * Company
   * ======================================= */

  COMPANY: "/company",
  COMPANY_KYC: "/company/kyc",

  /* =========================================
   * Public Services
   * ======================================= */

  SERVICES: `${V1}/services`,
  FEATURED_SERVICES: `${V1}/services/featured`,
  SERVICE_CATEGORIES: `${V1}/services/categories`,
  SERVICE_SEARCH: `${V1}/services/search`,
  SERVICE_DETAILS: (slug: string) =>
    `${V1}/services/${slug}`,

  /* =========================================
   * Public Blogs
   * ======================================= */

  BLOGS: `${V1}/blogs`,
  FEATURED_BLOGS: `${V1}/blogs/featured`,
  BLOG_CATEGORIES: `${V1}/blogs/categories`,
  BLOG_SEARCH: `${V1}/blogs/search`,
  BLOG_DETAILS: (slug: string) =>
    `${V1}/blogs/${slug}`,

  /* =========================================
   * Contact
   * ======================================= */

  CONTACT: `${V1}/contact`,

  /* =========================================
   * Newsletter
   * ======================================= */

  NEWSLETTER_SUBSCRIBE:
    `${V1}/newsletter/subscribe`,

  /* =========================================
   * AI
   * ======================================= */

  AI_CHAT: "/ai/chat",
  AI_OCR: "/ai/ocr",
  AI_COMPLIANCE: "/ai/compliance",

  /* =========================================
   * Admin
   * ======================================= */

  ADMIN_USERS: "/admin/users",
  ADMIN_COMPANIES: "/admin/companies",
  ADMIN_SERVICES: "/admin/services",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

export type ApiEndpoint = keyof typeof API;