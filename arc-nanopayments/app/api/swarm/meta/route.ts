import { NextResponse } from "next/server";
import {
  getSwarmState,
  isRemoteIngestEnabled,
  remoteStorageKind,
} from "@/lib/swarm-state-store";

export async function GET() {
  const { source } = await getSwarmState();
  return NextResponse.json({
    source,
    storage: remoteStorageKind(),
    ingestEnabled: isRemoteIngestEnabled(),
    vercel: process.env.VERCEL === "1",
  });
}
