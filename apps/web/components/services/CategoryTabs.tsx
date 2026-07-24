"use client";

import { useMemo } from "react";

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface CategoryTabsProps {
  categories: ServiceCategory[];
  activeCategory: string;
  onChange: (slug: string) => void;
}

const DEFAULT_CATEGORY: ServiceCategory = {
  id: 0,
  name: "All Services",
  slug: "all",
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onChange,
}: CategoryTabsProps) {
  const tabs = useMemo(
    () => [DEFAULT_CATEGORY, ...categories],
    [categories]
  );

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container mx-auto px-6 py-5">

        <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">

          {tabs.map((category) => {
            const active =
              activeCategory === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChange(category.slug)}
                className={[
                  "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600",
                ].join(" ")}
              >
                {category.icon && (
                  <span className="mr-2">
                    {category.icon}
                  </span>
                )}

                {category.name}
              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
}