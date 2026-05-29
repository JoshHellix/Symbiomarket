/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TopBarGatewayControls } from "./top-bar-gateway-controls";

export function DashboardHeader() {
  if (isSupabaseConfigured()) {
    return <TopBarGatewayControls />;
  }

  return (
    <div className="flex flex-1 flex-wrap items-center justify-between gap-2 min-w-0">
      <div>
        <span className="font-semibold text-sm">SymbioMarket</span>
        <p className="text-xs text-muted-foreground mt-0.5">
          Supabase not configured — Payments / Withdrawals tabs will be empty.
        </p>
      </div>
      <Link href="/swarm" className="text-xs text-primary hover:underline shrink-0">
        Open swarm-only view →
      </Link>
    </div>
  );
}
