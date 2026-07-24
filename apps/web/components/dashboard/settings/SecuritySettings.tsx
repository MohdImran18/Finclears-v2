"use client";

import { Button } from "@/components/ui/button";

export default function SecuritySettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Security
      </h2>

      <input
        type="password"
        placeholder="New Password"
        className="mb-4 w-full rounded-xl border p-4"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full rounded-xl border p-4"
      />

      <Button className="mt-8">
        Update Password
      </Button>

    </div>
  );
}
