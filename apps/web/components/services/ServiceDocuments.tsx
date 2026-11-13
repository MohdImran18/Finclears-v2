"use client";

import {
  FileText,
  CreditCard,
  Fingerprint,
  Camera,
  Building2,
  MapPin,
  Landmark,
  ClipboardCheck,
  FolderCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface Props {
  title?: string;
  documents: string[];
}

const documentStyles = [
  { Icon: CreditCard, color: "bg-blue-50 text-blue-600 ring-blue-100" },
  { Icon: Fingerprint, color: "bg-violet-50 text-violet-600 ring-violet-100" },
  { Icon: Camera, color: "bg-pink-50 text-pink-600 ring-pink-100" },
  { Icon: Building2, color: "bg-amber-50 text-amber-600 ring-amber-100" },
  { Icon: MapPin, color: "bg-emerald-50 text-emerald-600 ring-emerald-100" },
  { Icon: Landmark, color: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
  { Icon: ClipboardCheck, color: "bg-orange-50 text-orange-600 ring-orange-100" },
  { Icon: FolderCheck, color: "bg-indigo-50 text-indigo-600 ring-indigo-100" },
];

export default function ServiceDocuments({
  title = "Required Documents",
  documents,
}: Props) {
  const validDocuments = documents.filter(
    (document): document is string =>
      typeof document === "string" && document.trim().length > 0,
  );

  if (validDocuments.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Application checklist
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Keep these documents ready before starting your application.
            Requirements may vary depending on your business and application.
          </p>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
            <CheckCircle2
              className="h-4 w-4 text-emerald-600"
              aria-hidden="true"
            />
            {validDocuments.length} documents to prepare
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {validDocuments.map((document, index) => {
            const style = documentStyles[index % documentStyles.length];
            const Icon = style.Icon;

            return (
              <article
                key={`${document}-${index}`}
                className="group relative flex min-h-[170px] items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)] sm:p-6"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-emerald-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${style.color}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Document {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold leading-6 text-slate-800 transition-colors group-hover:text-blue-700 sm:text-[17px]">
                    {document}
                  </h3>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Keep ready for submission
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-slate-500 sm:text-sm">
          This checklist is for general guidance. Please confirm the final
          document requirements for your specific application before submission.
        </p>
      </div>
    </section>
  );
}
