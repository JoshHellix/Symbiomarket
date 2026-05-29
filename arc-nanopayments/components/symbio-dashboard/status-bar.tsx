"use client"

import { Radio, Server, Clock, Database, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface StatusBarProps {
  blockHeight: number
  agentCount: number
  cycle: number
}

export function StatusBar({ blockHeight, agentCount, cycle }: StatusBarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-1.5 md:px-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px]">
        {/* Network */}
        <div className="flex items-center gap-1.5">
          <Radio className="h-3 w-3 text-neon-green animate-pulse-glow" />
          <span className="text-neon-green font-bold">ARC TESTNET</span>
        </div>

        <Separator />

        {/* Block */}
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">BLOCK</span>
          <span className="text-foreground font-bold">{blockHeight.toLocaleString()}</span>
        </div>

        <Separator />

        {/* Agents */}
        <div className="flex items-center gap-1.5">
          <Server className="h-3 w-3 text-neon-purple" />
          <span className="text-muted-foreground">AGENTS</span>
          <span className="text-foreground font-bold">{agentCount}/4</span>
        </div>

        <Separator />

        {/* Consensus */}
        <div className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-neon-green" />
          <span className="text-muted-foreground">CONSENSUS</span>
          <span className="text-neon-green font-bold">SYNCED</span>
        </div>

        {/* Clock - pushed to right */}
        <div className="ml-auto flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">UTC</span>
          <span className="text-foreground font-bold tabular-nums">{time}</span>
        </div>
      </div>
    </footer>
  )
}

function Separator() {
  return <span className="hidden text-border md:inline">|</span>
}
