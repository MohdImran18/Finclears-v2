"use client";

import { useQuery } from "@tanstack/react-query";
import { BlogApi } from "@/lib/api/blogs";

export function useRelatedBlogs(slug: string) {
  return useQuery({
    queryKey: ["related-blogs", slug],
    queryFn: () => BlogApi.getRelated(slug),
    enabled: !!slug,
  });
}
