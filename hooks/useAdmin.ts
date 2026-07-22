"use client";

import { useQuery } from "@tanstack/react-query";

/* ==========================================================
 * Dashboard
 * ========================================================== */

export function useDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => ({
      data: {
        users: 0,
        companies: 0,
        orders: 0,
        revenue: 0,
      },
    }),
  });
}

export function useRevenueChart() {
  return useQuery({
    queryKey: ["admin", "revenue-chart"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ["admin", "activities"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Companies
 * ========================================================== */

export function useAdminCompanies() {
  return useQuery({
    queryKey: ["admin", "companies"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Users
 * ========================================================== */

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Documents
 * ========================================================== */

export function useAdminDocuments() {
  return useQuery({
    queryKey: ["admin", "documents"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Orders
 * ========================================================== */

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Payments
 * ========================================================== */

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Services
 * ========================================================== */

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Blogs
 * ========================================================== */

export function useAdminBlogs() {
  return useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Leads
 * ========================================================== */

export function useAdminLeads() {
  return useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Contacts
 * ========================================================== */

export function useAdminContacts() {
  return useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Newsletter
 * ========================================================== */

export function useAdminNewsletter() {
  return useQuery({
    queryKey: ["admin", "newsletter"],
    queryFn: async () => ({
      data: [],
    }),
  });
}

/* ==========================================================
 * Backward Compatibility
 * ========================================================== */

export const useAdminDashboard = useDashboard;
