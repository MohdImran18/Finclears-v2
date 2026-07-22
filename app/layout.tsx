import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { Toaster } from "sonner";

import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

import StructuredData from "@/components/seo/StructuredData";

import { organizationSchema } from "@/lib/seo/organization";
import { websiteSchema } from "@/lib/seo/website";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "FinClears",
    template: "%s | FinClears",
  },

  description:
    "India's Trusted Business Registration & Compliance Platform.",

  applicationName: "FinClears",

  generator: "Next.js 16",

  referrer: "origin-when-cross-origin",

  keywords: [
    "Company Registration",
    "GST Registration",
    "Trademark Registration",
    "Private Limited Company",
    "LLP Registration",
    "Income Tax Filing",
    "ROC Filing",
    "Startup Registration",
    "Business Compliance",
    "FinClears",
  ],

  authors: [
    {
      name: "FinClears",
      url: SITE_URL,
    },
  ],

  creator: "FinClears",

  publisher: "FinClears",

  alternates: {
    canonical: "/",
  },

  manifest: "/site.webmanifest",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: SITE_URL,

    siteName: "FinClears",

    title: "FinClears",

    description:
      "India's Trusted Business Registration & Compliance Platform.",

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

    description:
      "India's Trusted Business Registration & Compliance Platform.",

    images: [
      "/images/og/home.jpg",
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinClears",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  verification: {
    google:
      process.env
        .NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  maximumScale: 5,

  themeColor: "#2563EB",

  colorScheme: "light",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <StructuredData
          data={organizationSchema}
        />

        <StructuredData
          data={websiteSchema}
        />

        <ReactQueryProvider>

          <AuthProvider>

            {children}

          </AuthProvider>

        </ReactQueryProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          duration={4000}
        />

      </body>
    </html>
  );
}
