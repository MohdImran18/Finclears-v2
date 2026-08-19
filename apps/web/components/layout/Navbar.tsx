"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Navbar() {
	return (
		<header className="flex h-16 items-center justify-between border-b bg-white px-6">
			{/* Left */}

			<div className="flex items-center gap-4">
				<h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
			</div>

			{/* Right */}

			<div className="flex items-center gap-4">
				<div className="relative w-72">
					<Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

					<Input placeholder="Search..." className="pl-9" />
				</div>

				<button className="relative rounded-lg p-2 hover:bg-slate-100">
					<Bell className="h-5 w-5 text-slate-600" />

					<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
				</button>

				<button className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-100">
					<UserCircle className="h-8 w-8 text-slate-500" />

					<div className="text-left">
						<p className="text-sm font-semibold">Welcome</p>

						<p className="text-xs text-slate-500">User</p>
					</div>
				</button>
			</div>
		</header>
	);
}

