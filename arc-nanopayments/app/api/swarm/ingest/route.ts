/**
 * POST swarm (+ optional FHE) JSON from local Python engine → Vercel KV.
 * Auth: Authorization: Bearer SWARM_INGEST_SECRET
 */

import { NextResponse } from "next/server";
import { isRemoteIngestEnabled, setFheState, setSwarmState } from "@/lib/swarm-state-store";

export async function POST(request: Request) {
  if (!isRemoteIngestEnabled()) {
    return NextResponse.json(
      { error: "Ingest not configured (link Redis or Blob + SWARM_INGEST_SECRET)" },
      { status: 503 },
    );
  }

  const secret = process.env.SWARM_INGEST_SECRET!.trim();
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { swarm?: unknown; fhe?: unknown };
  try {
    body = (await request.json()) as { swarm?: unknown; fhe?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.swarm && !body.fhe) {
    return NextResponse.json({ error: "Provide swarm and/or fhe payload" }, { status: 400 });
  }

  try {
    if (body.swarm) await setSwarmState(body.swarm);
    if (body.fhe) await setFheState(body.fhe);
    return NextResponse.json({
      ok: true,
      updated: { swarm: !!body.swarm, fhe: !!body.fhe },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "KV write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
