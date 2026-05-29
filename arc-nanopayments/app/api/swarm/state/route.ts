/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const EMPTY_STATE = {
  cycle: 0,
  market: null,
  agents: {} as Record<string, unknown>,
  cycles: [] as unknown[],
  payments: [] as unknown[],
};

function jsonNoStore(body: unknown) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET() {
  const filePath = join(process.cwd(), "..", "swarm_data.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    return jsonNoStore(data);
  } catch {
    return jsonNoStore(EMPTY_STATE);
  }
}
