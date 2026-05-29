/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfidentialEconomyPanel } from "@/components/dashboard/confidential-economy-panel";
import { useSwarmState, type SwarmCycle, type SwarmPayment } from "@/hooks/use-swarm-state";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Loader2,
  Radio,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

function trendStyles(trend: string) {
  switch (trend) {
    case "bullish":
      return "bg-emerald-500/15 text-emerald-800 border-emerald-500/25 dark:text-emerald-300";
    case "bearish":
      return "bg-rose-500/15 text-rose-800 border-rose-500/25 dark:text-rose-300";
    case "volatile":
      return "bg-amber-500/15 text-amber-900 border-amber-500/25 dark:text-amber-200";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

function signalStyles(signal: string) {
  switch (signal) {
    case "buy":
      return "text-emerald-600 dark:text-emerald-400";
    case "sell":
      return "text-rose-600 dark:text-rose-400";
    default:
      return "text-muted-foreground";
  }
}

function TrendBadge({ trend }: { trend: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        trendStyles(trend),
      )}
    >
      {trend}
    </span>
  );
}

function formatClock(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function sumPnl(cycles: SwarmCycle[]) {
  return cycles.reduce((acc, c) => acc + (c.executor?.pnl ?? 0), 0);
}

const AGENT_META = [
  {
    id: "Oracle",
    icon: Radio,
    color: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
    iconColor: "text-violet-600",
  },
  {
    id: "Strategist",
    icon: Brain,
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    iconColor: "text-blue-600",
  },
  {
    id: "Executor",
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
    iconColor: "text-amber-600",
  },
  {
    id: "Evaluator",
    icon: BarChart3,
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    iconColor: "text-emerald-600",
  },
] as const;

function agentRoleSummary(agentId: string, latest: SwarmCycle, memory?: { oracle_bias: number; risk_factor: number }) {
  switch (agentId) {
    case "Oracle":
      return (
        <>
          <span className={cn("font-semibold capitalize", signalStyles(latest.oracle.signal))}>
            {latest.oracle.signal}
          </span>
          <span className="text-muted-foreground text-xs">
            {(latest.oracle.confidence * 100).toFixed(0)}% confidence
          </span>
        </>
      );
    case "Strategist":
      return (
        <>
          <span className="font-semibold capitalize">{latest.strategist.decision}</span>
          <span className="text-muted-foreground text-xs">bias {latest.strategist.bias}</span>
        </>
      );
    case "Executor":
      return (
        <>
          <span
            className={cn(
              "font-semibold font-mono",
              latest.executor.pnl >= 0 ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {latest.executor.pnl >= 0 ? "+" : ""}
            {latest.executor.pnl.toFixed(4)} PnL
          </span>
          <span className="text-muted-foreground text-xs">this cycle</span>
        </>
      );
    case "Evaluator":
      return memory ? (
        <>
          <span className="font-semibold font-mono text-xs">
            bias {memory.oracle_bias.toFixed(3)}
          </span>
          <span className="text-muted-foreground text-xs">risk {memory.risk_factor.toFixed(3)}</span>
        </>
      ) : (
        <span className="text-muted-foreground text-xs">learning loop active</span>
      );
    default:
      return null;
  }
}

function PaymentRow({ p, i }: { p: SwarmPayment; i: number }) {
  const txId = "tx_id" in p && p.tx_id ? String(p.tx_id) : null;
  return (
    <div
      className="symbio-feed-row flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-card/60 px-3 py-2.5 text-sm transition-colors"
      style={{ animationDelay: `${i * 40}ms` }}
    >
      <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">
        {txId ?? p.time}
      </span>
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <Badge variant="outline" className="shrink-0 font-normal">
          {p.from}
        </Badge>
        <ArrowRight className="size-3.5 shrink-0 text-primary" />
        <Badge variant="outline" className="shrink-0 font-normal">
          {p.to}
        </Badge>
      </div>
      <span className="font-mono text-xs font-medium text-primary shrink-0">
        ${p.amount.toFixed(6)}
      </span>
      <Badge variant="secondary" className="capitalize shrink-0 hidden sm:inline-flex">
        {p.purpose}
      </Badge>
    </div>
  );
}

export function SwarmPanel() {
  const { state: swarmState, loading: loadingSwarm } = useSwarmState(3000);

  if (loadingSwarm) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-48 text-muted-foreground">
        <Loader2 size={28} className="animate-spin text-primary" />
        <p className="text-sm">Connecting to agent swarm…</p>
      </div>
    );
  }

  if (!swarmState || swarmState.cycle === 0 || swarmState.cycles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-sm text-muted-foreground space-y-3 max-w-xl">
        <p className="font-semibold text-foreground text-base">No swarm data yet</p>
        <p>Start the Python engine from the repo root:</p>
        <pre className="text-xs bg-background border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap font-mono">
          {`cd /mnt/c/Users/dell/cursor-symbio/Symbiomarket
source venv/bin/activate
python3 agents/swarm_api.py`}
        </pre>
      </div>
    );
  }

  const latest = swarmState.cycles[0];
  const sessionPnl = sumPnl(swarmState.cycles);
  const memory = swarmState.memory;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="symbio-hero-glow relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-card to-violet-600/10 p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -left-4 bottom-0 size-32 rounded-full bg-violet-500/15 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Live swarm
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight symbio-title-gradient">
              Agent economy
            </h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Oracle → Strategist → Executor → Evaluator — confidential FHE on Sepolia, settlement on Arc
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Cycle</p>
            <p className="text-4xl font-bold font-mono tabular-nums text-primary">
              {swarmState.cycle}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Updated {formatClock(swarmState.updated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="symbio-card-glow border-cyan-500/15 bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Activity className="size-3.5" /> Market price
            </CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              ${swarmState.market?.price.toFixed(4) ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="symbio-card-glow border-cyan-500/10 bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Trend</CardDescription>
            <CardTitle className="text-lg pt-1">
              {swarmState.market ? (
                <TrendBadge trend={swarmState.market.trend} />
              ) : (
                "—"
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="symbio-card-glow border-cyan-500/10 bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Volatility</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {swarmState.market?.volatility.toFixed(4) ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="symbio-card-glow border-emerald-500/25 bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              {sessionPnl >= 0 ? (
                <TrendingUp className="size-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="size-3.5 text-rose-600" />
              )}
              Session PnL (last {swarmState.cycles.length} cycles)
            </CardDescription>
            <CardTitle
              className={cn(
                "text-2xl font-mono tabular-nums",
                sessionPnl >= 0 ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {sessionPnl >= 0 ? "+" : ""}
              {sessionPnl.toFixed(4)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <ConfidentialEconomyPanel />

      {/* Agent pipeline */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" />
          Agent pipeline — current cycle
        </h3>
        <div className="grid gap-3 md:grid-cols-4">
          {AGENT_META.map((agent, idx) => {
            const Icon = agent.icon;
            const status = swarmState.agents[agent.id]?.status ?? "active";
            return (
              <div key={agent.id} className="relative flex md:flex-col">
                {idx > 0 && (
                  <div className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                    <ArrowRight className="size-4" />
                  </div>
                )}
                <Card
                  className={cn(
                    "flex-1 bg-gradient-to-br shadow-sm border",
                    agent.color,
                  )}
                >
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("rounded-lg bg-background/80 p-2", agent.iconColor)}>
                        <Icon className="size-4" />
                      </div>
                      <Badge
                        variant={status === "active" ? "default" : "secondary"}
                        className="text-[10px] uppercase"
                      >
                        {status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{agent.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-0.5 pb-4 text-sm">
                    {agentRoleSummary(agent.id, latest, memory)}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Cycle log */}
        <Card className="lg:col-span-3 symbio-card-glow border-cyan-500/10 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Cycle history</CardTitle>
            <CardDescription>Recent decision pipeline outcomes</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-20">Time</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Oracle</TableHead>
                    <TableHead>Strategist</TableHead>
                    <TableHead className="text-right">PnL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swarmState.cycles.map((c) => (
                    <TableRow key={c.id} className={c.id === latest.id ? "bg-primary/5" : undefined}>
                      <TableCell className="font-mono text-xs">{c.time}</TableCell>
                      <TableCell>
                        <TrendBadge trend={c.market.trend} />
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className={cn("font-medium capitalize", signalStyles(c.oracle.signal))}>
                          {c.oracle.signal}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          {(c.oracle.confidence * 100).toFixed(0)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-xs capitalize font-medium">
                        {c.strategist.decision}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono text-xs font-medium",
                          c.executor.pnl >= 0 ? "text-emerald-600" : "text-rose-600",
                        )}
                      >
                        {c.executor.pnl >= 0 ? "+" : ""}
                        {c.executor.pnl}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Nanopayment feed */}
        <Card className="lg:col-span-2 symbio-card-glow border-cyan-500/20 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Nanopayment feed
            </CardTitle>
            <CardDescription>Simulated inter-agent micro-settlements</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {swarmState.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No payments yet</p>
            ) : (
              swarmState.payments.map((p, i) => <PaymentRow key={`${p.time}-${i}`} p={p} i={i} />)
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Live from <code className="px-1 rounded">swarm_data.json</code> · FHE sync:{" "}
        <code className="px-1 rounded">npm run sync:swarm</code> ·{" "}
        <a href="/" className="text-cyan-400 hover:underline">
          Circle USDC payments
        </a>
      </p>
    </div>
  );
}
