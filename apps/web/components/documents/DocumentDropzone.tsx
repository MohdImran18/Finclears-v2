"use client";

import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  file?: File | null;

  onChange: (file: File | null) => void;

  accept?: string;

  maxSize?: number;
}

export default function DocumentDropzone({
  file,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSize = 10 * 1024 * 1024,
}: Props) {
  function validate(selected: File) {
    if (selected.size > maxSize) {
      toast.error(
        "Maximum file size is 10 MB."
      );

      return false;
    }

    return true;
  }

  function handleFile(
    selected?: File
  ) {
    if (!selected) return;

    if (!validate(selected)) {
      return;
    }

    onChange(selected);
  }

  return (
    <div className="space-y-4">

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 transition hover:border-blue-500 hover:bg-blue-50">

        <Upload className="mb-4 h-10 w-10 text-blue-600" />

        <p className="font-medium">
          Drag & Drop your document
        </p>

        <p className="mt-2 text-sm text-slate-500">
          or click to browse
        </p>

        <input
          hidden
          type="file"
          accept={accept}
          onChange={(e) =>
            handleFile(
              e.target.files?.[0]
            )
          }
        />

      </label>

      {file && (

        <div className="flex items-center justify-between rounded-xl border bg-white p-4">

          <div className="flex items-center gap-3">

            <FileText className="h-8 w-8 text-blue-600" />

            <div>

              <p className="font-medium">
                {file.name}
              </p>

              <p className="text-sm text-slate-500">
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="rounded-lg p-2 hover:bg-red-50"
          >
            <X className="h-5 w-5 text-red-600" />
          </button>

        </div>

      )}

    </div>
  );
}