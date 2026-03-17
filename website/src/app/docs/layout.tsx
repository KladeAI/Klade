"use client";

import { DocsMobileSidebar, DocsSidebar } from "@/components/docs";
import { SiteShell } from "@/components/site-shell";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="py-6 lg:hidden">
          <DocsMobileSidebar />
        </div>
        <div className="flex gap-10 pb-20">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 pt-10">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#5a6a8a] mb-4 px-3">Documentation</p>
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 pt-10">
            {children}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
