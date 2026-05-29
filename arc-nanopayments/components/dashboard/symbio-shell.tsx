/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import "@/styles/symbio-market.css";

type SymbioShellProps = {
  children: React.ReactNode;
  /** Show link to full Circle dashboard (payments / withdrawals) */
  showFullDashboardLink?: boolean;
  /** Inside /dashboard tabs — no duplicate top bar */
  embedded?: boolean;
  className?: string;
};

export function SymbioShell({
  children,
  showFullDashboardLink = true,
  embedded = false,
  className,
}: SymbioShellProps) {
  if (embedded) {
    return (
      <div className={cn("symbio-dashboard", className)}>
        <div className="symbio-grid-bg rounded-xl border border-cyan-500/15 p-4 sm:p-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("symbio-dashboard min-h-screen flex flex-col", className)}>
      <div className="symbio-grid-bg flex-1 flex flex-col min-h-screen">
        <header className="border-b border-cyan-500/15 bg-card/40 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-bold text-slate-950 shadow-[0_0_20px_-2px_rgba(34,211,238,0.6)]">
                S
                <span className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-md -z-10" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight symbio-title-gradient">
                  SymbioMarket
                </h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/80 font-medium">
                  Agent economy · Arc · Zama FHE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400/90">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Live
              </span>
              {showFullDashboardLink && (
                <Link
                  href="/"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Circle payments →
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
