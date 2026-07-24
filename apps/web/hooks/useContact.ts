"use client";

import { useMutation } from "@tanstack/react-query";
import { ContactApi } from "@/lib/api/contact";

export function useContact() {
  return useMutation({
    mutationFn: ContactApi.send,
  });
}
