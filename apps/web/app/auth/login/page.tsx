"use client";

import GuestGuard from "@/components/auth/GuestGuard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <LoginForm />
      </main>
    </GuestGuard>
  );
}