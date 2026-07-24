import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function GradientText({
  children,
  className,
}: Props) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
