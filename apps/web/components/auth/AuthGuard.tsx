
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import AuthService from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth";

interface Props {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hydrated = useAuthStore((state) => state.hydrated);
    const user = useAuthStore((state) => state.user);

    const [employeeAccessChecked, setEmployeeAccessChecked] = useState(false);

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuthenticated) {
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (user?.role !== "employee") {
            setEmployeeAccessChecked(true);
            return;
        }

        let active = true;

        setEmployeeAccessChecked(false);

        AuthService.employeeConsentStatus()
            .then((response) => {
                if (!active) return;

                if (
                    response.data.status === "accepted" &&
                    response.data.policy_available
                ) {
                    setEmployeeAccessChecked(true);
                } else {
                    router.replace(ROUTES.EMPLOYEE_CONSENT);
                }
            })
            .catch(() => {
                if (active) {
                    router.replace(ROUTES.EMPLOYEE_CONSENT);
                }
            });

        return () => {
            active = false;
        };
    }, [hydrated, isAuthenticated, user?.role, router]);

    if (!hydrated || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (user?.role === "employee" && !employeeAccessChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Verifying employee consent...
            </div>
        );
    }

    return <>{children}</>;
}
