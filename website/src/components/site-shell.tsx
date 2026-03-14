import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Navigation } from "./navigation";

type SiteShellProps = { children: ReactNode };

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-transparent text-[#f0f4ff]">
      <Navigation />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
