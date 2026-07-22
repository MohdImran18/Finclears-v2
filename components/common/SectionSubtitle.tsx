interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SectionSubtitle({
  children,
  className = "",
}: Props) {
  return (
    <p
      className={`mt-5 text-lg text-slate-600 max-w-3xl mx-auto ${className}`}
    >
      {children}
    </p>
  );
}
