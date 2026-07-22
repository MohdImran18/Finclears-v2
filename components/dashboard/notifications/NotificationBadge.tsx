interface Props {
  count: number;
}

export default function NotificationBadge({
  count,
}: Props) {
  return (
    <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
      {count}
    </span>
  );
}
