import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finclears Admin",
  description: "Finclears Administration Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}