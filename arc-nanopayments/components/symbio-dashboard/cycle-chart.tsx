"use client"

import { BarChart3 } from "lucide-react"
import type { CycleData } from "@/lib/symbio-dashboard-types"

const CHART_HEIGHT_PX = 112
const NEON_GREEN = "oklch(0.82 0.22 155 / 0.85)"
const NEON_RED = "oklch(0.577 0.245 27.325 / 0.85)"
const MUTED_BAR = "oklch(0.55 0.02 155 / 0.35)"

export function CycleChart({ data }: { data: CycleData[] }) {
  if (data.length === 0) {
    return null
  }

  const profits = data.map((d) => d.profit)
  const maxAbs = Math.max(...profits.map((p) => Math.abs(p)), 0.05)
  const avgProfit = profits.reduce((s, p) => s + p, 0) / profits.length
  const totalTrades = data.reduce((s, d) => s + d.trades, 0)
  const wins = profits.filter((p) => p > 0).length
  const winRate = (wins / profits.length) * 100
  const hasVariation = maxAbs > 0.001 && new Set(profits.map((p) => p.toFixed(4))).size > 1

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <BarChart3 className="h-3.5 w-3.5 text-neon-cyan" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
          Cycle Performance
        </h2>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Last {data.length} cycles · executor PnL
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card p-3 neon-border-green">
        <div
          className="flex items-end gap-1 px-0.5"
          style={{ height: CHART_HEIGHT_PX }}
        >
          {data.map((d) => {
            const ratio = Math.abs(d.profit) / maxAbs
            const barPx = Math.max(6, Math.round(ratio * (CHART_HEIGHT_PX - 8)))
            const isPositive = d.profit >= 0
            const isZero = Math.abs(d.profit) < 1e-6
            const fill = isZero ? MUTED_BAR : isPositive ? NEON_GREEN : NEON_RED

            return (
              <div
                key={d.cycle}
                className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-border bg-card px-2 py-1 text-[9px] shadow-lg group-hover:block">
                  <p className="text-foreground">C#{d.cycle}</p>
                  <p className={isPositive ? "text-neon-green" : "text-destructive"}>
                    {isPositive && !isZero ? "+" : ""}
                    {d.profit.toFixed(4)} PnL
                  </p>
                  <p className="text-muted-foreground">{d.trades} payment(s)</p>
                </div>
                <div
                  className="w-full max-w-[14px] min-w-[4px] rounded-t-sm transition-all duration-500"
                  style={{ height: barPx, backgroundColor: fill }}
                  title={`Cycle ${d.cycle}: ${d.profit.toFixed(4)}`}
                />
              </div>
            )
          })}
        </div>

        <div className="mt-1 flex gap-1">
          {data.map((d, i) => (
            <div key={d.cycle} className="min-w-0 flex-1 text-center">
              {(i === 0 ||
                i === data.length - 1 ||
                i % Math.max(1, Math.floor(data.length / 4)) === 0) && (
                <span className="text-[8px] text-muted-foreground">#{d.cycle}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-[10px]">
          <div>
            <span className="text-muted-foreground">AVG PnL </span>
            <span
              className={`font-bold ${avgProfit >= 0 ? "text-neon-green" : "text-destructive"}`}
            >
              {avgProfit >= 0 ? "+" : ""}
              {avgProfit.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">PAYMENTS </span>
            <span className="font-bold text-foreground">{totalTrades}</span>
          </div>
          <div>
            <span className="text-muted-foreground">WIN RATE </span>
            <span className="font-bold text-neon-green">{winRate.toFixed(0)}%</span>
          </div>
        </div>

        <p className="mt-2 text-center text-[9px] text-muted-foreground">
          <span className="inline-block size-2 rounded-sm align-middle" style={{ background: NEON_GREEN }} />{" "}
          profit ·{" "}
          <span className="inline-block size-2 rounded-sm align-middle" style={{ background: NEON_RED }} /> loss
        </p>

        {!hasVariation && (
          <p className="mt-1 text-[9px] text-muted-foreground text-center">
            Restart <code className="text-neon-green/80">swarm_api.py</code> if all bars look the same height.
          </p>
        )}
      </div>
    </div>
  )
}
