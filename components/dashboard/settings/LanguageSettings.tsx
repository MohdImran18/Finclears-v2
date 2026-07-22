"use client";

export default function LanguageSettings() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Language
      </h2>

      <select className="w-full rounded-xl border p-4">
        <option>English</option>
        <option>Hindi</option>
      </select>

    </div>
  );
}
