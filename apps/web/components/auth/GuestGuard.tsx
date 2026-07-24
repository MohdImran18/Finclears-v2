"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

interface Props {
  children: React.ReactNode;
}

export default function GuestGuard({
  children,
}: Props) {
  const router = useRouter();

  const hydrated = useAuthStore(
    (state) => state.hydrated
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  useEffect(() => {
    if (
      hydrated &&
      isAuthenticated
    ) {
      router.replace(
        ROUTES.DASHBOARD
      );
    }
  }, [
    hydrated,
    isAuthenticated,
    router,
  ]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}