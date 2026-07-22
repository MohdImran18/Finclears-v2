"use client";

import { useRef, useState } from "react";

export interface UploadDocument {
  id: string;
  name: string;
  file: File;
  size: number;
}

interface Props {
  documents: UploadDocument[];
  onChange: (documents: UploadDocument[]) => void;
}

export default function DocumentUploader({
  documents,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const uploaded: UploadDocument[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      file,
      size: file.size,
    }));

    onChange([...documents, ...uploaded]);
  }

  function remove(id: string) {
    onChange(documents.filter((doc) => doc.id !== id));
  }

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border-2 border-dashed p-10 text-center transition ${
          dragging
            ? "border-blue-600 bg-blue-50"
            : "border-slate-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          hidden
          multiple
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            handleFiles(e.target.files)
          }
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Choose Files
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Drag & Drop or Click to Upload
        </p>
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">
                  {doc.name}
                </p>

                <p className="text-sm text-slate-500">
                  {(doc.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => remove(doc.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
