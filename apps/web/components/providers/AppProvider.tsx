"use client";

import { Toaster } from "sonner";

import AuthProvider from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

interface Props {
	children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
	return (
		<ReactQueryProvider>
			<AuthProvider>
				{children}

				<Toaster
					position="top-right"
					richColors
					closeButton
					expand
					duration={4000}
				/>
			</AuthProvider>
		</ReactQueryProvider>
	);
}

