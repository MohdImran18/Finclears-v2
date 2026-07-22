"use client";

import { Button } from "@/components/ui/button";

export default function OTPForm() {
  return (
    <form className="space-y-5">
      <input
        placeholder="Enter OTP"
        className="w-full rounded-xl border p-4 text-center text-2xl tracking-[12px]"
      />

      <Button className="w-full">
        Verify OTP
      </Button>
    </form>
  );
}
