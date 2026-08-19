"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth";

interface Props {
	children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
	const router = useRouter();

	const { hydrated, isAuthenticated } = useAuthStore();

	useEffect(() => {
		if (hydrated && !isAuthenticated) {
			router.replace(ROUTES.LOGIN);
		}
	}, [hydrated, isAuthenticated, router]);

	if (!hydrated || !isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}

