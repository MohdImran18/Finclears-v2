"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DocumentType } from "@/types/document";

import DocumentDropzone from "@/components/documents/DocumentDropzone";

import {
  useUploadDocument,
} from "@/hooks/useDocuments";


const DOCUMENT_TYPES: {
  label: string;
  value: DocumentType;
}[] = [
  { label: "PAN Card", value: "pan" },
  { label: "Aadhaar Card", value: "aadhaar" },
  { label: "Passport", value: "passport" },
  { label: "Photo", value: "photo" },
  {
    label: "Driving License",
    value: "driving_license",
  },
  {
    label: "Electricity Bill",
    value: "electricity_bill",
  },
  {
    label: "Bank Statement",
    value: "bank_statement",
  },
  {
    label: "Cancelled Cheque",
    value: "cancelled_cheque",
  },
  {
    label: "GST Certificate",
    value: "gst_certificate",
  },
  {
    label: "IEC Certificate",
    value: "iec_certificate",
  },
  {
    label: "Incorporation Certificate",
    value: "incorporation_certificate",
  },
  {
    label: "MOA",
    value: "moa",
  },
  {
    label: "AOA",
    value: "aoa",
  },
  {
    label: "SPICe+",
    value: "spice_plus",
  },
  {
    label: "INC-9",
    value: "inc9",
  },
  {
    label: "AGILE",
    value: "agile",
  },
  {
    label: "Financial Statement",
    value: "financial_statement",
  },
  {
    label: "Income Tax Return",
    value: "itr",
  },
  {
    label: "Trademark Certificate",
    value: "trademark_certificate",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default function UploadDocumentPage() {

  const router = useRouter();

  const uploadMutation =
    useUploadDocument();

  const [title, setTitle] =
    useState("");

  const [
    documentType,
    setDocumentType,
  ] =
    useState<DocumentType>("pan");

  const [remarks, setRemarks] =
    useState("");

  const [
    companyId,
    setCompanyId,
  ] = useState<number>();

  const [
    orderId,
    setOrderId,
  ] = useState<number>();

  const [file, setFile] =
    useState<File | null>(null);

  async function onSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!title.trim()) {

      toast.error(
        "Document title is required."
      );

      return;

    }

    if (!file) {

      toast.error(
        "Please select a document."
      );

      return;

    }

    try {

      await uploadMutation.mutateAsync({

        title,

        document_type:
          documentType,

        company_id:
          companyId,

        order_id:
          orderId,

        remarks,

        file,

      });

      toast.success(
        "Document uploaded successfully."
      );

      router.push(
        "/dashboard/documents"
      );

    } catch {

      toast.error(
        "Unable to upload document."
      );

    }

  }

  return (

    <div className="mx-auto max-w-4xl">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Upload Document

        </h1>

        <p className="mt-2 text-slate-500">

          Upload documents for your
          company or order.

        </p>

      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border bg-white p-8"
      >

        <div>

          <label className="mb-2 block font-medium">

            Document Title

          </label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="PAN Card"
            className="w-full rounded-xl border px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Document Type

          </label>

          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(
                e.target.value as DocumentType
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >

            {DOCUMENT_TYPES.map((item) => (

              <option
                key={item.value}
                value={item.value}
              >

                {item.label}

              </option>

            ))}

          </select>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">

              Company ID

            </label>

            <input
              type="number"
              value={companyId ?? ""}
              onChange={(e) =>
                setCompanyId(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Order ID

            </label>

            <input
              type="number"
              value={orderId ?? ""}
              onChange={(e) =>
                setOrderId(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Remarks

          </label>

          <textarea
            rows={4}
            value={remarks}
            onChange={(e) =>
              setRemarks(
                e.target.value
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          />
                  </div>

        {/* Upload Document */}

        <div>

          <label className="mb-2 block font-medium">

            Upload Document

          </label>

          <DocumentDropzone
            file={file}
            onChange={setFile}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            maxSize={10 * 1024 * 1024}
          />

        </div>

        {/* Action Buttons */}

        <div className="flex justify-end gap-4 pt-4">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
          >

            Cancel

          </button>

          <button
            type="submit"
            disabled={
              uploadMutation.isPending
            }
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {uploadMutation.isPending
              ? "Uploading..."
              : "Upload Document"}

          </button>

        </div>

      </form>

    </div>

  );

}