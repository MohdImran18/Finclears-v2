"use client";

export default function ThemeSettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Theme
      </h2>

      <select className="w-full rounded-xl border p-4">
        <option>Light</option>
        <option>Dark</option>
        <option>System</option>
      </select>

    </div>
  );
}
