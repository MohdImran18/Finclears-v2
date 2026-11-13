"use client";

import {
  ShieldCheck,
  Fingerprint,
  BadgeCheck,
  TrendingUp,
  GitBranch,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface Props {
  title?: string;
  benefits: string[];
}

const benefitStyles = [
  { Icon: ShieldCheck, color: "text-blue-700 bg-blue-50 ring-blue-100", glow: "from-blue-500/10" },
  { Icon: Fingerprint, color: "text-violet-700 bg-violet-50 ring-violet-100", glow: "from-violet-500/10" },
  { Icon: BadgeCheck, color: "text-emerald-700 bg-emerald-50 ring-emerald-100", glow: "from-emerald-500/10" },
  { Icon: TrendingUp, color: "text-amber-700 bg-amber-50 ring-amber-100", glow: "from-amber-500/10" },
  { Icon: GitBranch, color: "text-cyan-700 bg-cyan-50 ring-cyan-100", glow: "from-cyan-500/10" },
  { Icon: Users, color: "text-rose-700 bg-rose-50 ring-rose-100", glow: "from-rose-500/10" },
];

export default function ServiceBenefits({
  title = "Why Choose This Service?",
  benefits,
}: Props) {
  const validBenefits = benefits.filter(
    (benefit): benefit is string =>
      typeof benefit === "string" && benefit.trim().length > 0,
  );

  if (validBenefits.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Benefits & advantages
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Everything you need to complete your registration quickly and
            compliantly.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {validBenefits.map((benefit, index) => {
            const style = benefitStyles[index % benefitStyles.length];
            const Icon = style.Icon;

            return (
              <article
                key={`${benefit}-${index}`}
                className="group relative flex min-h-[172px] items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)] sm:p-6"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-emerald-500 transition-transform duration-300 group-hover:scale-x-100`}
                  aria-hidden="true"
                />

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${style.color}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Benefit {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-base font-semibold leading-6 text-slate-800 transition-colors group-hover:text-blue-700 sm:text-[17px]">
                    {benefit}
                  </h3>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Designed for your business
                    <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
