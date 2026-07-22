"use client";

import { useMutation } from "@tanstack/react-query";

import NewsletterApi from "@/lib/api/newsletter";

import type {
  NewsletterSubscriber,
} from "@/types/newsletter";

export function useNewsletter() {
  return useMutation<
    NewsletterSubscriber,
    Error,
    string
  >({
    mutationFn: (
      email: string
    ) => NewsletterApi.subscribe(email),

    onSuccess: () => {
      console.log(
        "Newsletter subscribed successfully."
      );
    },

    onError: (error) => {
      console.error(
        "Newsletter subscription failed.",
        error
      );
    },
  });
}
