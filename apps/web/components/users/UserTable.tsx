"use client";
import EmptyUsers from "@/components/users/EmptyUsers";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import UserRoleBadge from "@/components/users/UserRoleBadge";
import UserActions from "@/components/users/UserActions";
import Link from "next/link";

import type {
  PaginationMeta,
} from "@/types/company";

import type { User } from "@/types/user";

interface Props {
  users: User[];

  meta?: PaginationMeta;

  loading?: boolean;

  error?: boolean;
}

export default function UserTable({
  users,
  meta,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">

        Loading users...

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">

        Failed to load users.

      </div>
    );
  }

  if (!users.length) {
  return <EmptyUsers />;
}

  return (
    <div className="overflow-hidden rounded-xl border bg-white">

      <table className="min-w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Email
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Role
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-t"
            >

              <td className="px-6 py-4">

                <div>

                  <div className="font-medium">

                    {user.name}

                  </div>

                </div>

              </td>

              <td className="px-6 py-4">

                {user.email}

              </td>

              <td className="px-6 py-4">

                {user.phone ?? "-"}

              </td>

              <td className="px-6 py-4">

                <UserRoleBadge role={user.role} />
              </td>

              <td className="px-6 py-4">

                <span
                  className={`rounded px-2 py-1 text-xs capitalize ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "blocked"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.status}
                </span>

              </td>

              <td className="px-6 py-4">

                <div className="flex gap-2">

                <UserActions
                        id={user.id}
                         name={user.name}
                 />

                

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {meta && (

        <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-gray-500">

          <div>

            Showing page {meta.current_page} of {meta.last_page}

          </div>

          <div>

            Total Users : {meta.total}

          </div>

        </div>

      )}

    </div>
  );
}
