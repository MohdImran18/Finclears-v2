const API = {
  /* ==========================================================
   * Authentication
   * ========================================================== */
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",

    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",

    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
  },

  /* ==========================================================
   * Users
   * ========================================================== */
  USERS: {
    INDEX: "/users",
    STORE: "/users",
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",

    SHOW: (id: number | string) => `/users/${id}`,
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
  },

  /* ==========================================================
   * Companies
   * ========================================================== */
  COMPANIES: {
    INDEX: "/companies",
    STORE: "/companies",

    SHOW: (id: number | string) => `/companies/${id}`,
    UPDATE: (id: number | string) => `/companies/${id}`,
    DELETE: (id: number | string) => `/companies/${id}`,

    DRAFT: "/companies/draft",

    UPLOAD: (id: number | string) =>
      `/companies/${id}/documents`,

    SUBMIT: (id: number | string) =>
      `/companies/${id}/submit`,

    STATUS: (id: number | string) =>
      `/companies/${id}/status`,

    ASSIGN_CA: (id: number | string) =>
      `/companies/${id}/assign-ca`,

    SYNC_STATUS: (id: number | string) =>
      `/companies/${id}/sync-status`,
  },

  /* ==========================================================
   * Services
   * ========================================================== */
  SERVICES: {
    INDEX: "/services",
    FEATURED: "/services/featured",
    SEARCH: "/services/search",
    CATEGORIES: "/services/categories",

    SHOW: (slug: string) =>
      `/services/${slug}`,

    RELATED: (slug: string) =>
      `/services/${slug}/related`,
  },

  /* ==========================================================
   * Blogs
   * ========================================================== */
  BLOGS: {
    INDEX: "/blogs",
    FEATURED: "/blogs/featured",
    SEARCH: "/blogs/search",
    CATEGORIES: "/blogs/categories",

    SHOW: (slug: string) =>
      `/blogs/${slug}`,

    RELATED: (slug: string) =>
      `/blogs/${slug}/related`,
  },

  /* ==========================================================
   * FAQs
   * ========================================================== */
  FAQS: {
    INDEX: "/faqs",
  },

  /* ==========================================================
   * Testimonials
   * ========================================================== */
  TESTIMONIALS: {
    INDEX: "/testimonials",
  },

  /* ==========================================================
   * Leads
   * ========================================================== */
  LEADS: {
    INDEX: "/leads",
    STORE: "/leads",

    SHOW: (id: number | string) =>
      `/leads/${id}`,

    UPDATE: (id: number | string) =>
      `/leads/${id}`,

    DELETE: (id: number | string) =>
      `/leads/${id}`,
  },

  /* ==========================================================
   * Orders
   * ========================================================== */
  ORDERS: {
    INDEX: "/orders",
    STORE: "/orders",

    SHOW: (id: number | string) =>
      `/orders/${id}`,

    UPDATE: (id: number | string) =>
      `/orders/${id}`,

    DELETE: (id: number | string) =>
      `/orders/${id}`,
  },

  /* ==========================================================
   * Payments
   * ========================================================== */
  PAYMENTS: {
    INDEX: "/payments",
    STORE: "/payments",

    SHOW: (id: number | string) =>
      `/payments/${id}`,

    VERIFY: "/payments/verify",
  },

  /* ==========================================================
   * Contact
   * ========================================================== */
  CONTACT: {
    SEND: "/contact",
  },

  /* ==========================================================
   * Newsletter
   * ========================================================== */
  NEWSLETTER: {
    SUBSCRIBE: "/newsletter/subscribe",
  },

  /* ==========================================================
   * Dashboard
   * ========================================================== */
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ORDERS: "/dashboard/recent-orders",
    RECENT_PAYMENTS: "/dashboard/recent-payments",
    RECENT_DOCUMENTS: "/dashboard/recent-documents",
    RECENT_NOTIFICATIONS: "/dashboard/recent-notifications",
  },

  /* ==========================================================
   * Notifications
   * ========================================================== */
  NOTIFICATIONS: {
    INDEX: "/notifications",

    READ: (id: number | string) =>
      `/notifications/${id}/read`,

    READ_ALL: "/notifications/read-all",
  },

  /* ==========================================================
   * Settings
   * ========================================================== */
  SETTINGS: {
    INDEX: "/settings",
    UPDATE: "/settings",
  },

  /* ==========================================================
   * SEO
   * ========================================================== */
  SEO: {
    INDEX: "/seo",
  },

  /* ==========================================================
   * Documents
   * ========================================================== */
  DOCUMENTS: {
    INDEX: "/documents",
    STORE: "/documents",

    SHOW: (id: number | string) =>
      `/documents/${id}`,

    UPDATE: (id: number | string) =>
      `/documents/${id}`,

    DELETE: (id: number | string) =>
      `/documents/${id}`,

    DOWNLOAD: (id: number | string) =>
      `/documents/${id}/download`,

    VERIFY: (id: number | string) =>
      `/documents/${id}/verify`,

    REJECT: (id: number | string) =>
      `/documents/${id}/reject`,

    TIMELINE: (id: number | string) =>
      `/documents/${id}/timeline`,

    VERSIONS: (id: number | string) =>
      `/documents/${id}/versions`,

    REPLACE: (id: number | string) =>
      `/documents/${id}/replace`,
  },

  /* ==========================================================
   * Media
   * ========================================================== */
  MEDIA: {
    UPLOAD: "/media/upload",

    DELETE: (id: number | string) =>
      `/media/${id}`,
  },
} as const;

export default API;
export const API_ENDPOINTS = API;