"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useContact } from "@/hooks/useContact";

type HeroLeadFormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
};

export default function HeroLeadForm() {
  const router = useRouter();

  const contact = useContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<HeroLeadFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
    },
  });

  async function onSubmit(values: HeroLeadFormValues) {
    try {
      await contact.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: "Homepage Lead",
        message: `Interested Service: ${values.service}`,
        source: "Homepage Hero",
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
    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

      <h3 className="text-2xl font-bold">
        Get Started Today
      </h3>

      <p className="mt-2 text-gray-500">
        Free Business Consultation
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >

        <div>

          <input
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="Full Name"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}

        </div>

        <div>

          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            placeholder="Email Address"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

        </div>

        <div>

          <input
            {...register("phone", {
              required: "Mobile number is required",
            })}
            placeholder="Mobile Number"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}

        </div>

        <div>

          <select
            {...register("service", {
              required: "Please select a service",
            })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="">
              Select Service
            </option>

            <option value="Private Limited Company">
              Private Limited Company
            </option>

            <option value="LLP Registration">
              LLP Registration
            </option>

            <option value="GST Registration">
              GST Registration
            </option>

            <option value="Trademark Registration">
              Trademark Registration
            </option>

            <option value="ITR Filing">
              ITR Filing
            </option>

          </select>

          {errors.service && (
            <p className="mt-1 text-sm text-red-600">
              {errors.service.message}
            </p>
          )}

        </div>

        <button
          type="submit"
          disabled={contact.isPending}
          className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {contact.isPending
            ? "Submitting..."
            : "Get Free Consultation"}
        </button>

      </form>

    </div>
  );
}