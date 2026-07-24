import { cn } from "@/lib/utils";

interface Props {
  badge: string;
  title: string;
  subtitle: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        center && "mx-auto text-center"
      )}
    >
      <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
        {badge}
      </span>

      <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 lg:text-6xl">
        {title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}
