"use client";

import type { ServiceDocument } from "@/types/service";

interface Props {
    documents?: ServiceDocument[];
}

export default function ServiceDocuments({ documents = [] }: Props) {
    if (!documents.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">
                Required Documents
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {documents.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                        <h3 className="font-medium text-slate-900">
                            {item.document_name}
                        </h3>

                        {item.description && (
                            <p className="mt-1 text-sm text-slate-600">
                                {item.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
