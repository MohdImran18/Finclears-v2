"use client";

import { useQuery } from "@tanstack/react-query";

import { searchBlogs } from "@/services/blogs";

export function useSearchBlogs(
  keyword: string
) {
  return useQuery({

    queryKey: [
      "blogs-search",
      keyword,
    ],

    queryFn: () =>
      searchBlogs(keyword),

    enabled: keyword.length > 1,

    staleTime: 1000 * 60 * 5,

  });
}
