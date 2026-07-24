"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { useNewsletter } from "@/hooks/useNewsletter";

import {
  NewsletterSchema,
  type NewsletterInput,
} from "@/validations/newsletter";

export default function NewsletterForm() {
  const newsletter = useNewsletter();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(
      NewsletterSchema
    ),
  });

  async function onSubmit(
    values: NewsletterInput
  ) {
    try {

      await newsletter.mutateAsync(
        values.email
      );

      alert(
        "Thank you for subscribing!"
      );

      reset();

    } catch {

      alert(
        "Unable to subscribe. Please try again."
      );

    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 sm:flex-row"
    >

      <div className="flex-1">

        <input
          type="email"
          placeholder="Enter your email address"
          {...register("email")}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-600"
        />

        {errors.email && (
          <p className="mt-2 text-left text-sm text-red-200">
            {errors.email.message}
          </p>
        )}

      </div>

      <Button
        type="submit"
        disabled={newsletter.isPending}
        className="min-w-[170px]"
      >
        {newsletter.isPending
          ? "Subscribing..."
          : "Subscribe"}
      </Button>

    </form>
  );
}
