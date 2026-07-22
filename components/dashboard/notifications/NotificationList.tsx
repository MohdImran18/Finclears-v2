import NotificationItem from "./NotificationItem";

const notifications = [
  {
    title: "GST Registration Approved",
    description: "Your GST registration has been approved.",
    time: "2 hours ago",
  },
  {
    title: "Payment Received",
    description: "Payment for Invoice INV-1003 received.",
    time: "Yesterday",
  },
  {
    title: "Document Verified",
    description: "PAN Card has been verified successfully.",
    time: "2 days ago",
  },
];

export default function NotificationList() {
  return (
    <div className="space-y-5">
      {notifications.map((item) => (
        <NotificationItem
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
}
