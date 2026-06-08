/**
 * Swarm + FHE state for local dev (JSON files) and Vercel (Upstash / Vercel KV).
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { Redis } from "@upstash/redis";

const SWARM_KEY = "symbio:swarm";
const FHE_KEY = "symbio:fhe";

export const EMPTY_SWARM = {
  cycle: 0,
  market: null,
  agents: {} as Record<string, unknown>,
  cycles: [] as unknown[],
  payments: [] as unknown[],
};

function hasKv(): boolean {
  return !!(process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim());
}

function redis(): Redis | null {
  if (!hasKv()) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

async function readLocalJson(filename: string): Promise<Record<string, unknown> | null> {
  if (process.env.VERCEL === "1") return null;

  const candidates =
    filename === "swarm_data.json" || filename === "fhe_sync_state.json"
      ? [join(process.cwd(), "..", filename)]
      : [join(process.cwd(), filename)];

  for (const filePath of candidates) {
    try {
      const raw = await readFile(filePath, "utf-8");
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      continue;
    }
  }
  return null;
}

export type StateSource = "kv" | "local" | "empty";

export async function getSwarmState(): Promise<{
  data: Record<string, unknown>;
  source: StateSource;
}> {
  const r = redis();
  if (r) {
    const cached = await r.get<Record<string, unknown>>(SWARM_KEY);
    if (cached && typeof cached === "object") {
      return { data: cached, source: "kv" };
    }
    if (process.env.VERCEL === "1") {
      return {
        data: {
          ...EMPTY_SWARM,
          message:
            "Waiting for swarm push — run python agents/swarm_api.py with SWARM_INGEST_URL set.",
        },
        source: "empty",
      };
    }
  }

  const local = await readLocalJson("swarm_data.json");
  if (local) return { data: local, source: "local" };
  return { data: EMPTY_SWARM, source: "empty" };
}

export async function getFheState(): Promise<{
  data: Record<string, unknown>;
  source: StateSource;
}> {
  const r = redis();
  if (r) {
    const cached = await r.get<Record<string, unknown>>(FHE_KEY);
    if (cached && typeof cached === "object") {
      return { data: cached, source: "kv" };
    }
    if (process.env.VERCEL === "1") {
      return {
        data: {
          cycle: 0,
          fhe: null,
          arc: null,
          message: "Waiting for FHE/Arc push from local sync:swarm.",
        },
        source: "empty",
      };
    }
  }

  const local = await readLocalJson("fhe_sync_state.json");
  if (local) return { data: local, source: "local" };
  return {
    data: { cycle: 0, fhe: null, message: "Run: cd fhe-contracts && npm run sync:swarm" },
    source: "empty",
  };
}

export async function setSwarmState(data: unknown): Promise<void> {
  const r = redis();
  if (!r) throw new Error("KV_REST_API_URL / KV_REST_API_TOKEN not configured");
  await r.set(SWARM_KEY, data);
}

export async function setFheState(data: unknown): Promise<void> {
  const r = redis();
  if (!r) throw new Error("KV_REST_API_URL / KV_REST_API_TOKEN not configured");
  await r.set(FHE_KEY, data);
}

export function isRemoteIngestEnabled(): boolean {
  return hasKv() && !!process.env.SWARM_INGEST_SECRET?.trim();
}
