"use client";

import { useEffect } from "react";

import { useRouter, useParams } from "next/navigation";

import UserForm from "@/components/users/UserForm";

import {
  useUser,
  useUpdateUser,
} from "@/hooks/useUsers";

import type { UpdateUserRequest } from "@/types/user";

export default function EditUserPage() {
  const router = useRouter();

  const params = useParams();

  const id = Number(params.id);

  const {
    data,
    isLoading,
    isError,
  } = useUser(id);

  const mutation = useUpdateUser();

  async function handleSubmit(
    values: UpdateUserRequest
  ) {
    try {
    await mutation.mutateAsync({
  id,
  data: values,
});

      alert("User updated successfully.");

      router.push("/dashboard/users");

    } catch (error) {

      console.error(error);

      alert("Unable to update user.");
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        Loading user...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-red-600">
        User not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Edit User

        </h1>

        <p className="text-gray-500">

          Update user information.

        </p>

      </div>

      <UserForm
        initialValues={{
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          role: data.role,
          status: data.status,
        }}
        loading={mutation.isPending}
        submitText="Update User"
        onSubmit={handleSubmit}
      />

    </div>
  );
}