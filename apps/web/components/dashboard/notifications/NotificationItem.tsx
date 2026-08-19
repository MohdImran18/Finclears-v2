"use client";

interface Props {
        title: string;
        description: string;
        time: string;
        read: boolean;
        onRead: () => void;
}

export default function NotificationItem({
        title,
        description,
        time,
        read,
        onRead,
}: Props) {
        return (
                <div
                        className={`rounded-xl border p-5 shadow-sm transition ${
                                read
                                        ? "bg-white"
                                        : "border-blue-200 bg-blue-50/40"
                        }`}
                >
                        <div className="flex items-start justify-between gap-4">
                                <div>
                                        <div className="flex items-center gap-2">
                                                {!read && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                                )}

                                                <h3 className="font-semibold">
                                                        {title}
                                                </h3>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-600">
                                                {description}
                                        </p>

                                        <div className="mt-4 text-xs text-slate-400">
                                                {time}
                                        </div>
                                </div>

                                {!read && (
                                        <button
                                                type="button"
                                                onClick={onRead}
                                                className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                                Mark as read
                                        </button>
                                )}
                        </div>
                </div>
        );
}