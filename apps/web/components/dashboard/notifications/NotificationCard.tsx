import type { ReactNode } from "react";

interface Props {
        children: ReactNode;
}

export default function NotificationCard({ children }: Props) {
        return (
                <div className="rounded-2xl bg-white p-6 shadow">
                        {children}
                </div>
        );
}