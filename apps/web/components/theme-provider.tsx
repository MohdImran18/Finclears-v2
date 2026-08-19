"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export interface ThemeProviderProps {
	children: React.ReactNode;
	attribute?: "class" | "data-theme";
	defaultTheme?: string;
	enableSystem?: boolean;
}

export function ThemeProvider({
	children,
	attribute = "class",
	defaultTheme = "light",
	enableSystem = true,
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute={attribute}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
		>
			{children}
		</NextThemesProvider>
	);
}

