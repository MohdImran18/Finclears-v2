interface Props {
  number: string;
  label: string;
}

export default function StatCard({
  number,
  label,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow">
      <h3 className="text-4xl font-bold text-blue-600">
        {number}
      </h3>

      <p className="mt-2 text-slate-600">
        {label}
      </p>
    </div>
  );
}
