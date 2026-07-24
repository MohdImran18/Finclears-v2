"use client";

import { useQuery } from "@tanstack/react-query";
import { ServiceApi } from "@/lib/api/services";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: ServiceApi.getAll,
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ["services", "featured"],
    queryFn: ServiceApi.getFeatured,
  });
}