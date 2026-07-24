"use client";

import { Button } from "@/components/ui/button";

export default function DangerZone() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8">

      <h2 className="text-2xl font-bold text-red-700">
        Danger Zone
      </h2>

      <p className="mt-3 text-red-600">
        Delete your account permanently.
      </p>

      <Button className="mt-8 bg-red-600 hover:bg-red-700">
        Delete Account
      </Button>

    </div>
  );
}
