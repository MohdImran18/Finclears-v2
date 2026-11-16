
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth";

interface Props {
    children: React.ReactNode;
}

export default function GuestGuard({ children }: Props) {
    const router = useRouter();

    const hydrated = useAuthStore((state) => state.hydrated);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (hydrated && isAuthenticated) {
            if (user?.role === "employee") {
                router.replace(ROUTES.EMPLOYEE_CONSENT);
            } else {
                router.replace(ROUTES.DASHBOARD);
            }
        }
    }, [hydrated, isAuthenticated, user?.role, router]);

    if (!hydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
