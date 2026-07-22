"use client";

import GlassCard from "./GlassCard";
import { CheckCircle2 } from "lucide-react";

export default function DashboardCard() {
  return (
    <GlassCard className="max-w-sm p-8">

      <h3 className="text-xl font-bold">

        Registration Status

      </h3>

      <div className="mt-8 flex items-center justify-between">

        <span>

          Private Limited

        </span>

        <CheckCircle2 className="text-green-500" />

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">

        <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />

      </div>

      <p className="mt-5 text-slate-500">

        90% Completed

      </p>

    </GlassCard>
  );
}
