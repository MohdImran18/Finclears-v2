"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import DocumentViewer from "@/components/documents/DocumentViewer";

import type { Document } from "@/types/document";

interface PreviewDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

export default function PreviewDocumentDialog({
  open,
  onOpenChange,
  document,
}: PreviewDocumentDialogProps) {

  if (!open) {
    return null;
  }

  return (
    <Dialog>

      <DialogContent className="max-h-[95vh] max-w-7xl overflow-y-auto">

        <DialogHeader>

          <DialogTitle>
            Document Preview
          </DialogTitle>

        </DialogHeader>

        {document ? (

          <DocumentViewer
            document={document}
          />

        ) : (

          <div className="py-20 text-center text-slate-500">
            No document selected.
          </div>

        )}

        <DialogFooter>

          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
          >
            Close
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}