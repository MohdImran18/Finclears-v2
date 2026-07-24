"use client";

import { Button } from "@/components/ui/button";

export default function AccountSettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Account Settings
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <input
          placeholder="Full Name"
          className="rounded-xl border p-4"
        />

        <input
          placeholder="Email"
          className="rounded-xl border p-4"
        />

      </div>

      <Button className="mt-8">
        Save Changes
      </Button>

    </div>
  );
}
