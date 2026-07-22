"use client";

import { useQuery } from "@tanstack/react-query";

import { getFeaturedBlogs } from "@/services/blogs";

export function useFeaturedBlogs() {
  return useQuery({
    queryKey: ["featured-blogs"],

    queryFn: getFeaturedBlogs,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}
