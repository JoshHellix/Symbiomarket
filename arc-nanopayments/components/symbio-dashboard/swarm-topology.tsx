"use client"

import type { Agent, AgentName } from "@/lib/symbio-dashboard-types"

const nodePositions: Record<AgentName, { x: number; y: number }> = {
  Oracle: { x: 50, y: 10 },
  Strategist: { x: 90, y: 50 },
  Executor: { x: 50, y: 90 },
  Evaluator: { x: 10, y: 50 },
}

const nodeColor: Record<AgentName, string> = {
  Oracle: "var(--neon-green)",
  Strategist: "var(--neon-purple)",
  Executor: "var(--neon-cyan)",
  Evaluator: "var(--chart-5)",
}

const connections: [AgentName, AgentName][] = [
  ["Oracle", "Strategist"],
  ["Strategist", "Executor"],
  ["Executor", "Evaluator"],
  ["Evaluator", "Oracle"],
  ["Oracle", "Executor"],
  ["Strategist", "Evaluator"],
]

export function SwarmTopology({ agents }: { agents: Agent[] }) {
  const agentMap = Object.fromEntries(agents.map(a => [a.name, a])) as Record<AgentName, Agent>

  return (
    <div className="space-y-3">
      <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-foreground">
        Swarm Topology
      </h2>
      <div className="rounded-lg border border-border bg-card p-3 neon-border-purple">
        <svg viewBox="0 0 100 100" className="h-full w-full" style={{ minHeight: 160 }}>
          {/* Connection lines */}
          {connections.map(([from, to]) => {
            const p1 = nodePositions[from]
            const p2 = nodePositions[to]
            return (
              <line
                key={`${from}-${to}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="oklch(0.82 0.22 155 / 0.15)"
                strokeWidth="0.3"
                strokeDasharray="2 2"
              />
            )
          })}

          {/* Animated data pulses along connections */}
          {connections.map(([from, to], i) => {
            const p1 = nodePositions[from]
            const p2 = nodePositions[to]
            return (
              <circle
                key={`pulse-${from}-${to}`}
                r="0.8"
                fill={nodeColor[from]}
                opacity="0.8"
              >
                <animateMotion
                  dur={`${2 + i * 0.5}s`}
                  repeatCount="indefinite"
                  path={`M${p1.x},${p1.y} L${p2.x},${p2.y}`}
                />
              </circle>
            )
          })}

          {/* Nodes */}
          {agents.map((agent) => {
            const pos = nodePositions[agent.name]
            const color = nodeColor[agent.name]
            const isActive = agent.status === "ACTIVE" || agent.status === "PROCESSING"
            return (
              <g key={agent.name}>
                {/* Outer glow ring */}
                {isActive && (
                  <circle cx={pos.x} cy={pos.y} r="6" fill="none" stroke={color} strokeWidth="0.3" opacity="0.4">
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Node circle */}
                <circle cx={pos.x} cy={pos.y} r="4" fill="oklch(0.12 0.02 280)" stroke={color} strokeWidth="0.6" />
                {/* Inner dot */}
                <circle cx={pos.x} cy={pos.y} r="1.5" fill={color} opacity={isActive ? 0.9 : 0.3} />
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  textAnchor="middle"
                  fill={color}
                  fontSize="3"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {agent.name.toUpperCase()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
