"use client";

import { useState } from "react";

import NotificationActions from "@/components/dashboard/notifications/NotificationActions";
import NotificationCard from "@/components/dashboard/notifications/NotificationCard";
import NotificationFilter from "@/components/dashboard/notifications/NotificationFilter";
import NotificationHeader from "@/components/dashboard/notifications/NotificationHeader";
import NotificationList, {
        type Notification,
} from "@/components/dashboard/notifications/NotificationList";

const initialNotifications: Notification[] = [
        {
                id: 1,
                title: "GST Registration Approved",
                description: "Your GST registration has been approved.",
                time: "2 hours ago",
                read: false,
        },
        {
                id: 2,
                title: "Payment Received",
                description: "Payment for Invoice INV-1003 received.",
                time: "Yesterday",
                read: false,
        },
        {
                id: 3,
                title: "Document Verified",
                description: "PAN Card has been verified successfully.",
                time: "2 days ago",
                read: true,
        },
];

export default function NotificationsPage() {
        const [notifications, setNotifications] =
                useState<Notification[]>(initialNotifications);

        const [filter, setFilter] = useState<
                "all" | "unread" | "read"
        >("all");

        const unreadCount = notifications.filter(
                (notification) => !notification.read,
        ).length;

        const markAllRead = () => {
                setNotifications((current) =>
                        current.map((notification) => ({
                                ...notification,
                                read: true,
                        })),
                );
        };

        const markAsRead = (id: number) => {
                setNotifications((current) =>
                        current.map((notification) =>
                                notification.id === id
                                        ? { ...notification, read: true }
                                        : notification,
                        ),
                );
        };

        const clearAll = () => {
                setNotifications([]);
        };

        return (
                <div>
                        <div className="mb-8 flex items-center justify-between">
                                <h1 className="text-4xl font-bold">
                                        Notifications
                                </h1>

                                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                        {unreadCount}
                                </span>
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                                <NotificationActions
                                        onMarkAllRead={markAllRead}
                                        onClearAll={clearAll}
                                        hasNotifications={notifications.length > 0}
                                />

                                <NotificationFilter
                                        value={filter}
                                        onChange={setFilter}
                                />
                        </div>

                        <NotificationCard>
                                <NotificationList
                                        notifications={notifications}
                                        filter={filter}
                                        onMarkAsRead={markAsRead}
                                />
                        </NotificationCard>
                </div>
        );
}