import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  children,
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700",
        className
      )}
    >
      {children}
    </span>
  );
}
