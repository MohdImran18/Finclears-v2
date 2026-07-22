"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const {
    hydrated,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    if (
      hydrated &&
      !isAuthenticated
    ) {
      router.replace(
        ROUTES.LOGIN
      );
    }
  }, [
    hydrated,
    isAuthenticated,
    router,
  ]);

  if (
    !hydrated ||
    !isAuthenticated
  ) {
    return null;
  }

  return <>{children}</>;
}