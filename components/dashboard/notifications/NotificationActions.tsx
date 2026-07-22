import { Button } from "@/components/ui/button";

export default function NotificationActions() {
  return (
    <div className="mb-6 flex gap-4">
      <Button>Mark All Read</Button>
      <Button>Clear All</Button>
    </div>
  );
}
