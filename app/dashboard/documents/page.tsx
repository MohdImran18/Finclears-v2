"use client";

import { useState } from "react";

import DocumentFilters from "@/components/documents/DocumentFilters";
import DocumentList from "@/components/documents/DocumentList";

import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsPage() {

  const [search, setSearch] =
    useState("");

  const { data, isLoading } =
    useDocuments({
      search,
    });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Documents
        </h1>

        <p className="text-slate-500">
          Manage uploaded documents.
        </p>

      </div>

      <DocumentFilters
        search={search}
        onSearch={setSearch}
      />

      <DocumentList
        documents={
          data?.data ?? []
        }
      />

    </div>
  );
}
