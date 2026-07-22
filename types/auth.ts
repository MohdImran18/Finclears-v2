export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  avatar?: string | null;
  avatar_url?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

/* ===========================
   Login
=========================== */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse
  extends ApiResponse<{
    token: string;
    user: User;
  }> {}

/* ===========================
   Register
=========================== */

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse
  extends ApiResponse<{
    token: string;
    user: User;
  }> {}

/* ===========================
   Forgot Password
=========================== */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse
  extends ApiResponse<null> {}

/* ===========================
   Reset Password
=========================== */

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse
  extends ApiResponse<null> {}

/* ===========================
   Verify Email
=========================== */

export interface VerifyEmailRequest {
  id: number;
  hash: string;
}

export interface VerifyEmailResponse
  extends ApiResponse<null> {}