import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kladeai.com"),
  title: "Klade | AI Analysts for Financial Intelligence",
  description:
    "Klade builds AI analysts for finance teams to research companies, screen sectors, and produce investment-grade deliverables in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} bg-black font-sans antialiased`}>{children}</body>
    </html>
  );
}
