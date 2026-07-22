"use client";

import GlassCard from "./GlassCard";

interface Props {
  title: string;
  value: string;
}

export default function MetricCard({
  title,
  value,
}: Props) {
  return (
    <GlassCard className="p-6">

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <h3 className="mt-4 text-4xl font-black">

        {value}

      </h3>

    </GlassCard>
  );
}
