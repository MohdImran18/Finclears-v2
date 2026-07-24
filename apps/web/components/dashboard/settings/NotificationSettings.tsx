"use client";

export default function NotificationSettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Notifications
      </h2>

      <label className="flex items-center justify-between py-3">
        <span>Email Notifications</span>
        <input type="checkbox" defaultChecked />
      </label>

      <label className="flex items-center justify-between py-3">
        <span>SMS Notifications</span>
        <input type="checkbox" />
      </label>

      <label className="flex items-center justify-between py-3">
        <span>WhatsApp Notifications</span>
        <input type="checkbox" defaultChecked />
      </label>

    </div>
  );
}
