import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadre — AI Employees for Your Business",
  description: "Your next hire isn't human. AI employees that plug into your team. Cheaper than humans. Always on. No HR required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
