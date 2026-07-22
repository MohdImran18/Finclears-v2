"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useForgotPassword } from "@/hooks/useAuth";

const schema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const mutation = useForgotPassword();

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
    data: FormValues
  ) => {
    try {
      const response =
        await mutation.mutateAsync(data);

      toast.success(
        response.message ??
          "Password reset link sent."
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to send reset email."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">

      <h1 className="mb-2 text-3xl font-bold">
        Forgot Password
      </h1>

      <p className="mb-8 text-gray-500">
        Enter your email address to receive a password reset link.
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

        <button
          type="submit"
          disabled={
            mutation.isPending ||
            isSubmitting
          }
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending
            ? "Sending..."
            : "Send Reset Link"}
        </button>

      </form>

    </div>
  );
}