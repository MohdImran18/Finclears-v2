"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";

const schema = z
  .object({
    name: z.string().min(2).max(255),

    email: z.string().email(),

    phone: z.string().optional(),

    password: z.string().optional(),

    password_confirmation: z.string().optional(),

    role: z.enum([
      "super-admin",
      "admin",
      "manager",
      "accountant",
      "employee",
      "client",
    ]),

    status: z.enum([
      "active",
      "inactive",
      "blocked",
    ]),
  })
  .refine(
    (data) =>
      !data.password ||
      data.password === data.password_confirmation,
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    }
  );

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role: CreateUserRequest["role"];
  status: CreateUserRequest["status"];
};

interface Props {
  initialValues?: Partial<
    CreateUserRequest &
      UpdateUserRequest
  >;

  loading?: boolean;

  submitText?: string;

  onSubmit(
    data: FormValues
  ): Promise<void> | void;
}

export default function UserForm({
  initialValues,
  loading = false,
  submitText = "Save User",
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: "client",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues as FormValues);
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border bg-white p-6"
    >
      {/* Name */}

      <div>
        <label className="mb-2 block font-medium">
          Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border px-4 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}

      <div>
        <label className="mb-2 block font-medium">
          Email
        </label>

        <input
          {...register("email")}
          className="w-full rounded-lg border px-4 py-2"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}

      <div>
        <label className="mb-2 block font-medium">
          Phone
        </label>

        <input
          {...register("phone")}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      {/* Password */}

      <div>
        <label className="mb-2 block font-medium">
          Password
        </label>

        <input
          type="password"
          {...register("password")}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      {/* Confirm Password */}

      <div>
        <label className="mb-2 block font-medium">
          Confirm Password
        </label>

        <input
          type="password"
          {...register(
            "password_confirmation"
          )}
          className="w-full rounded-lg border px-4 py-2"
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

      {/* Role */}

      <div>
        <label className="mb-2 block font-medium">
          Role
        </label>

        <select
  {...register("role")}
  className="w-full rounded-lg border px-4 py-2"
>
  <option value="super-admin">
    Super Admin
  </option>

  <option value="admin">
    Admin
  </option>

  <option value="manager">
    Manager
  </option>

  <option value="accountant">
    Accountant
  </option>

  <option value="employee">
    Employee
  </option>

  <option value="client">
    Client
  </option>
</select>
      </div>

      {/* Status */}

      <div>
        <label className="mb-2 block font-medium">
          Status
        </label>

        <select
          {...register("status")}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

          <option value="blocked">
            Blocked
          </option>
        </select>
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : submitText}
      </button>
    </form>
  );
}




