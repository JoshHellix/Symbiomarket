/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "..", "fhe_sync_state.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(raw), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({
      cycle: 0,
      fhe: null,
      message: "Run: cd fhe-contracts && npm run sync:swarm",
    });
  }
}
