"use client";

import { Button } from "@/components/ui/button";

interface Props {
        onMarkAllRead: () => void;
        onClearAll: () => void;
        hasNotifications: boolean;
}

export default function NotificationActions({
        onMarkAllRead,
        onClearAll,
        hasNotifications,
}: Props) {
        return (
                <div className="mb-6 flex gap-4">
                        <Button
                                type="button"
                                onClick={onMarkAllRead}
                                disabled={!hasNotifications}
                        >
                                Mark All Read
                        </Button>

                        <Button
                                type="button"
                                onClick={onClearAll}
                                disabled={!hasNotifications}
                                variant="outline"
                        >
                                Clear All
                        </Button>
                </div>
        );
}