"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";

import type { LoginRequest } from "@/types/auth";

/* ==========================================================
 * Validation
 * ========================================================== */

const loginSchema = z.object({

  email: z
    .string()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),

  remember: z.boolean().optional(),

});

type LoginFormValues =
  z.infer<typeof loginSchema>;

/* ==========================================================
 * Component
 * ========================================================== */

export default function LoginForm() {

  const router = useRouter();

  const loginMutation =
    useLogin();

  const loginStore =
    useAuthStore((state) => state.login);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const {

    register,

    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },

  } = useForm<LoginFormValues>({

    resolver:
      zodResolver(loginSchema),

    defaultValues: {

      email: "",

      password: "",

      remember: true,

    },

  });/* ==========================================================
 * Submit
 * ========================================================== */

  const onSubmit = async (
    values: LoginFormValues
  ) => {

    try {

      const payload: LoginRequest = {

        email: values.email,

        password: values.password,

      };

      const response =
        await loginMutation.mutateAsync(
          payload
        );

      loginStore(

        response.data.token,

        response.data.user

      );

      toast.success(
        response.message ??
        "Login successful."
      );

      router.push("/dashboard");

    } catch (error: any) {

      toast.error(

        error?.response?.data?.message ??

        "Invalid email or password."

      );

    }

  };

  return (

    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">

      {/* Header */}

      <div className="mb-8 text-center">

        <h1 className="text-3xl font-bold text-gray-900">

          Welcome Back

        </h1>

        <p className="mt-2 text-sm text-gray-500">

          Login to your FinClears account.

        </p>

      </div>

      <form

        onSubmit={handleSubmit(onSubmit)}

        className="space-y-5"

      >

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-medium">

            Email Address

          </label>

          <input

            type="email"

            placeholder="Enter your email"

            {...register("email")}

            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600"

          />

          {errors.email && (

            <p className="mt-1 text-sm text-red-600">

              {errors.email.message}

            </p>

          )}

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 block text-sm font-medium">

            Password

          </label>

          <div className="relative">

            <input

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="Enter password"

              {...register("password")}

              className="w-full rounded-lg border px-4 py-3 pr-16 outline-none transition focus:border-blue-600"

            />

            <button

              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              className="absolute right-3 top-3 text-sm font-medium text-blue-600"

            >

              {showPassword
                ? "Hide"
                : "Show"}

            </button>

          </div>

          {errors.password && (

            <p className="mt-1 text-sm text-red-600">

              {errors.password.message}

            </p>

          )}

        </div>        {/* Remember + Forgot Password */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              {...register("remember")}
              className="rounded border-gray-300"
            />

            Remember me

          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={
            loginMutation.isPending ||
            isSubmitting
          }
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginMutation.isPending
            ? "Signing In..."
            : "Sign In"}
        </button>

        {/* Divider */}

        <div className="relative py-2">

          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t" />

          </div>

          <div className="relative flex justify-center">

            <span className="bg-white px-4 text-sm text-gray-500">
              OR
            </span>

          </div>

        </div>

        {/* Register */}

        <p className="text-center text-sm text-gray-600">

          Don't have an account?{" "}

          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create Account
          </Link>

        </p>

      </form>

    </div>

  );

}