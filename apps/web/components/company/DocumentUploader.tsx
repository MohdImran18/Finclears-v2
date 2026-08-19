"use client";

import { useRef, useState } from "react";

export type DocumentType =
        | "pan_card"
        | "aadhaar_card"
        | "address_proof"
        | "photograph"
        | "dsc"
        | "rent_agreement"
        | "noc"
        | "moa"
        | "aoa"
        | "other";

export interface UploadDocument {
        id: string;
        name: string;
        file: File;
        size: number;
        documentType: DocumentType;
        remarks: string;
}

interface Props {
        documents: UploadDocument[];
        onChange: (documents: UploadDocument[]) => void;
}

const DOCUMENT_TYPES: {
        value: DocumentType;
        label: string;
}[] = [
        {
                value: "pan_card",
                label: "PAN Card",
        },
        {
                value: "aadhaar_card",
                label: "Aadhaar Card",
        },
        {
                value: "address_proof",
                label: "Address Proof",
        },
        {
                value: "photograph",
                label: "Photograph",
        },
        {
                value: "dsc",
                label: "Digital Signature Certificate",
        },
        {
                value: "rent_agreement",
                label: "Rent Agreement",
        },
        {
                value: "noc",
                label: "NOC",
        },
        {
                value: "moa",
                label: "MOA",
        },
        {
                value: "aoa",
                label: "AOA",
        },
        {
                value: "other",
                label: "Other",
        },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(size: number) {
        if (size < 1024 * 1024) {
                return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DocumentUploader({
        documents,
        onChange,
}: Props) {
        const inputRef = useRef<HTMLInputElement>(null);

        const [dragging, setDragging] = useState(false);

        function handleFiles(files: FileList | null) {
                if (!files) return;

                const selected = Array.from(files);

                const validFiles = selected.filter((file) => {
                        if (file.size > MAX_FILE_SIZE) {
                                alert(
                                        `${file.name} is larger than 10 MB.`,
                                );

                                return false;
                        }

                        return true;
                });

                const uploaded: UploadDocument[] = validFiles.map(
                        (file) => ({
                                id: crypto.randomUUID(),
                                name: file.name,
                                file,
                                size: file.size,
                                documentType: "other",
                                remarks: "",
                        }),
                );

                onChange([...documents, ...uploaded]);

                if (inputRef.current) {
                        inputRef.current.value = "";
                }
        }

        function remove(id: string) {
                onChange(
                        documents.filter(
                                (document) => document.id !== id,
                        ),
                );
        }

        function updateDocument(
                id: string,
                values: Partial<UploadDocument>,
        ) {
                onChange(
                        documents.map((document) =>
                                document.id === id
                                        ? {
                                                  ...document,
                                                  ...values,
                                          }
                                        : document,
                        ),
                );
        }

        return (
                <div className="space-y-6">
                        <div
                                className={`rounded-xl border-2 border-dashed p-10 text-center transition ${
                                        dragging
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-slate-300 bg-white"
                                }`}
                                onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragging(true);
                                }}
                                onDragLeave={() =>
                                        setDragging(false)
                                }
                                onDrop={(event) => {
                                        event.preventDefault();
                                        setDragging(false);

                                        handleFiles(
                                                event.dataTransfer.files,
                                        );
                                }}
                        >
                                <input
                                        ref={inputRef}
                                        hidden
                                        multiple
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={(event) =>
                                                handleFiles(
                                                        event.target
                                                                .files,
                                                )
                                        }
                                />

                                <button
                                        type="button"
                                        onClick={() =>
                                                inputRef.current?.click()
                                        }
                                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                                >
                                        Choose Files
                                </button>

                                <p className="mt-4 text-sm text-slate-500">
                                        Drag & Drop or Click to Upload
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                        PDF, JPG, JPEG, PNG or WEBP ·
                                        Maximum 10 MB per file
                                </p>
                        </div>

                        {documents.length > 0 && (
                                <div className="space-y-4">
                                        {documents.map((document) => (
                                                <div
                                                        key={document.id}
                                                        className="rounded-xl border bg-white p-5 shadow-sm"
                                                >
                                                        <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0">
                                                                        <p className="truncate font-semibold text-slate-900">
                                                                                {
                                                                                        document.name
                                                                                }
                                                                        </p>

                                                                        <p className="mt-1 text-sm text-slate-500">
                                                                                {formatFileSize(
                                                                                        document.size,
                                                                                )}
                                                                        </p>
                                                                </div>

                                                                <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                                remove(
                                                                                        document.id,
                                                                                )
                                                                        }
                                                                        className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                                                                >
                                                                        Remove
                                                                </button>
                                                        </div>

                                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                                                <div>
                                                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                                                                Document
                                                                                Type
                                                                        </label>

                                                                        <select
                                                                                value={
                                                                                        document.documentType
                                                                                }
                                                                                onChange={(
                                                                                        event,
                                                                                ) =>
                                                                                        updateDocument(
                                                                                                document.id,
                                                                                                {
                                                                                                        documentType:
                                                                                                                event
                                                                                                                        .target
                                                                                                                        .value as DocumentType,
                                                                                                },
                                                                                        )
                                                                                }
                                                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                                                        >
                                                                                {DOCUMENT_TYPES.map(
                                                                                        (
                                                                                                type,
                                                                                        ) => (
                                                                                                <option
                                                                                                        key={
                                                                                                                type.value
                                                                                                        }
                                                                                                        value={
                                                                                                                type.value
                                                                                                        }
                                                                                                >
                                                                                                        {
                                                                                                                type.label
                                                                                                        }
                                                                                                </option>
                                                                                        ),
                                                                                )}
                                                                        </select>
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                                                                Remarks
                                                                        </label>

                                                                        <input
                                                                                type="text"
                                                                                value={
                                                                                        document.remarks
                                                                                }
                                                                                onChange={(
                                                                                        event,
                                                                                ) =>
                                                                                        updateDocument(
                                                                                                document.id,
                                                                                                {
                                                                                                        remarks:
                                                                                                                event
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                },
                                                                                        )
                                                                                }
                                                                                placeholder="Optional remarks"
                                                                                maxLength={
                                                                                        1000
                                                                                }
                                                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                                                        />
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        )}
                </div>
        );
}
