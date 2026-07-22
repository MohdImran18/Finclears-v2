"use client";

import type {
  UserFilters,
  UserRole,
  UserStatus,
} from "@/types/user";

interface Props {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
}

export default function UserFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-4">

      <input
        type="text"
        placeholder="Search users..."
        value={filters.search ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            search: e.target.value,
            page: 1,
          })
        }
        className="rounded-lg border px-3 py-2"
      />

      <select
        value={filters.role ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            role: (e.target.value || undefined) as UserRole | undefined,
            page: 1,
          })
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
        <option value="client">Client</option>
      </select>

      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            status: (e.target.value || undefined) as UserStatus | undefined,
            page: 1,
          })
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="blocked">Blocked</option>
      </select>

      <button
        onClick={() =>
          onChange({
            search: "",
            role: undefined,
            status: undefined,
            page: 1,
            per_page: filters.per_page,
          })
        }
        className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Reset
      </button>

    </div>
  );
}
