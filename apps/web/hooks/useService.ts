"use client";

import { useQuery } from "@tanstack/react-query";
import { ServiceApi } from "@/lib/api/services";

export function useService(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: () => ServiceApi.getBySlug(slug),
    enabled: !!slug,
  });
}
