/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFheSync } from "@/hooks/use-fhe-sync";
import { ExternalLink, Lock, Loader2 } from "lucide-react";

export function ConfidentialEconomyPanel() {
  const { state, loading } = useFheSync(5000);

  if (loading && !state?.fhe) {
    return (
      <Card className="border-violet-500/30 bg-card/60 backdrop-blur-sm">
        <CardContent className="py-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading confidential layer…
        </CardContent>
      </Card>
    );
  }

  const hasFhe = Boolean(state?.fhe?.sepolia_tx);
  const arcConfirmed = state?.arc?.status === "confirmed";
  const subtitle = arcConfirmed
    ? "Sepolia FHE ledger + Arc testnet settlement — dual-layer agent economics"
    : hasFhe
      ? "FHE synced on Sepolia — run sync:swarm again or arc:settle for Arc pulse"
      : "Payment amounts homomorphically aggregated on Sepolia — Arc settlement after sync";

  return (
    <Card className="symbio-card-glow border-violet-500/35 bg-gradient-to-br from-violet-600/15 via-card/80 to-cyan-500/10 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-600/15 p-2">
            <Lock className="size-4 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-base">Confidential agent economy (Zama FHE)</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {!hasFhe ? (
          <div className="rounded-lg border border-dashed p-4 space-y-2 text-muted-foreground">
            <p className="text-foreground font-medium">Not synced yet</p>
            <p>
              While <code className="text-xs bg-muted px-1 rounded">swarm_api.py</code> runs, open
              PowerShell and sync the latest payment to the FHE ledger:
            </p>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              {`cd c:\\Users\\dell\\cursor-symbio\\Symbiomarket\\fhe-contracts
npm run sync:swarm`}
            </pre>
            <p className="text-xs">Takes ~1–2 min per sync (Zama relayer + Sepolia tx).</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground mb-1">Last swarm payment (source)</p>
              <p className="font-mono text-xs">{state?.payment?.tx_id}</p>
              <p className="mt-1">
                {state?.payment?.from} → {state?.payment?.to}
              </p>
              <p className="font-mono font-medium">${state?.payment?.amount}</p>
              <Badge variant="secondary" className="mt-2 capitalize text-xs">
                {state?.payment?.purpose}
              </Badge>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <p className="text-xs text-muted-foreground mb-1">FHE ledger (decrypted total)</p>
              <p className="text-2xl font-bold font-mono text-violet-300">
                ${state?.fhe?.decrypted_total_usdc?.toFixed(6) ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Encrypted on-chain; only your wallet can decrypt
              </p>
              {state?.fhe?.explorer_tx && (
                <a
                  href={state.fhe.explorer_tx}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                >
                  Sepolia tx <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-dashed p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-foreground">Arc public settlement</p>
              <p className="text-xs text-muted-foreground">{state?.arc?.note}</p>
            </div>
            <Badge
              variant={arcConfirmed ? "default" : "outline"}
              className={
                arcConfirmed
                  ? "text-xs bg-emerald-600 hover:bg-emerald-600"
                  : "text-xs"
              }
            >
              {state?.arc?.status ?? "pending"}
            </Badge>
          </div>
          {state?.arc?.explorer_tx && (
            <a
              href={state.arc.explorer_tx}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Arc testnet tx <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
