"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const pages = [
  "Private Limited Company",
  "GST Registration",
  "Trademark Registration",
  "Income Tax Return",
  "LLP Registration",
  "FSSAI License",
  "Import Export Code",
];

export default function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", key);

    return () => window.removeEventListener("keydown", key);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/40 pt-28 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex items-center gap-3 rounded-2xl border px-5">

          <Search />

          <input
            autoFocus
            placeholder="Search services..."
            className="h-14 w-full outline-none"
          />

        </div>

        <div className="mt-8 space-y-2">

          {pages.map((item) => (

            <button
              key={item}
              className="flex w-full rounded-xl px-5 py-4 text-left transition hover:bg-slate-100"
            >
              {item}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}
