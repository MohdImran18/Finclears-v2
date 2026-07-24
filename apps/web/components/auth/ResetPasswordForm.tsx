"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { useResetPassword } from "@/hooks/useAuth";

/* ==========================================================
 * Validation
 * ========================================================== */

const schema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters."
      )
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and a number."
      ),

    password_confirmation: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.password_confirmation,
    {
      path: ["password_confirmation"],
      message: "Passwords do not match.",
    }
  );

type FormValues = z.infer<typeof schema>;

/* ==========================================================
 * Component
 * ========================================================== */

export default function ResetPasswordForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token =
    searchParams.get("token") ?? "";

  const emailFromUrl =
    searchParams.get("email") ?? "";

  const mutation = useResetPassword();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      email: emailFromUrl,
      password: "",
      password_confirmation: "",
    },
  });

  /* ==========================================================
   * Invalid Token
   * ========================================================== */

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-xl">

        <h2 className="text-2xl font-bold text-slate-900">
          Invalid Reset Link
        </h2>

        <p className="mt-4 text-slate-500">
          This password reset link is
          invalid or has expired.
        </p>

        <Link
          href="/auth/forgot-password"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Request New Link
        </Link>

      </div>
    );
  }

  /* ==========================================================
   * Submit
   * ========================================================== */

  const onSubmit = async (
    values: FormValues
  ) => {
    try {
      const response =
        await mutation.mutateAsync({
          token,
          email: values.email,
          password: values.password,
          password_confirmation:
            values.password_confirmation,
        });

      toast.success(
        response.message ??
          "Password reset successfully."
      );

      reset();

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to reset password."
      );
    }
  };

  /* ==========================================================
   * UI
   * ========================================================== */

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Reset Password
      </h1>

      <p className="mb-8 text-slate-500">
        Create a new password for your
        account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            readOnly
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              {...register("password")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:border-blue-600 focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-3.5"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

        </div>

        {/* Confirm Password */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              {...register(
                "password_confirmation"
              )}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:border-blue-600 focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-3.5"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          {errors.password_confirmation && (
            <p className="mt-2 text-sm text-red-600">
              {
                errors
                  .password_confirmation
                  .message
              }
            </p>
          )}

        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={
            mutation.isPending ||
            isSubmitting
          }
          className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <p className="text-center text-sm text-slate-600">

          Remember your password?{" "}

          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>

        </p>

      </form>

    </div>
  );
}