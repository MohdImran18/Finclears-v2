"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useResetPassword } from "@/hooks/useAuth";

const schema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    password_confirmation: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.password_confirmation,
    {
      path: ["password_confirmation"],
      message: "Passwords do not match.",
    }
  );

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token =
    searchParams.get("token") ?? "";

  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

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

      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to reset password."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Reset Password
      </h1>

      <p className="mb-8 text-gray-500">
        Create a new password for your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        <div>

          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            {...register(
              "password_confirmation"
            )}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none"
          />

          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">
              {
                errors.password_confirmation
                  .message
              }
            </p>
          )}

        </div>

        <button
          type="submit"
          disabled={
            mutation.isPending ||
            isSubmitting
          }
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending
            ? "Resetting Password..."
            : "Reset Password"}
        </button>

        <p className="text-center text-sm text-gray-600">

          Remember your password?{" "}

          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>

        </p>

      </form>

    </div>
  );
}