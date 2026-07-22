"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import AuthService from "@/services/auth/auth.service";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

/* ==========================================================
 | Login
 * ========================================================== */

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      AuthService.login(data),
  });
}

/* ==========================================================
 | Register
 * ========================================================== */

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      AuthService.register(data),
  });
}

/* ==========================================================
 | Current User
 * ========================================================== */

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => AuthService.me(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

/* ==========================================================
 | Logout
 * ========================================================== */

export function useLogout() {
  return useMutation({
    mutationFn: () =>
      AuthService.logout(),
  });
}

/* ==========================================================
 | Forgot Password
 * ========================================================== */

export function useForgotPassword() {
  return useMutation({
    mutationFn: (
      data: ForgotPasswordRequest
    ) =>
      AuthService.forgotPassword(data),
  });
}

/* ==========================================================
 | Reset Password
 * ========================================================== */

export function useResetPassword() {
  return useMutation({
    mutationFn: (
      data: ResetPasswordRequest
    ) =>
      AuthService.resetPassword(data),
  });
}

/* ==========================================================
 | Verify Email
 * ========================================================== */

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) =>
      AuthService.verifyEmail(token),
  });
}