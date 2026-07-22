"use client";

export default function PreferenceSettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Preferences
      </h2>

      <select className="w-full rounded-xl border p-4">
        <option>India</option>
        <option>UAE</option>
        <option>USA</option>
      </select>

    </div>
  );
}
