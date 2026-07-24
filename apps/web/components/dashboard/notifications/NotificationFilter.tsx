"use client";

export default function NotificationFilter() {
  return (
    <select className="rounded-xl border p-3">
      <option>All</option>
      <option>Unread</option>
      <option>Read</option>
    </select>
  );
}
