"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useRegister } from "@/hooks/useAuth";

import type { RegisterRequest } from "@/types/auth";

/* ==========================================================
 * Validation Schema
 * ========================================================== */

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100),

    email: z
      .string()
      .email("Please enter a valid email address."),

    phone: z
      .string()
      .min(10)
      .max(15)
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and number."
      ),

    password_confirmation: z
      .string()
      .min(8),
terms: z
  .boolean()
  .refine((value) => value === true, {
    message: "Please accept Terms & Conditions.",
  }),
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

/* ==========================================================
 * Types
 * ========================================================== */

type RegisterFormValues =
  z.infer<typeof registerSchema>;

/* ==========================================================
 * Component
 * ========================================================== */

export default function RegisterForm() {
  const router = useRouter();

  const registerMutation =
    useRegister();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
    watch,
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(
      registerSchema
    ),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  const password =
    watch("password");

/* ==========================================================
 * Password Strength
 * ========================================================== */

  const passwordStrength = (() => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password))
      score++;

    if (/[a-z]/.test(password))
      score++;

    if (/\d/.test(password))
      score++;

    if (/[^A-Za-z0-9]/.test(password))
      score++;

    return score;
  })();

/* ==========================================================
 * Continue in Part 2...
 * ========================================================== */
/* ==========================================================
 * Submit
 * ========================================================== */

  const onSubmit = async (
    values: RegisterFormValues
  ) => {
    try {
      const payload: RegisterRequest = {
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        password: values.password,
        password_confirmation:
          values.password_confirmation,
      };

      const response =
        await registerMutation.mutateAsync(
          payload
        );

      toast.success(
        response.message ??
          "Registration successful."
      );

      reset();

     router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to register."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border bg-white p-8 shadow-lg">

      <div className="mb-8 text-center">

        <h1 className="text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Register to manage your
          companies and services.
        </p>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* Name */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            {...register("name")}
            placeholder="Enter your full name"
            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}

        </div>

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Phone */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="text"
            {...register("phone")}
            placeholder="Enter phone number"
            className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone.message}
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
              {...register("password")}
              placeholder="Enter password"
              className="w-full rounded-lg border px-4 py-3 pr-14 outline-none transition focus:border-blue-600"
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

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${
                  passwordStrength * 20
                }%`,
              }}
            />

          </div>

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
              placeholder="Confirm password"
              className="w-full rounded-lg border px-4 py-3 pr-14 outline-none transition focus:border-blue-600"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-3 text-sm font-medium text-blue-600"
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">
              {
                errors.password_confirmation
                  .message
              }
            </p>
          )}

        </div>

        {/* Terms */}

        <div className="flex items-start gap-3">

          <input
            id="terms"
            type="checkbox"
            {...register("terms")}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />

          <label
            htmlFor="terms"
            className="text-sm text-gray-600"
          >
            I agree to the{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-blue-600 hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>
          </label>

        </div>

        {errors.terms && (
          <p className="text-sm text-red-600">
            {errors.terms.message}
          </p>
        )}

        {/* Register Button */}

        <button
          type="submit"
          disabled={
            registerMutation.isPending ||
            isSubmitting
          }
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMutation.isPending
            ? "Creating Account..."
            : "Create Account"}
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

        {/* Login */}

        <p className="text-center text-sm text-gray-600">

          Already have an account?{" "}

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