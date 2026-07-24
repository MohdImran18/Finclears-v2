"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";

import type { LoginRequest } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const loginMutation = useLogin();

  const loginStore = useAuthStore(
    (state) => state.login
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  async function onSubmit(
    values: LoginFormValues
  ) {
    try {
      const payload: LoginRequest = {
        email: values.email,
        password: values.password,
      };

      const response =
        await loginMutation.mutateAsync(payload);

      loginStore(
        response.data.token,
        response.data.user
      );

      toast.success(
        response.message ??
          "Login Successful"
      );

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Invalid email or password."
      );
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

      {/* Logo */}

      <div className="mb-8 text-center">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
          F
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-slate-500">
          Login to your FinClears account.
        </p>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Email Address
          </label>

          <div className="relative">

            <Mail
              className="absolute left-4 top-4 text-slate-400"
              size={18}
            />

            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email")}
              className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 transition focus:border-blue-600 focus:outline-none"
            />

          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Password
          </label>

          <div className="relative">

            <Lock
              className="absolute left-4 top-4 text-slate-400"
              size={18}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter password"
              {...register("password")}
              className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-12 transition focus:border-blue-600 focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-3.5 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

        </div>

        {/* Remember */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm">

            <input
              type="checkbox"
              {...register("remember")}
            />

            Remember me

          </label>

          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={
            loginMutation.isPending ||
            isSubmitting
          }
          className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2
                className="mr-2 animate-spin"
                size={18}
              />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}

        <div className="relative">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-slate-500">
              OR
            </span>
          </div>

        </div>

        {/* Register */}

        <p className="text-center text-sm text-slate-600">

          Don't have an account?{" "}

          <Link
            href="/auth/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create Account
          </Link>

        </p>

      </form>

    </div>
  );
}