"use client";

import { useState } from "react";

import { useBlogCategories } from "@/hooks/useBlogCategories";

import type { BlogCategory } from "@/types/blogCategory";

export default function CategoryFilter() {
  const [active, setActive] = useState<string>("all");

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useBlogCategories();

  if (isLoading) {
    return (
      <section className="bg-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <p className="text-gray-500">
              Loading categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4">

          {/* All */}

          <button
            type="button"
            onClick={() => setActive("all")}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              active === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-200 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600"
            }`}
          >
            All
          </button>

          {/* API Categories */}

          {categories.map((category: BlogCategory) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.slug)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                active === category.slug
                  ? "bg-blue-600 text-white shadow-lg"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {category.name}
            </button>
          ))}

        </div>
      </div>
    </section>
  );
}
