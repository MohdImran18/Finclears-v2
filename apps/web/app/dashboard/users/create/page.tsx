"use client";

import { useRouter } from "next/navigation";

import UserForm from "@/components/users/UserForm";
import { useCreateUser } from "@/hooks/useUsers";

interface CreateUserFormData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role: "admin" | "employee" | "client";
  status: "active" | "inactive" | "blocked";
}

export default function CreateUserPage() {
  const router = useRouter();

  const mutation = useCreateUser();

  async function handleSubmit(
    data: CreateUserFormData
  ) {
    if (!data.password || !data.password_confirmation) {
      alert("Password is required.");
      return;
    }

    try {
      await mutation.mutateAsync({
        ...data,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      alert("User created successfully.");

      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);

      alert("Unable to create user.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Create User
        </h1>

        <p className="text-gray-500">
          Add a new user to FinClears.
        </p>
      </div>

      <UserForm
        loading={mutation.isPending}
        submitText="Create User"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
