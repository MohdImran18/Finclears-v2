"use client";

import { useQuery } from "@tanstack/react-query";

import { getBlogBySlug } from "@/services/blogs";
import type { Blog } from "@/types/blog";

export function useBlog(slug: string) {
  return useQuery<Blog>({
    queryKey: ["blog", slug],

    queryFn: () => getBlogBySlug(slug),

    enabled: !!slug,

    staleTime: 1000 * 60 * 5, // 5 minutes

    gcTime: 1000 * 60 * 30, // 30 minutes

    retry: 2,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: false,
  });
}
