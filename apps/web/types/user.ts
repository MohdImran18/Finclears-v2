import type {
  BaseFilters,
  PaginatedResponse,
} from "./common";

/* ==========================================================
 | User Enums
 * ========================================================= */

export type UserRole =
  | "super-admin"
  | "admin"
  | "manager"
  | "accountant"
  | "employee"
  | "client";

export type UserStatus =
  | "active"
  | "inactive"
  | "blocked";

/* ==========================================================
 | User
 * ========================================================= */

export interface User {
  id: number;

  name: string;

  email: string;

  phone?: string | null;

  avatar?: string | null;

  role: UserRole;

  status: UserStatus;

  email_verified_at?: string | null;

  last_login_at?: string | null;

  created_at: string;

  updated_at: string;
}

/* ==========================================================
 | API Responses
 * ========================================================= */

export type UserListResponse =
  PaginatedResponse<User>;

/* ==========================================================
 | Create User
 * ========================================================= */

export interface CreateUserRequest {
  name: string;

  email: string;

  phone?: string;

  password: string;

  password_confirmation: string;

  role: UserRole;

  status: UserStatus;
}

/* ==========================================================
 | Update User
 * ========================================================= */

export interface UpdateUserRequest {
  name: string;

  email: string;

  phone?: string;

  password?: string;

  password_confirmation?: string;

  role: UserRole;

  status: UserStatus;
}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface UserFilters
  extends BaseFilters {

  role?: UserRole;

  status?: UserStatus;
}