"use client";

import { useState } from "react";

import {
  Upload,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  useUpdateDocument,
} from "@/hooks/useDocuments";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  documentId: number;

  documentTitle: string;
}

export default function ReplaceDocumentDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: Props) {

  const updateMutation =
    useUpdateDocument();

  const [file, setFile] =
    useState<File>();

  async function handleSubmit() {

    if (!file) {
      toast.error(
        "Please select a file."
      );
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      await updateMutation.mutateAsync({

        id: documentId,

        data: formData,

      });

      toast.success(
        "Document replaced successfully."
      );

      setFile(undefined);

      onOpenChange(false);

    } catch {

      toast.error(
        "Unable to replace document."
      );

    }

  }

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle>

            Replace Document

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <p className="font-medium">

              {documentTitle}

            </p>

            <p className="text-sm text-slate-500">

              Upload a newer version of this document.

            </p>

          </div>

          <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed py-10">

            <Upload className="mb-3 h-8 w-8 text-blue-600" />

            <p>

              Click to choose a new file

            </p>

            <input
              hidden
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0]
                )
              }
            />

          </label>

          {file && (

            <div className="rounded-lg border bg-slate-50 p-4">

              {file.name}

            </div>

          )}

        </div>

        <DialogFooter>

          <button
            onClick={() =>
              onOpenChange(false)
            }
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              updateMutation.isPending
            }
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white"
          >

            {updateMutation.isPending ? (

              <>

                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />

                Uploading...

              </>

            ) : (

              "Replace"

            )}

          </button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}