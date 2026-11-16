
"use client";

import { type ReactNode, useEffect } from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import { useCurrentUser } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";

interface Props {
    children: ReactNode;
}

// Dashboard content will load only after AuthGuard allows access.
function DashboardContent({ children }: Props) {
    const { data } = useCurrentUser();

    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (data?.data) {
            setUser(data.data);
        }
    }, [data, setUser]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header />

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: Props) {
    return (
        <AuthGuard>
            <DashboardContent>{children}</DashboardContent>
        </AuthGuard>
    );
}
