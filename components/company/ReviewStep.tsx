"use client";

import { toast } from "sonner";

import { useCompanyWizard } from "@/hooks/useCompanyWizard";
import { useCreateCompany } from "@/hooks/useCompanies";

interface Props {
  previous: () => void;
}

export default function ReviewStep({
  previous,
}: Props) {
  const { data, reset } =
    useCompanyWizard();

  const mutation =
    useCreateCompany();

  async function submit() {
    try {
      await mutation.mutateAsync(data as any);

      toast.success(
        "Company Registration Submitted Successfully."
      );

      reset();

    } catch {
      toast.error(
        "Submission Failed."
      );
    }
  }

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold">
        Review
      </h2>

      <div className="rounded-xl border p-6">

        <p>
          <strong>Company:</strong>{" "}
          {data.company_name}
        </p>

        <p>
          <strong>Type:</strong>{" "}
          {data.company_type}
        </p>

        <p>
          <strong>State:</strong>{" "}
          {data.state}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {data.city}
        </p>

      </div>

      <div className="flex justify-between">

        <button
          onClick={previous}
          className="rounded-lg border px-6 py-3"
        >
          Previous
        </button>

        <button
          onClick={submit}
          disabled={mutation.isPending}
          className="rounded-lg bg-green-600 px-6 py-3 text-white"
        >
          {mutation.isPending
            ? "Submitting..."
            : "Submit Registration"}
        </button>

      </div>

    </div>
  );
}
