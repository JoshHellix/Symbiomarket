/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from "next/server";
import { getSwarmState } from "@/lib/swarm-state-store";

function jsonNoStore(body: unknown, source?: string) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...(source ? { "X-Swarm-Source": source } : {}),
    },
  });
}

export async function GET() {
  const { data, source } = await getSwarmState();
  return jsonNoStore(data, source);
}
