"use client"

import { ArrowRight, ArrowDownRight, Coins } from "lucide-react"
import type { Transaction, AgentName } from "@/lib/symbio-dashboard-types"
import { useEffect, useRef } from "react"

const nameColor: Record<AgentName, string> = {
  Oracle: "text-neon-green",
  Strategist: "text-neon-purple",
  Executor: "text-neon-cyan",
  Evaluator: "text-chart-5",
}

export function TransactionFeed({ transactions }: { transactions: Transaction[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-1 pb-3">
        <Coins className="h-3.5 w-3.5 text-neon-green" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-neon-green neon-text-green">
          Nanopayment Feed
        </h2>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse-glow" />
          LIVE
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 space-y-1 overflow-y-auto pr-1"
        style={{ maxHeight: "calc(100vh - 320px)", minHeight: "300px" }}
      >
        {transactions.map((tx, i) => (
          <TransactionRow key={tx.id} tx={tx} isNew={i < 3} />
        ))}
      </div>
    </div>
  )
}

function TransactionRow({ tx, isNew }: { tx: Transaction; isNew: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isNew && rowRef.current) {
      rowRef.current.animate(
        [
          { opacity: 0, transform: "translateY(-8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out" }
      )
    }
  }, [isNew])

  return (
    <div
      ref={rowRef}
      className={`group flex items-center gap-2 rounded-md border px-2.5 py-2 transition-colors
        ${isNew ? "border-neon-green/20 bg-neon-green/5" : "border-border/50 bg-card/50"}
        hover:border-neon-green/30 hover:bg-neon-green/5`}
    >
      {/* ID & Status */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 text-[10px] text-muted-foreground">{tx.id}</span>
        <span className={`shrink-0 font-bold text-[11px] ${nameColor[tx.from]}`}>{tx.from}</span>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className={`shrink-0 font-bold text-[11px] ${nameColor[tx.to]}`}>{tx.to}</span>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/60">{tx.purpose}</span>
        <span className="font-bold text-xs text-neon-green">${tx.amount.toFixed(6)}</span>
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
            tx.status === "confirmed" ? "bg-neon-green" : "bg-chart-4 animate-pulse"
          }`}
        />
      </div>
    </div>
  )
}
