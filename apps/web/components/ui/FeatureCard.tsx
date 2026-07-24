"use client";

import GlassCard from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <GlassCard className="group p-8">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition group-hover:bg-blue-600">

        <Icon
          size={30}
          className="text-blue-600 group-hover:text-white"
        />

      </div>

      <h3 className="mt-8 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-5 leading-8 text-slate-600">

        {description}

      </p>

    </GlassCard>
  );
}
