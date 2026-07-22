import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg">
      <div className="mb-6">{icon}</div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-4 text-slate-600">
        {description}
      </p>
    </div>
  );
}
