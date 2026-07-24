import NotificationHeader from "@/components/dashboard/notifications/NotificationHeader";
import NotificationActions from "@/components/dashboard/notifications/NotificationActions";
import NotificationFilter from "@/components/dashboard/notifications/NotificationFilter";
import NotificationCard from "@/components/dashboard/notifications/NotificationCard";

export default function NotificationsPage() {
  return (
    <div>
      <NotificationHeader />

      <div className="mb-6 flex justify-between">
        <NotificationActions />
        <NotificationFilter />
      </div>

      <NotificationCard />
    </div>
  );
}
