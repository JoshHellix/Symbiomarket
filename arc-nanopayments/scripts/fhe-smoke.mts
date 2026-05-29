/**
 * Zama FHE smoke test (Node.js).
 *
 * Run: cd arc-nanopayments && npm run fhe
 *
 * If you see "Failed to initialize FHE worker pool" in WSL under /mnt/c/...,
 * run from Windows PowerShell in the same folder, or copy the repo to ~/symbiomarket.
 */

import { RelayerNode, SepoliaConfig } from "@zama-fhe/sdk/node";

function banner(title: string) {
  const line = "-".repeat(Math.max(12, title.length));
  // eslint-disable-next-line no-console
  console.log(`\n${line}\n${title}\n${line}`);
}

function printError(err: unknown) {
  if (err instanceof Error) {
    // eslint-disable-next-line no-console
    console.error("[fhe-smoke] failed:", err.message);
    if (err.cause instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("  cause:", err.cause.message);
    }
    const nodeErr = err as Error & { code?: string };
    if (nodeErr.code) {
      // eslint-disable-next-line no-console
      console.error("  code:", nodeErr.code);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error("[fhe-smoke] failed:", err);
  }
}

function warnWslDrvFs() {
  const cwd = process.cwd();
  if (process.platform === "linux" && cwd.startsWith("/mnt/")) {
    // eslint-disable-next-line no-console
    console.warn(
      "\n[wsl] Project is on a Windows drive (/mnt/c/...). Node worker threads often fail here.",
    );
    // eslint-disable-next-line no-console
    console.warn(
      "  Fix A: run from Windows PowerShell:\n" +
        "    cd c:\\Users\\dell\\cursor-symbio\\Symbiomarket\\arc-nanopayments\n" +
        "    npm run fhe\n",
    );
    // eslint-disable-next-line no-console
    console.warn(
      "  Fix B: copy repo to Linux home, then npm install && npm run fhe:\n" +
        "    cp -r /mnt/c/Users/dell/cursor-symbio/Symbiomarket ~/symbiomarket && cd ~/symbiomarket/arc-nanopayments\n",
    );
  }
}

async function preflightRelayer(relayerUrl: string) {
  // eslint-disable-next-line no-console
  console.log("Checking Zama relayer:", relayerUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(relayerUrl, { method: "GET", signal: controller.signal });
    // eslint-disable-next-line no-console
    console.log("Relayer reachable (HTTP", res.status + ")");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      "Relayer preflight failed (offline VPN/firewall?). Worker init may still fail:",
      e instanceof Error ? e.message : e,
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  banner("Zama FHE smoke test");

  warnWslDrvFs();

  const chainId = SepoliaConfig.chainId;
  const network = process.env.FHEVM_SEPOLIA_RPC_URL?.trim() || SepoliaConfig.network;
  const relayerUrl = SepoliaConfig.relayerUrl;

  await preflightRelayer(relayerUrl);

  const relayer = new RelayerNode({
    transports: {
      [chainId]: {
        ...SepoliaConfig,
        network,
      },
    },
    getChainId: async () => chainId,
    poolSize: 1,
  });

  try {
    // eslint-disable-next-line no-console
    console.log("Initializing FHE worker (first run can take 30–90s)…");

    const { publicKey, privateKey } = await relayer.generateKeypair();
    // eslint-disable-next-line no-console
    console.log("Generated keypair:", {
      publicKeyHexChars: publicKey.length,
      privateKeyHexChars: privateKey.length,
    });

    const contractAddress = "0x0000000000000000000000000000000000000000" as const;
    const userAddress = "0x0000000000000000000000000000000000000000" as const;

    const enc = await relayer.encrypt({
      values: [{ value: 42n, type: "euint64" }],
      contractAddress,
      userAddress,
    });

    // eslint-disable-next-line no-console
    console.log("Encrypted 42 as euint64:", {
      handles: enc.handles.length,
      handle0_bytes: enc.handles[0]?.length,
      inputProof_bytes: enc.inputProof.length,
    });

    banner("OK — next step is a tiny FHECounter contract");
    // eslint-disable-next-line no-console
    console.log(
      "Next: deploy a minimal fhEVM Counter on Sepolia → Encrypt → Store → Decrypt.",
    );
  } finally {
    relayer.terminate();
  }
}

main().catch((err) => {
  printError(err);
  warnWslDrvFs();
  process.exitCode = 1;
});
