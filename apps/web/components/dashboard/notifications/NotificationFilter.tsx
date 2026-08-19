"use client";

interface Props {
        value: "all" | "unread" | "read";
        onChange: (value: "all" | "unread" | "read") => void;
}

export default function NotificationFilter({
        value,
        onChange,
}: Props) {
        return (
                <select
                        value={value}
                        onChange={(event) =>
                                onChange(
                                        event.target.value as
                                                | "all"
                                                | "unread"
                                                | "read",
                                )
                        }
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                >
                        <option value="all">All</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                </select>
        );
}