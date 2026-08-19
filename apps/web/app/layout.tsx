import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import AppProvider from "@/components/providers/AppProvider";
import StructuredData from "@/components/seo/StructuredData";

import { organizationSchema } from "@/lib/seo/organization";
import { websiteSchema } from "@/lib/seo/website";
import { cn } from "@/lib/utils";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://finclears.com";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),

	title: {
		default: "FinClears",
		template: "%s | FinClears",
	},

	description: "India's Trusted Business Registration & Compliance Platform.",

	applicationName: "FinClears",

	generator: "Next.js 16",

	alternates: {
		canonical: "/",
	},

	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},

	openGraph: {
		type: "website",
		url: SITE_URL,
		siteName: "FinClears",
		title: "FinClears",
		description: "India's Trusted Business Registration & Compliance Platform.",
		images: [
			{
				url: "/images/og/home.jpg",
				width: 1200,
				height: 630,
				alt: "FinClears",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "FinClears",
		description: "India's Trusted Business Registration & Compliance Platform.",
		images: ["/images/og/home.jpg"],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: "#2563EB",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("font-sans", inter.variable)}
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 font-sans text-slate-900 antialiased`}
			>
				<StructuredData data={organizationSchema} />

				<StructuredData data={websiteSchema} />

				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}

