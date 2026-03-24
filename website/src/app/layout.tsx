import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const title = "Klade | AI Analysts for Financial Intelligence";
const description =
  "Klade builds AI analysts for finance teams to research companies, screen sectors, and produce investment-grade deliverables in minutes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kladeai.com"),
  title,
  description,
  applicationName: "Klade",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://kladeai.com",
    siteName: "Klade",
    images: [
      {
        url: "/og-klade-v2.png",
        width: 1200,
        height: 630,
        alt: "Klade — AI Analysts for Financial Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-klade-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="image" property="og:image" content="https://kladeai.com/og-klade-v2.png" />
      </head>
      <body className={`${geist.variable} bg-black font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
