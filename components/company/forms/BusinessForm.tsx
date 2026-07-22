"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { companySchema } from "@/validators/company";
import { useCompanyWizard } from "@/hooks/useCompanyWizard";

import type { CreateCompanyRequest } from "@/types/company";

interface BusinessFormProps {
  onNext: () => void;
}

export default function BusinessForm({
  onNext,
}: BusinessFormProps) {
  const {
    data,
    updateData,
  } = useCompanyWizard();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateCompanyRequest>({
    resolver: zodResolver(companySchema),
    defaultValues: data as CreateCompanyRequest,
  });

  useEffect(() => {
    reset(data as CreateCompanyRequest);
  }, [data, reset]);

  function submit(values: CreateCompanyRequest) {
    updateData(values);
    onNext();
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Name
          </label>

          <input
            {...register("company_name")}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-600">
            {errors.company_name?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Service Type
          </label>

          <select
            {...register("service_type")}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Service
            </option>

            <option value="private_limited">
              Private Limited
            </option>

            <option value="llp">
              LLP Registration
            </option>

            <option value="opc">
              One Person Company
            </option>

            <option value="section8">
              Section 8 Company
            </option>

            <option value="foreign_company">
              Foreign Company
            </option>
          </select>

          <p className="mt-1 text-sm text-red-600">
            {errors.service_type?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Type
          </label>

          <input
            {...register("company_type")}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-600">
            {errors.company_type?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Business Activity
          </label>

          <input
            {...register("business_activity")}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Authorized Capital
          </label>

          <input
            type="number"
            {...register("authorized_capital", {
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-600">
            {errors.authorized_capital?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Paid-up Capital
          </label>

          <input
            type="number"
            {...register("paid_up_capital", {
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-600">
            {errors.paid_up_capital?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            State
          </label>

          <input
            {...register("state")}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-lg border p-3"
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Address
        </label>

        <textarea
          {...register("address")}
          rows={4}
          className="w-full rounded-lg border p-3"
        />

        <p className="mt-1 text-sm text-red-600">
          {errors.address?.message}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            PIN Code
          </label>

          <input
            {...register("pin_code")}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-600">
            {errors.pin_code?.message}
          </p>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
