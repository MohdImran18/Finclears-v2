interface Props {
  title: string;
  value: string;
}

export default function OverviewCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-bold">
        {value}
      </h2>

    </div>
  );
}
