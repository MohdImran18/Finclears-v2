interface Props {
  className?: string;
}

export default function BlurCircle({
  className = "",
}: Props) {
  return (
    <div
      className={`absolute rounded-full bg-blue-500/10 blur-[150px] ${className}`}
    />
  );
}
