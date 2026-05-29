"use client"

import { Bot, Cpu, Crosshair, ShieldCheck, Wifi, WifiOff } from "lucide-react"
import type { Agent, AgentName, AgentStatus } from "@/lib/symbio-dashboard-types"

const agentIcons: Record<AgentName, React.ReactNode> = {
  Oracle: <Wifi className="h-4 w-4" />,
  Strategist: <Cpu className="h-4 w-4" />,
  Executor: <Crosshair className="h-4 w-4" />,
  Evaluator: <ShieldCheck className="h-4 w-4" />,
}

const statusColor: Record<AgentStatus, string> = {
  ACTIVE: "bg-neon-green",
  PROCESSING: "bg-neon-purple",
  IDLE: "bg-muted-foreground",
  SYNCING: "bg-neon-cyan",
}

const statusTextColor: Record<AgentStatus, string> = {
  ACTIVE: "text-neon-green",
  PROCESSING: "text-neon-purple",
  IDLE: "text-muted-foreground",
  SYNCING: "text-neon-cyan",
}

const borderGlow: Record<AgentStatus, string> = {
  ACTIVE: "neon-border-green",
  PROCESSING: "neon-border-purple",
  IDLE: "",
  SYNCING: "",
}

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className={`relative rounded-lg border border-border bg-card p-3 transition-all ${borderGlow[agent.status]}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`${statusTextColor[agent.status]}`}>
            {agentIcons[agent.name]}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {agent.name}
            </h3>
            <p className="text-[10px] text-muted-foreground">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[agent.status]} ${agent.status === "ACTIVE" ? "animate-pulse-glow" : ""}`} />
          <span className={`text-[10px] font-bold uppercase ${statusTextColor[agent.status]}`}>
            {agent.status}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatBlock label="TASKS" value={agent.tasksCompleted.toLocaleString()} />
        <StatBlock label="ACCURACY" value={`${agent.accuracy}%`} highlight={agent.accuracy > 95} />
        <StatBlock label="LATENCY" value={`${agent.latency}ms`} warn={agent.latency > 40} />
        <StatBlock label="UPTIME" value={agent.uptime} />
      </div>
    </div>
  )
}

function StatBlock({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`text-xs font-bold ${warn ? "text-destructive" : highlight ? "text-neon-green" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  )
}

export function AgentGrid({ agents }: { agents: Agent[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Bot className="h-3.5 w-3.5 text-neon-purple" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-neon-purple neon-text-purple">
          Active Agents
        </h2>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {agents.filter(a => a.status !== "IDLE").length}/{agents.length} online
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  )
}
