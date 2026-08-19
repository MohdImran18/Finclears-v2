"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}

			<Sidebar />

			{/* Content */}

			<div className="flex flex-1 flex-col">
				<Navbar />

				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}

