interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className = "",
}: Props) {
  return (
    <h2
      className={`text-4xl md:text-5xl font-bold tracking-tight text-slate-900 ${className}`}
    >
      {children}
    </h2>
  );
}
