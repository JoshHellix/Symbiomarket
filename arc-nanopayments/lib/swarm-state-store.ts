/**
 * Swarm + FHE state: local JSON (dev) | Upstash KV | Vercel Blob (prod).
 */

import { get, put } from "@vercel/blob";
import { readFile } from "fs/promises";
import { join } from "path";
import { Redis } from "@upstash/redis";

const SWARM_KEY = "symbio:swarm";
const FHE_KEY = "symbio:fhe";
const SWARM_BLOB = "symbio/swarm.json";
const FHE_BLOB = "symbio/fhe.json";

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

function hasBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN?.trim();
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

async function getBlobJson(pathname: string): Promise<Record<string, unknown> | null> {
  if (!hasBlob()) return null;
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function setBlobJson(pathname: string, data: unknown): Promise<void> {
  if (!hasBlob()) throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export type StateSource = "kv" | "blob" | "local" | "empty";

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
  }

  const blob = await getBlobJson(SWARM_BLOB);
  if (blob) return { data: blob, source: "blob" };

  if (process.env.VERCEL === "1") {
    return {
      data: {
        ...EMPTY_SWARM,
        message:
          "Waiting for swarm push — link Redis or Blob on Vercel, then run swarm_api.py with SWARM_INGEST_URL.",
      },
      source: "empty",
    };
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
  }

  const blob = await getBlobJson(FHE_BLOB);
  if (blob) return { data: blob, source: "blob" };

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

  const local = await readLocalJson("fhe_sync_state.json");
  if (local) return { data: local, source: "local" };
  return {
    data: { cycle: 0, fhe: null, message: "Run: cd fhe-contracts && npm run sync:swarm" },
    source: "empty",
  };
}

export async function setSwarmState(data: unknown): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(SWARM_KEY, data);
    return;
  }
  await setBlobJson(SWARM_BLOB, data);
}

export async function setFheState(data: unknown): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(FHE_KEY, data);
    return;
  }
  await setBlobJson(FHE_BLOB, data);
}

export function isRemoteIngestEnabled(): boolean {
  return (hasKv() || hasBlob()) && !!process.env.SWARM_INGEST_SECRET?.trim();
}

export function remoteStorageKind(): "kv" | "blob" | "none" {
  if (hasKv()) return "kv";
  if (hasBlob()) return "blob";
  return "none";
}
