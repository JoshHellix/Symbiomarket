/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useCallback, useEffect, useState } from "react";

export type FheSyncState = {
  cycle: number;
  updated_at?: string;
  payment?: {
    tx_id?: string;
    from: string;
    to: string;
    amount: number;
    purpose: string;
    time: string;
  };
  fhe?: {
    ledger_address: string;
    sepolia_tx: string | null;
    micro_added: number;
    decrypted_total_usdc: number;
    explorer_tx: string | null;
    explorer_contract: string | null;
  };
  arc?: {
    status: string;
    note: string;
    public_amount_usdc?: number;
    tx_hash?: string;
    block?: number;
    explorer_tx?: string;
  };
  message?: string;
};

export function useFheSync(pollMs = 5000) {
  const [state, setState] = useState<FheSyncState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/fhe/state", { cache: "no-store" });
      if (res.ok) setState(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { state, loading, refresh };
}
