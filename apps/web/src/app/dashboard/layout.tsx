import type { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import QueryProvider from "@/components/providers/QueryProvider";

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	return (
		<QueryProvider>
			<DashboardLayout>{children}</DashboardLayout>
		</QueryProvider>
	);
}
