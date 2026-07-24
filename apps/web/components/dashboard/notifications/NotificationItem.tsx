interface Props {
  title: string;
  description: string;
  time: string;
}

export default function NotificationItem({
  title,
  description,
  time,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>

      <div className="mt-4 text-xs text-slate-400">
        {time}
      </div>
    </div>
  );
}
