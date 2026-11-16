import { AuthUser } from "@/lib/api/auth/authApi";

/**
 * Admin and Super Admin have unrestricted frontend workspace access.
 */
function isUnrestrictedAdmin(user: AuthUser): boolean {
  const roles = [
    user.role,
    ...(user.spatie_roles ?? []),
  ].filter((role): role is string => typeof role === "string");

  return roles.some((role) =>
    ["admin", "super_admin", "super-admin"].includes(role.toLowerCase())
  );
}

/**
 * Check whether the current user has a permission.
 */
export function hasPermission(
  user: AuthUser | null | undefined,
  permission: string
): boolean {
  if (!user) {
    return false;
  }

  // Admin has unrestricted access.
  if (isUnrestrictedAdmin(user)) {
    return true;
  }

  return (
    user.permissions?.includes(permission) ?? false
  );
}

/**
 * Check whether the current user has at least
 * one of the supplied permissions.
 */
export function hasAnyPermission(
  user: AuthUser | null | undefined,
  permissions: string[]
): boolean {
  if (!user) {
    return false;
  }

  if (isUnrestrictedAdmin(user)) {
    return true;
  }

  return permissions.some((permission) =>
    hasPermission(user, permission)
  );
}

/**
 * Check whether the current user has all
 * supplied permissions.
 */
export function hasAllPermissions(
  user: AuthUser | null | undefined,
  permissions: string[]
): boolean {
  if (!user) {
    return false;
  }

  if (isUnrestrictedAdmin(user)) {
    return true;
  }

  return permissions.every((permission) =>
    hasPermission(user, permission)
  );
}

/**
 * Get the user's effective role.
 *
 * Spatie roles are preferred because they represent
 * the actual permission system.
 */
export function getPrimaryRole(
  user: AuthUser | null | undefined
): string | null {
  if (!user) {
    return null;
  }

  if (user.spatie_roles?.length) {
    return user.spatie_roles[0];
  }

  return user.role || null;
}

/**
 * Check whether the user has a specific Spatie role.
 */
export function hasRole(
  user: AuthUser | null | undefined,
  role: string
): boolean {
  if (!user) {
    return false;
  }

  if (isUnrestrictedAdmin(user)) {
    return true;
  }

  return user.spatie_roles?.includes(role) ?? false;
}
