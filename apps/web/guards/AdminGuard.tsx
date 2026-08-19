"use client";

import type { ReactNode } from "react";
import { ROLES } from "@/constants/roles";

import { usePermission } from "@/hooks/usePermission";
import AuthGuard from "./AuthGuard";

interface Props {
	children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
	const allowed = usePermission([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

	if (!allowed) {
		return null;
	}

	return <AuthGuard>{children}</AuthGuard>;
}

