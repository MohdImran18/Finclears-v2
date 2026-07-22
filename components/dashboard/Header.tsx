"use client";

import { useAuthStore } from "@/store/auth";

export default function Header() {

  const user = useAuthStore(
    (state) => state.user
  );

  return (

    <header className="flex h-16 items-center justify-between border-b bg-white px-8">

      <div>

        <h1 className="text-xl font-semibold">
          Customer Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back
        </p>

      </div>

      <div className="text-right">

        <p className="font-semibold">
          {user?.name}
        </p>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>

      </div>

    </header>

  );

}