"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  Mail,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { useForgotPassword } from "@/hooks/useAuth";

/* ==========================================================
 * Validation
 * ========================================================== */

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

/* ==========================================================
 * Component
 * ========================================================== */

export default function ForgotPasswordForm() {
  const mutation = useForgotPassword();

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
      email: "",
    },
  });

  const onSubmit = async (
    data: FormValues
  ) => {
    try {
      const response =
        await mutation.mutateAsync(data);

      toast.success(
        response.message ??
          "Password reset link sent successfully."
      );

      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to send password reset email."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      {/* Header */}

      <div className="mb-8 text-center">

        <h1 className="text-3xl font-bold text-slate-900">
          Forgot Password
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter your registered email address.
          We'll send you a secure password reset link.
        </p>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email")}
              className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={
            mutation.isPending ||
            isSubmitting
          }
          className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? (
            <>
              <Loader2
                size={18}
                className="mr-2 animate-spin"
              />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Divider */}

        <div className="border-t border-slate-200 pt-6 text-center">

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

        </div>

      </form>

    </div>
  );
}