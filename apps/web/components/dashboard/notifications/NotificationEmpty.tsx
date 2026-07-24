export default function NotificationEmpty() {
  return (
    <div className="rounded-2xl border border-dashed p-16 text-center">
      <h2 className="text-2xl font-bold">
        No Notifications
      </h2>

      <p className="mt-3 text-slate-500">
        You're all caught up.
      </p>
    </div>
  );
}
