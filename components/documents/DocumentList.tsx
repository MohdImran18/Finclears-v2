"use client";

interface DocumentListProps {
  documents?: any[];
  loading?: boolean;
}

export default function DocumentList({
  documents = [],
  loading = false,
}: DocumentListProps) {
  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center">
        No documents found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document: any, index: number) => (
        <div
          key={document.id ?? index}
          className="rounded-lg border p-4"
        >
          {document.name ?? document.title ?? "Document"}
        </div>
      ))}
    </div>
  );
}
