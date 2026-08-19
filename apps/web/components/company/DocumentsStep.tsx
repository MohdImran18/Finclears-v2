"use client";

import DocumentUploader, {
        type UploadDocument,
} from "./DocumentUploader";

import { useCompanyWizard } from "@/hooks/useCompanyWizard";

interface Props {
        next: () => void;
        previous: () => void;
}

export default function DocumentsStep({ next, previous }: Props) {
        const { documents, setDocuments } = useCompanyWizard();

        function submit() {
                setDocuments(documents);
                next();
        }

        return (
                <div className="space-y-8">
                        <h2 className="text-2xl font-bold">
                                Upload Documents
                        </h2>

                        <DocumentUploader
                                documents={documents}
                                onChange={(items: UploadDocument[]) =>
                                        setDocuments(items)
                                }
                        />

                        <div className="flex justify-between">
                                <button
                                        type="button"
                                        onClick={previous}
                                        className="rounded-lg border px-6 py-3"
                                >
                                        Previous
                                </button>

                                <button
                                        type="button"
                                        onClick={submit}
                                        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
                                >
                                        Continue
                                </button>
                        </div>
                </div>
        );
}
