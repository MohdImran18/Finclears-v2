"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Notification {
        id: number;
        title: string;
        description: string;
        time: string;
        read: boolean;
        href?: string;
}

const notifications: Notification[] = [
        {
                id: 1,
                title: "GST Registration Approved",
                description: "Your GST registration has been approved.",
                time: "2 hours ago",
                read: false,
                href: "/dashboard/orders",
        },
        {
                id: 2,
                title: "Payment Received",
                description: "Payment for Invoice INV-1003 received.",
                time: "Yesterday",
                read: false,
                href: "/dashboard/payments",
        },
        {
                id: 3,
                title: "Document Verified",
                description: "PAN Card has been verified successfully.",
                time: "2 days ago",
                read: true,
                href: "/dashboard/documents",
        },
];

export default function NotificationBell() {
        const [open, setOpen] = useState(false);
        const [items, setItems] = useState(notifications);
        const containerRef = useRef<HTMLDivElement>(null);

        const unreadCount = items.filter(
                (notification) => !notification.read,
        ).length;

        useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                        if (
                                containerRef.current &&
                                !containerRef.current.contains(
                                        event.target as Node,
                                )
                        ) {
                                setOpen(false);
                        }
                };

                document.addEventListener("mousedown", handleClickOutside);

                return () => {
                        document.removeEventListener(
                                "mousedown",
                                handleClickOutside,
                        );
                };
        }, []);

        const markAsRead = (id: number) => {
                setItems((current) =>
                        current.map((notification) =>
                                notification.id === id
                                        ? {
                                                  ...notification,
                                                  read: true,
                                          }
                                        : notification,
                        ),
                );
        };

        return (
                <div ref={containerRef} className="relative">
                        <button
                                type="button"
                                aria-label="Notifications"
                                aria-expanded={open}
                                onClick={() => setOpen((current) => !current)}
                                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                >
                                        <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18.75 10.5c0 3.142.75 4.5 1.5 5.25H3.75c.75-.75 1.5-2.108 1.5-5.25a6.75 6.75 0 1 1 13.5 0Z"
                                        />
                                </svg>

                                {unreadCount > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                                {unreadCount > 9
                                                        ? "9+"
                                                        : unreadCount}
                                        </span>
                                )}
                        </button>

                        {open && (
                                <div className="absolute right-0 z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b px-5 py-4">
                                                <div>
                                                        <h3 className="font-semibold text-slate-900">
                                                                Notifications
                                                        </h3>

                                                        <p className="text-xs text-slate-500">
                                                                {unreadCount}{" "}
                                                                unread
                                                        </p>
                                                </div>

                                                <Link
                                                        href="/dashboard/notifications"
                                                        onClick={() =>
                                                                setOpen(false)
                                                        }
                                                        className="text-xs font-medium text-blue-600 hover:underline"
                                                >
                                                        View all
                                                </Link>
                                        </div>

                                        <div className="max-h-[360px] overflow-y-auto">
                                                {items
                                                        .slice(0, 3)
                                                        .map(
                                                                (
                                                                        notification,
                                                                ) => (
                                                                        <Link
                                                                                key={
                                                                                        notification.id
                                                                                }
                                                                                href={
                                                                                        notification.href ??
                                                                                        "/dashboard/notifications"
                                                                                }
                                                                                onClick={() => {
                                                                                        markAsRead(
                                                                                                notification.id,
                                                                                        );
                                                                                        setOpen(
                                                                                                false,
                                                                                        );
                                                                                }}
                                                                                className={`block border-b px-5 py-4 transition hover:bg-slate-50 ${
                                                                                        !notification.read
                                                                                                ? "bg-blue-50/40"
                                                                                                : "bg-white"
                                                                                }`}
                                                                        >
                                                                                <div className="flex gap-3">
                                                                                        <span
                                                                                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                                                                        notification.read
                                                                                                                ? "bg-slate-300"
                                                                                                                : "bg-blue-600"
                                                                                                }`}
                                                                                        />

                                                                                        <div className="min-w-0">
                                                                                                <p className="text-sm font-semibold text-slate-900">
                                                                                                        {
                                                                                                                notification.title
                                                                                                        }
                                                                                                </p>

                                                                                                <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                                                                                                        {
                                                                                                                notification.description
                                                                                                        }
                                                                                                </p>

                                                                                                <p className="mt-2 text-[11px] text-slate-400">
                                                                                                        {
                                                                                                                notification.time
                                                                                                        }
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </Link>
                                                                ),
                                                        )}
                                        </div>

                                        <div className="border-t bg-slate-50 px-5 py-3">
                                                <Link
                                                        href="/dashboard/notifications"
                                                        onClick={() =>
                                                                setOpen(false)
                                                        }
                                                        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                        View all notifications
                                                </Link>
                                        </div>
                                </div>
                        )}
                </div>
        );
}