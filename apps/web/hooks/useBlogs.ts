"use client";

import { useQuery } from "@tanstack/react-query";

import { getBlogs } from "@/services/blogs";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],

    queryFn: getBlogs,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}
