"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search GST, Trademark, Company Registration...",
}: SearchBarProps) {
  return (
    <section className="bg-white py-10">

      <div className="container mx-auto px-6">

        <div className="mx-auto max-w-3xl">

          <div className="relative">

            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={value}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(e.target.value)
              }
              className="h-16 w-full rounded-2xl border border-slate-300 bg-white pl-14 pr-14 text-lg shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}

          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Search from Company Registration, GST,
            Trademark, ROC, Income Tax, Compliance and
            many more business services.
          </p>

        </div>

      </div>

    </section>
  );
}