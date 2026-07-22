import Link from "next/link";

interface Props {
  current: string;
}

export default function Breadcrumb({
  current,
}: Props) {
  return (
    <div className="mb-8 flex items-center gap-2 text-sm">
      <Link href="/">Home</Link>
      <span>/</span>
      <span>{current}</span>
    </div>
  );
}
