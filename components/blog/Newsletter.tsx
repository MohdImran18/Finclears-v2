"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  NewsletterSchema,
  type NewsletterInput,
} from "@/validations/newsletter";

import { useNewsletter } from "@/hooks/useNewsletter";

export default function Newsletter() {
  const newsletter = useNewsletter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
        "Unable to subscribe."
      );

    }
  }

  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-14 shadow-2xl">

          <div className="mx-auto max-w-4xl text-center">

            <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">
              Newsletter
            </span>

            <h2 className="mt-8 text-5xl font-bold text-white">
              Stay Updated With
              <br />
              Business Insights
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-blue-100">
              Receive expert articles on Company
              Registration, GST, Trademark,
              Income Tax, Compliance and Startup
              Growth directly in your inbox.
            </p>

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 md:flex-row"
            >

              <div className="flex-1">

                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border-0 px-6 py-4 text-gray-900 outline-none"
                />

                {errors.email && (
                  <p className="mt-2 text-left text-sm text-red-200">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <button
                type="submit"
                disabled={
                  newsletter.isPending
                }
                className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100 disabled:opacity-60"
              >

                {newsletter.isPending
                  ? "Subscribing..."
                  : "Subscribe"}

              </button>

            </form>

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl bg-white/10 p-6">

                <div className="text-5xl">
                  📚
                </div>

                <h3 className="mt-4 text-xl font-bold text-white">
                  Weekly Articles
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6">

                <div className="text-5xl">
                  🚀
                </div>

                <h3 className="mt-4 text-xl font-bold text-white">
                  Startup Tips
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6">

                <div className="text-5xl">
                  ⚖️
                </div>

                <h3 className="mt-4 text-xl font-bold text-white">
                  Tax Updates
                </h3>

              </div>

            </div>

            <p className="mt-10 text-sm text-blue-100">
              No spam. Unsubscribe anytime.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
