"use client";

import NotificationItem from "./NotificationItem";

export interface Notification {
        id: number;
        title: string;
        description: string;
        time: string;
        read: boolean;
}

interface Props {
        notifications: Notification[];
        filter: "all" | "unread" | "read";
        onMarkAsRead: (id: number) => void;
}

export default function NotificationList({
        notifications,
        filter,
        onMarkAsRead,
}: Props) {
        const filteredNotifications = notifications.filter((notification) => {
                if (filter === "unread") {
                        return !notification.read;
                }

                if (filter === "read") {
                        return notification.read;
                }

                return true;
        });

        if (filteredNotifications.length === 0) {
                return (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">
                                No notifications found.
                        </div>
                );
        }

        return (
                <div className="space-y-5">
                        {filteredNotifications.map((notification) => (
                                <NotificationItem
                                        key={notification.id}
                                        {...notification}
                                        onRead={() =>
                                                onMarkAsRead(notification.id)
                                        }
                                />
                        ))}
                </div>
        );
}