"use client";

import { Button } from "@/components/ui/button";

export default function LoginForm() {
  return (
    <form className="space-y-5">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border p-4"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border p-4"
      />

      <Button className="w-full">
        Login
      </Button>
    </form>
  );
}
