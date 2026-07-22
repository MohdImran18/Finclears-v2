"use client";

interface DocumentData {
  id?: number | string;
  title?: string;
  name?: string;
  file_name?: string;
  file_url?: string;
  url?: string;
  status?: string;
  created_at?: string;
}

interface DocumentViewerProps {
  document?: DocumentData;
}

export default function DocumentViewer({
  document,
}: DocumentViewerProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">
        Document Viewer
      </h2>

      <div className="space-y-2">

        <p>
          <strong>Name:</strong>{" "}
          {document?.title ??
            document?.name ??
            document?.file_name ??
            "Untitled"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {document?.status ?? "Pending"}
        </p>

        <p>
          <strong>Uploaded:</strong>{" "}
          {document?.created_at ?? "-"}
        </p>

      </div>

      {document?.file_url || document?.url ? (
        <iframe
          title="Document Preview"
          src={document.file_url ?? document.url}
          className="mt-6 h-[700px] w-full rounded-lg border"
        />
      ) : (
        <div className="mt-6 flex h-72 items-center justify-center rounded-lg border border-dashed text-slate-500">
          No preview available
        </div>
      )}

    </div>
  );
}
