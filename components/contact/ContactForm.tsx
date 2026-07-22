"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ContactSchema,
  type ContactInput,
} from "@/validations/contact";

import { useContact } from "@/hooks/useContact";

export default function ContactForm() {
  const contact = useContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(
    values: ContactInput
  ) {
    try {
      await contact.mutateAsync(values);

      alert(
        "Thank you! We'll contact you shortly."
      );

      reset();
    } catch {
      alert(
        "Unable to submit your request."
      );
    }
  }

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Free Consultation
              </span>

              <h2 className="mt-4 text-5xl font-bold text-gray-900">
                Tell Us About
                <br />
                Your Requirement
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Fill out the form and one of our business
                experts will contact you shortly.
              </p>

            </div>

            {/* Right */}

            <div className="rounded-3xl border bg-white p-8 shadow-xl">

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >

                <div>

                  <input
                    {...register("name")}
                    placeholder="Full Name"
                    className="w-full rounded-xl border px-5 py-4"
                  />

                  <p className="mt-1 text-sm text-red-500">
                    {errors.name?.message}
                  </p>

                </div>

                <div>

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full rounded-xl border px-5 py-4"
                  />

                  <p className="mt-1 text-sm text-red-500">
                    {errors.email?.message}
                  </p>

                </div>

                <div>

                  <input
                    {...register("phone")}
                    placeholder="Mobile Number"
                    className="w-full rounded-xl border px-5 py-4"
                  />

                </div>

                <div>

                  <input
                    {...register("subject")}
                    placeholder="Subject"
                    className="w-full rounded-xl border px-5 py-4"
                  />

                  <p className="mt-1 text-sm text-red-500">
                    {errors.subject?.message}
                  </p>

                </div>

                <div>

                  <textarea
                    rows={5}
                    {...register("message")}
                    placeholder="Tell us about your requirement..."
                    className="w-full rounded-xl border px-5 py-4"
                  />

                  <p className="mt-1 text-sm text-red-500">
                    {errors.message?.message}
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={contact.isPending}
                  className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {contact.isPending
                    ? "Submitting..."
                    : "Request Free Consultation"}
                </button>

              </form>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
