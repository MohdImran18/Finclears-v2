import NotificationBadge from "./NotificationBadge";

export default function NotificationHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-4xl font-bold">
        Notifications
      </h1>

      <NotificationBadge count={3} />
    </div>
  );
}
