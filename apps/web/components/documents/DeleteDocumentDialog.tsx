"use client";

import {
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteDocument } from "@/hooks/useDocuments";

interface DeleteDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: number;
  documentTitle?: string;
}

export default function DeleteDocumentDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: DeleteDocumentDialogProps) {
  const deleteMutation = useDeleteDocument();

  if (!open) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(documentId);

      toast.success(
        "Document deleted successfully."
      );

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to delete document."
      );
    }
  }

  return (
    <AlertDialog>

      <AlertDialogContent className="max-w-md">

        <AlertDialogHeader>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

            <AlertTriangle className="h-8 w-8 text-red-600" />

          </div>

          <AlertDialogTitle className="text-center text-2xl">
            Delete Document?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-base">

            {documentTitle ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  "{documentTitle}"
                </span>
                ?
                <br />
                This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete this
                document?
                <br />
                This action cannot be undone.
              </>
            )}

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

         <AlertDialogCancel
  isDisabled={deleteMutation.isPending}
  onClick={() =>
    onOpenChange(false)
  }
>
            Cancel
          </AlertDialogCancel>

         <AlertDialogAction
  isDisabled={deleteMutation.isPending}
  className="bg-red-600 hover:bg-red-700"
  onClick={async (e) => {
              e.preventDefault();
              await handleDelete();
            }}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Document"
            )}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}