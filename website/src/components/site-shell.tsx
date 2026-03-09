import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Navigation } from "./navigation";

type SiteShellProps = { children: ReactNode };

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
