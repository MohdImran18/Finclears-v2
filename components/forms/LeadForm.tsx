"use client";

import { Button } from "@/components/ui/button";

export default function LeadForm() {
  return (
    <form className="space-y-4">
      <input
        placeholder="Name"
        className="w-full rounded-xl border p-4"
      />

      <input
        placeholder="Phone"
        className="w-full rounded-xl border p-4"
      />

      <Button className="w-full">
        Get Free Consultation
      </Button>
    </form>
  );
}
