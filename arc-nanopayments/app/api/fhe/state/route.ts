/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from "next/server";
import { getFheState } from "@/lib/swarm-state-store";

export async function GET() {
  const { data, source } = await getFheState();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Fhe-Source": source,
    },
  });
}
