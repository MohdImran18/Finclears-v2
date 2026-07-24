"use client";

import { useQuery } from "@tanstack/react-query";

import { getBlogCategories } from "@/services/blogs";

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],

    queryFn: getBlogCategories,

    staleTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
  });
}
