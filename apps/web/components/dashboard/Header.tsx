"use client";

import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";

export default function Header() {
        const router = useRouter();

        const user = useAuthStore((state) => state.user);
        const logoutStore = useAuthStore((state) => state.logout);

        const logoutMutation = useLogout();

        const [menuOpen, setMenuOpen] = useState(false);

        async function handleLogout() {
                try {
                        await logoutMutation.mutateAsync();
                } catch {
                        // Even if the backend logout request fails,
                        // clear the local authentication state.
                } finally {
                        logoutStore();
                        toast.success("Logged out successfully.");
                        router.replace("/auth/login");
                }
        }

        return (
                <header className="flex h-16 items-center justify-between border-b bg-white px-8">
                        <div>
                                <h1 className="text-xl font-semibold">
                                        Customer Dashboard
                                </h1>

                                <p className="text-sm text-gray-500">
                                        Welcome back
                                </p>
                        </div>

                        <div className="flex items-center gap-4">
                                {/* Notification */}
                                <Link
                                        href="/dashboard/notifications"
                                        aria-label="Notifications"
                                        className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
                                >
                                        <Bell size={21} />

                                        <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                        <button
                                                type="button"
                                                onClick={() => setMenuOpen((value) => !value)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
                                                aria-expanded={menuOpen}
                                                aria-haspopup="menu"
                                        >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                                        {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                                </div>

                                                <div className="hidden text-left sm:block">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                                {user?.name ?? "User"}
                                                        </p>

                                                        <p className="max-w-[180px] truncate text-xs text-slate-500">
                                                                {user?.email ?? ""}
                                                        </p>
                                                </div>

                                                <ChevronDown
                                                        size={17}
                                                        className={`text-slate-500 transition ${
                                                                menuOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                        </button>

                                        {menuOpen && (
                                                <div
                                                        className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                                                        role="menu"
                                                >
                                                        <div className="border-b px-3 py-3">
                                                                <p className="font-semibold text-slate-900">
                                                                        {user?.name ?? "User"}
                                                                </p>

                                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                                        {user?.email ?? ""}
                                                                </p>
                                                        </div>

                                                        <Link
                                                                href="/dashboard/profile"
                                                                onClick={() => setMenuOpen(false)}
                                                                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                                                                role="menuitem"
                                                        >
                                                                <User size={18} />
                                                                Profile
                                                        </Link>

                                                        <Link
                                                                href="/dashboard/settings"
                                                                onClick={() => setMenuOpen(false)}
                                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                                                                role="menuitem"
                                                        >
                                                                <Settings size={18} />
                                                                Settings
                                                        </Link>

                                                        <button
                                                                type="button"
                                                                onClick={handleLogout}
                                                                disabled={logoutMutation.isPending}
                                                                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                                role="menuitem"
                                                        >
                                                                <LogOut size={18} />

                                                                {logoutMutation.isPending
                                                                        ? "Logging out..."
                                                                        : "Logout"}
                                                        </button>
                                                </div>
                                        )}
                                </div>
                        </div>
                </header>
        );
}
