"use client";

import { useState } from "react";
import {
  Eye,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import type { Document } from "@/types/document";

import PreviewDocumentDialog from "@/components/documents/PreviewDocumentDialog";
import DeleteDocumentDialog from "@/components/documents/DeleteDocumentDialog";
import ReplaceDocumentDialog from "@/components/documents/ReplaceDocumentDialog";

import {
  downloadDocument,
} from "@/services/documents/document.service";

interface Props {
  document: Document;
}

export default function DocumentActions({
  document: doc,
}: Props) {

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [replaceOpen, setReplaceOpen] =
    useState(false);

  async function handleDownload() {

    try {

      const blob =
        await downloadDocument(doc.id);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = url;

      link.download =
        doc.file_name;

      window.document.body.appendChild(link);

      link.click();

      window.document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        "Download started."
      );

    } catch {

      toast.error(
        "Unable to download document."
      );

    }

  }

  return (

    <>

      <div className="flex items-center justify-end gap-2">

        {/* Preview */}

        <button
          type="button"
          onClick={() =>
            setPreviewOpen(true)
          }
          className="rounded-lg border p-2 transition hover:bg-slate-100"
          title="Preview"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Download */}

        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border p-2 transition hover:bg-slate-100"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </button>

        {/* Replace */}

        <button
          type="button"
          onClick={() =>
            setReplaceOpen(true)
          }
          className="rounded-lg border p-2 transition hover:bg-slate-100"
          title="Replace Document"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        {/* Delete */}

        <button
          type="button"
          onClick={() =>
            setDeleteOpen(true)
          }
          className="rounded-lg border p-2 text-red-600 transition hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </div>

      <PreviewDocumentDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        document={doc}
      />

      <ReplaceDocumentDialog
        open={replaceOpen}
        onOpenChange={setReplaceOpen}
        documentId={doc.id}
        documentTitle={doc.title}
      />

      <DeleteDocumentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        documentId={doc.id}
        documentTitle={doc.title}
      />

    </>

  );

}