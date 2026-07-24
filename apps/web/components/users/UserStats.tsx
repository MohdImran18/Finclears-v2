"use client";

import { useUsers } from "@/hooks/useUsers";

export default function UserStats() {
  const { data, isLoading } = useUsers({
    page: 1,
    per_page: 1000,
  });

  const users = data?.data ?? [];

  const total = users.length;

  const active = users.filter(
    (u) => u.status === "active"
  ).length;

  const employees = users.filter(
    (u) => u.role === "employee"
  ).length;

  const clients = users.filter(
    (u) => u.role === "client"
  ).length;

  const cards = [
    {
      title: "Total Users",
      value: total,
    },
    {
      title: "Active Users",
      value: active,
    },
    {
      title: "Employees",
      value: employees,
    },
    {
      title: "Clients",
      value: clients,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {isLoading ? "..." : card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
