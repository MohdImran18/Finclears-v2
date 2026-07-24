"use client";

import { useState } from "react";

import DocumentUploader, {
  UploadDocument,
} from "./DocumentUploader";

interface Props {
  next: () => void;
  previous: () => void;
}

export default function DocumentsStep({
  next,
  previous,
}: Props) {
  const [documents, setDocuments] =
    useState<UploadDocument[]>([]);

  function submit() {
    // TODO:
    // Save documents in wizard store
    next();
  }

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">
        Upload Documents
      </h2>

      <DocumentUploader
        documents={documents}
        onChange={setDocuments}
      />

      <div className="flex justify-between">

        <button
          onClick={previous}
          className="rounded-lg border px-6 py-3"
        >
          Previous
        </button>

        <button
          onClick={submit}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Continue
        </button>

      </div>

    </div>
  );
}
