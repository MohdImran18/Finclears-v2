"use client";

import { useState } from "react";

import { useUsers } from "@/hooks/useUsers";

import UserTable from "@/components/users/UserTable";
import UserFilters from "@/components/users/UserFilters";
import UserStats from "@/components/users/UserStats";
import CreateUserButton from "@/components/users/CreateUserButton";

import type { UserFilters as IUserFilters } from "@/types/user";

export default function UsersPage() {
  const [filters, setFilters] =
    useState<IUserFilters>({
      search: "",
      role: undefined,
      status: undefined,
      page: 1,
      per_page: 10,
    });

  const {
    data,
    isLoading,
    isError,
  } = useUsers(filters);

  return (
    <div className="container mx-auto space-y-6 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <p className="mt-1 text-gray-500">
            Manage users, roles and permissions.
          </p>

        </div>

        <CreateUserButton />

      </div>

      {/* Stats */}

      <UserStats />

      {/* Filters */}

      <UserFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* Table */}

      <UserTable
        users={data?.data ?? []}
        meta={data?.meta}
        loading={isLoading}
        error={isError}
      />

    </div>
  );
}
