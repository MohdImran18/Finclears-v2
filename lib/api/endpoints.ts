/**
 * ============================================================
 * FinClears V2
 * API Endpoints
 * ============================================================
 */

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
  VERIFY_OTP: "/verify-otp",

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

  SERVICES: "/v1/services",
  FEATURED_SERVICES: "/v1/services/featured",
  SERVICE_CATEGORIES: "/v1/services/categories",
  SERVICE_SEARCH: "/v1/services/search",
  SERVICE_DETAILS: "/v1/services",

  /* =========================================
   * Public Blogs
   * ======================================= */

  BLOGS: "/v1/blogs",
  FEATURED_BLOGS: "/v1/blogs/featured",
  BLOG_CATEGORIES: "/v1/blogs/categories",
  BLOG_SEARCH: "/v1/blogs/search",
  BLOG_DETAILS: "/v1/blogs",

  /* =========================================
   * Contact
   * ======================================= */

  CONTACT: "/v1/contact",

  /* =========================================
   * Newsletter
   * ======================================= */

  NEWSLETTER_SUBSCRIBE:
    "/v1/newsletter/subscribe",

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
