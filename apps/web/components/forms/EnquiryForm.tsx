"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  ContactSchema,
  type ContactInput,
} from "@/validations/contact";

import { useContact } from "@/hooks/useContact";

interface EnquiryFormProps {
  source?: string;
  title?: string;
  description?: string;
}

export default function EnquiryForm({
  source = "Website",
  title = "Tell Us About Your Requirement",
  description = "Fill out the form and one of our business experts will contact you shortly.",
}: EnquiryFormProps) {

  const router = useRouter();

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

  async function onSubmit(values: ContactInput) {

    try {

      await contact.mutateAsync({
        ...values,
        source,
      } as any);

      toast.success(
        "Thank you! Our expert will contact you shortly."
      );

      reset();

      router.push("/thank-you");

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
        "Unable to submit your enquiry."
      );

    }

  }

  return (

    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Free Consultation
              </span>

              <h2 className="mt-4 text-5xl font-bold text-gray-900">
                {title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {description}
              </p>

            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >

                <input
                  {...register("name")}
                  placeholder="Full Name"
                  className="w-full rounded-xl border px-5 py-4"
                />

                {errors.name && (
                  <p className="text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}

                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email Address"
                  className="w-full rounded-xl border px-5 py-4"
                />

                {errors.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}

                <input
                  {...register("phone")}
                  placeholder="Mobile Number"
                  className="w-full rounded-xl border px-5 py-4"
                />

                <input
                  {...register("subject")}
                  placeholder="Subject"
                  className="w-full rounded-xl border px-5 py-4"
                />

                {errors.subject && (
                  <p className="text-sm text-red-600">
                    {errors.subject.message}
                  </p>
                )}

                <textarea
                  rows={5}
                  {...register("message")}
                  placeholder="Tell us about your requirement..."
                  className="w-full rounded-xl border px-5 py-4"
                />

                {errors.message && (
                  <p className="text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}

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