import type { AuthUser } from "@/lib/api/auth/authApi";

/**
 * Choose a safe, useful landing page after authentication.
 *
 * The legacy `role` column only distinguishes admin, employee, and client,
 * so workspace selection must prefer Spatie roles when they are available.
 */
export function getWorkspaceRoute(user: AuthUser): string {
  const roles = new Set(user.spatie_roles ?? []);

  if (
    user.role === "admin" ||
    roles.has("admin") ||
    roles.has("super-admin")
  ) {
    return "/";
  }

  if (roles.has("hr-manager") || roles.has("hr-executive")) {
    return "/hrm/dashboard";
  }

  if (roles.has("department-manager") || roles.has("team-lead")) {
    return "/manager/dashboard";
  }

  if (roles.has("finance-manager") || roles.has("accountant")) {
    return "/crm/payments";
  }

  return "/employee/dashboard";
}
