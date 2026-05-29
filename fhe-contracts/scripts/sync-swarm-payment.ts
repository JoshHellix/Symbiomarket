/**
 * Phase 2: Read latest swarm payment → encrypt amount → add to FHECounter on Sepolia.
 * Writes ../fhe_sync_state.json for the dashboard.
 *
 * Run: npm run sync:swarm
 */

import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import hre, { ethers } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

const SCALE = 1_000_000; // USDC-style 6 decimals → integer micro-units

type SwarmPayment = {
  from: string;
  to: string;
  amount: number;
  purpose: string;
  time: string;
  tx_id?: string;
};

type SwarmState = {
  cycle: number;
  payments: SwarmPayment[];
};

function repoRoot() {
  return join(process.cwd(), "..");
}

function amountToMicro(amount: number): number {
  const micro = Math.round(amount * SCALE);
  if (micro <= 0) return 1;
  if (micro > 4_000_000_000) {
    throw new Error(`Amount too large for euint32 micro scale: ${amount}`);
  }
  return micro;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Zama relayer sometimes returns non-JSON (network blip). Retry like increment:sepolia. */
async function retry<T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      const msg = e instanceof Error ? e.message : String(e);
      const retryable =
        msg.includes("Bad JSON") ||
        msg.includes("Relayer") ||
        msg.includes("timeout") ||
        msg.includes("ECONNRESET") ||
        msg.includes("fetch failed");
      if (!retryable || i === attempts) break;
      const waitSec = 8 * i;
      console.warn(`${label}: attempt ${i}/${attempts} failed (${msg}). Retry in ${waitSec}s…`);
      await sleep(waitSec * 1000);
    }
  }
  throw last;
}

async function main() {
  const ledgerAddress = process.env.FHE_COUNTER_ADDRESS?.trim();
  if (!ledgerAddress) {
    throw new Error("Set FHE_COUNTER_ADDRESS in fhe-contracts/.env");
  }

  const swarmPath = join(repoRoot(), "swarm_data.json");
  const raw = await readFile(swarmPath, "utf-8");
  const swarm = JSON.parse(raw) as SwarmState;

  const payment = swarm.payments[0];
  if (!payment) {
    throw new Error("No payments in swarm_data.json — start swarm_api.py first");
  }

  const microAmount = amountToMicro(payment.amount);
  const txLabel = payment.tx_id ?? `TX-${String(swarm.cycle).padStart(6, "0")}`;

  console.log("Swarm cycle:", swarm.cycle);
  console.log("Payment:", payment.from, "→", payment.to, `$${payment.amount}`, payment.purpose);
  console.log("Encrypted increment (micro-units):", microAmount);

  const [signer] = await ethers.getSigners();

  console.log("Connecting to Zama relayer (may take 30–90s, with retries)…");
  await retry("FHEVM init", () => hre.fhevm.initializeCLIApi());

  const counter = await ethers.getContractAt("FHECounter", ledgerAddress);
  await hre.fhevm.assertCoprocessorInitialized(counter, "FHECounter");

  const encrypted = await retry("Encrypt payment", async () => {
    const input = hre.fhevm.createEncryptedInput(ledgerAddress, signer.address);
    input.add32(microAmount);
    return input.encrypt();
  });

  console.log("Submitting confidential ledger update on Sepolia...");
  const receipt = await retry("Sepolia tx", async () => {
    const tx = await counter.increment(encrypted.handles[0], encrypted.inputProof);
    return tx.wait();
  });

  const encryptedTotal = await counter.getCount();
  const clearMicro = await retry("Decrypt total", () =>
    hre.fhevm.userDecryptEuint(FhevmType.euint32, encryptedTotal, ledgerAddress, signer),
  );

  const decryptedTotalUsdc = Number(clearMicro) / SCALE;

  const syncState = {
    cycle: swarm.cycle,
    updated_at: new Date().toISOString(),
    payment: { ...payment, tx_id: txLabel },
    fhe: {
      ledger_address: ledgerAddress,
      sepolia_tx: receipt?.hash ?? null,
      micro_added: microAmount,
      decrypted_total_micro: clearMicro.toString(),
      decrypted_total_usdc: decryptedTotalUsdc,
      explorer_tx: receipt?.hash
        ? `https://sepolia.etherscan.io/tx/${receipt.hash}`
        : null,
      explorer_contract: `https://sepolia.etherscan.io/address/${ledgerAddress}`,
    },
    arc: {
      status: "pending_public_settlement",
      note: "Public Arc USDC settlement runs separately (Phase 2b). FHE layer hides aggregate agent economics on Sepolia.",
      simulated_public_amount_usdc: payment.amount,
    },
  };

  const outPath = join(repoRoot(), "fhe_sync_state.json");
  await writeFile(outPath, JSON.stringify(syncState, null, 2), "utf-8");

  console.log("\nConfidential total (decrypted):", decryptedTotalUsdc, "USDC (scaled sum)");
  console.log("Sepolia tx:", receipt?.hash);
  console.log("Wrote", outPath);

  console.log("\nArc public settlement (Phase 2b)...");
  try {
    execSync("python agents/arc_settle_swarm.py", {
      cwd: repoRoot(),
      stdio: "inherit",
    });
  } catch {
    console.warn("[sync] Arc settlement skipped or failed — check .env ARC_RPC + PRIVATE_KEY");
  }
}

main().catch((err) => {
  console.error("[sync-swarm] failed:", err instanceof Error ? err.message : err);
  console.error(
    "\nTips: wait 30s and run again; try: npm run increment:sepolia (proves relayer works); check VPN/firewall.",
  );
  process.exitCode = 1;
});
