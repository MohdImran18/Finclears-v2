"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ChevronDown,
  UserRound,
  LogOut,
  ShieldCheck,
  Building2,
} from "lucide-react";

import { useAuth } from "@/lib/auth/AuthProvider";

function getInitials(name?: string | null) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatRole(role?: string | null) {
  if (!role) return "User";

  return role
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminHeader() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const roleValues = [
    user?.role,
    ...(user?.spatie_roles || []),
  ].filter(Boolean);

  const isSuperAdmin = roleValues.some((role) =>
    typeof role === "string" &&
    ["super_admin", "super-admin"].includes(role.toLowerCase())
  );

  const primaryRole = isSuperAdmin
    ? "Super Admin"
    : user?.spatie_roles?.[0] || user?.role || "user";
  const designation = user?.employee_profile?.designation?.name;
  const department = user?.employee_profile?.department?.name;

  const profileSubtitle = [
    designation,
    department,
  ].filter(Boolean).join(" Ã¢â‚¬Â¢ ") || formatRole(primaryRole);

  function handleLogout() {
    setProfileOpen(false);
    logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="adminHeader">
      <div className="headerSearch">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search leads, customers, services..."
        />
        <kbd>Ã¢Å’Ëœ K</kbd>
      </div>

      <div className="headerRight">
        <button
          type="button"
          className="headerIconButton"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notificationDot" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="profile cursor-pointer rounded-xl border border-transparent px-2 py-1.5 transition hover:border-slate-200 hover:bg-slate-50"
          >
            <div className="profileAvatar">
              {loading ? "..." : getInitials(user?.name)}
            </div>

            <div className="profileInfo text-left">
              <strong>{loading ? "Loading..." : user?.name || "User"}</strong>
              <span>{loading ? "Please wait" : profileSubtitle}</span>
            </div>

            <ChevronDown
              size={15}
              className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
            >
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800">
                    {getInitials(user?.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-4 py-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Account role
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatRole(primaryRole)}
                    </p>
                  </div>
                </div>

                {(designation || department) && (
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Work information
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[designation, department].filter(Boolean).join(" Ã¢â‚¬Â¢ ")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Account status
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-slate-500">
                      {user?.status || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
