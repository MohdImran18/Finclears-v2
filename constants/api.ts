const V1 = "/v1";

const API = {
  /* ==========================================================
   * Authentication
   * ========================================================== */
  AUTH: {
    LOGIN: `${V1}/auth/login`,
    REGISTER: `${V1}/auth/register`,
    LOGOUT: `${V1}/auth/logout`,
    ME: `${V1}/auth/me`,

    FORGOT_PASSWORD: `${V1}/auth/forgot-password`,
    RESET_PASSWORD: `${V1}/auth/reset-password`,

    VERIFY_EMAIL: `${V1}/auth/verify-email`,
    RESEND_VERIFICATION: `${V1}/auth/resend-verification`,
  },

  /* ==========================================================
   * Users
   * ========================================================== */
  USERS: {
    INDEX: `${V1}/users`,
    STORE: `${V1}/users`,
    PROFILE: `${V1}/users/profile`,
    CHANGE_PASSWORD: `${V1}/users/change-password`,

    SHOW: (id: number | string) => `${V1}/users/${id}`,
    UPDATE: (id: number | string) => `${V1}/users/${id}`,
    DELETE: (id: number | string) => `${V1}/users/${id}`,
  },

  /* ==========================================================
   * Companies
   * ========================================================== */
  COMPANIES: {
    INDEX: `${V1}/companies`,
    STORE: `${V1}/companies`,

    SHOW: (id: number | string) => `${V1}/companies/${id}`,
    UPDATE: (id: number | string) => `${V1}/companies/${id}`,
    DELETE: (id: number | string) => `${V1}/companies/${id}`,

    DRAFT: `${V1}/companies/draft`,

    UPLOAD: (id: number | string) =>
      `${V1}/companies/${id}/documents`,

    SUBMIT: (id: number | string) =>
      `${V1}/companies/${id}/submit`,

    STATUS: (id: number | string) =>
      `${V1}/companies/${id}/status`,

    ASSIGN_CA: (id: number | string) =>
      `${V1}/companies/${id}/assign-ca`,

    SYNC_STATUS: (id: number | string) =>
      `${V1}/companies/${id}/sync-status`,
  },

  /* ==========================================================
   * Services
   * ========================================================== */
  SERVICES: {
    INDEX: `${V1}/services`,
    FEATURED: `${V1}/services/featured`,
    SEARCH: `${V1}/services/search`,
    CATEGORIES: `${V1}/services/categories`,

    SHOW: (slug: string) =>
      `${V1}/services/${slug}`,

    RELATED: (slug: string) =>
      `${V1}/services/${slug}/related`,
  },

  /* ==========================================================
   * Blogs
   * ========================================================== */
  BLOGS: {
    INDEX: `${V1}/blogs`,
    FEATURED: `${V1}/blogs/featured`,
    SEARCH: `${V1}/blogs/search`,
    CATEGORIES: `${V1}/blogs/categories`,

    SHOW: (slug: string) =>
      `${V1}/blogs/${slug}`,

    RELATED: (slug: string) =>
      `${V1}/blogs/${slug}/related`,
  },

  /* ==========================================================
   * FAQs
   * ========================================================== */
  FAQS: {
    INDEX: `${V1}/faqs`,
  },

  /* ==========================================================
   * Testimonials
   * ========================================================== */
  TESTIMONIALS: {
    INDEX: `${V1}/testimonials`,
  },

  /* ==========================================================
   * Leads
   * ========================================================== */
  LEADS: {
    INDEX: `${V1}/leads`,
    STORE: `${V1}/leads`,

    SHOW: (id: number | string) => `${V1}/leads/${id}`,
    UPDATE: (id: number | string) => `${V1}/leads/${id}`,
    DELETE: (id: number | string) => `${V1}/leads/${id}`,
  },

  /* ==========================================================
   * Orders
   * ========================================================== */
  ORDERS: {
    INDEX: `${V1}/orders`,
    STORE: `${V1}/orders`,

    SHOW: (id: number | string) => `${V1}/orders/${id}`,
    UPDATE: (id: number | string) => `${V1}/orders/${id}`,
    DELETE: (id: number | string) => `${V1}/orders/${id}`,
  },

  /* ==========================================================
   * Payments
   * ========================================================== */
  PAYMENTS: {
    INDEX: `${V1}/payments`,
    STORE: `${V1}/payments`,

    SHOW: (id: number | string) => `${V1}/payments/${id}`,

    VERIFY: `${V1}/payments/verify`,
  },

  /* ==========================================================
   * Documents
   * ========================================================== */
  DOCUMENTS: {
    INDEX: `${V1}/documents`,
    STORE: `${V1}/documents`,

    SHOW: (id: number | string) => `${V1}/documents/${id}`,
    UPDATE: (id: number | string) => `${V1}/documents/${id}`,
    DELETE: (id: number | string) => `${V1}/documents/${id}`,

    DOWNLOAD: (id: number | string) =>
      `${V1}/documents/${id}/download`,
  },

  /* ==========================================================
   * Contact
   * ========================================================== */
  CONTACT: {
    SEND: `${V1}/contact`,
  },

  /* ==========================================================
   * Newsletter
   * ========================================================== */
  NEWSLETTER: {
    SUBSCRIBE: `${V1}/newsletter/subscribe`,
  },

  /* ==========================================================
   * Dashboard
   * ========================================================== */
  DASHBOARD: {
    STATS: `${V1}/dashboard/stats`,
    RECENT_ORDERS: `${V1}/dashboard/recent-orders`,
    RECENT_PAYMENTS: `${V1}/dashboard/recent-payments`,
    RECENT_DOCUMENTS: `${V1}/dashboard/recent-documents`,
    RECENT_NOTIFICATIONS: `${V1}/dashboard/recent-notifications`,
  },

  /* ==========================================================
   * Notifications
   * ========================================================== */
  NOTIFICATIONS: {
    INDEX: `${V1}/notifications`,

    READ: (id: number | string) =>
      `${V1}/notifications/${id}/read`,

    READ_ALL: `${V1}/notifications/read-all`,
  },

  /* ==========================================================
   * Settings
   * ========================================================== */
  SETTINGS: {
    INDEX: `${V1}/settings`,
    UPDATE: `${V1}/settings`,
  },

  /* ==========================================================
   * SEO
   * ========================================================== */
  SEO: {
    INDEX: `${V1}/seo`,
  },

  /* ==========================================================
   * Media
   * ========================================================== */
  MEDIA: {
    UPLOAD: `${V1}/media/upload`,

    DELETE: (id: number | string) =>
      `${V1}/media/${id}`,
  },
} as const;

export default API;
export const API_ENDPOINTS = API;