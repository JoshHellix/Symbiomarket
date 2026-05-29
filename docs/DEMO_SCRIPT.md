# SymbioMarket — demo recording checklist

**Full 3–4 min narration (word-for-word):** [`VIDEO_SCRIPT_3-4MIN.md`](VIDEO_SCRIPT_3-4MIN.md)

Quick 2-minute outline below. Use the video script for grant / Loom recordings.

---

## Before recording

- [ ] Terminal 1: swarm running (`python3 agents/swarm_api.py` in WSL)
- [ ] Terminal 2: dashboard running (`npm run dev` in `arc-nanopayments`)
- [ ] Browser tab: http://localhost:3000/swarm
- [ ] `fhe-contracts/.env` has `FHE_COUNTER_ADDRESS` and `FHE_PRIVATE_KEY`
- [ ] Repo root `.env` has `ARC_RPC`, `ARC_READ_RPC`, `PRIVATE_KEY`, `WALLET_ADDRESS`

Optional: run one sync before recording so the Confidential card already shows data; then run a **second** sync on camera for a fresh cycle.

---

## Scene 1 — Live agent economy (30s)

**Show:** `/swarm` page — cycle counter ticking, agent pipeline, payment feed.

**Say:**

> This is SymbioMarket — four agents in a loop: Oracle reads signals, Strategist decides, Executor acts, Evaluator scores. Every few seconds we get a new cycle and simulated micro-payments between agents.

**Point at:** latest payment row (from → to, amount, purpose).

---

## Scene 2 — Confidential layer (45s)

**Show:** scroll to **Confidential agent economy (Zama FHE)** card.

**Say:**

> Payment amounts are sensitive. We sync the latest swarm payment into a Zama FHE contract on Sepolia. The amount is encrypted; the chain only sees ciphertext. The contract homomorphically adds to a running total — we decrypt only with our wallet.

**Do (PowerShell, cut or speed up in edit):**

Full copy-paste (all terminals + env): **`docs/SYNC_COMMANDS.md`**

One-liner for the video:

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

**Show after refresh:**

- Decrypted total on the card
- **Sepolia tx** link (Etherscan)

**Say:**

> That Sepolia transaction is the confidential ledger update — not the public settlement yet.

---

## Scene 3 — Arc public settlement (30s)

**Show:** **Arc public settlement** badge → `confirmed`, Arcscan link.

**Say:**

> After FHE, we anchor a public pulse on Arc testnet — real USDC-scale activity on Circle’s Arc stack. Auditors get a clear on-chain receipt; competitors still don’t get plaintext amounts from the FHE layer.

**Open:** Arcscan tx (Success, your wallet).

If sync did not auto-settle Arc:

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python agents/arc_settle_swarm.py
python agents/arc_poll_tx.py 0xYOUR_TX_HASH
```

---

## Scene 4 — Close (15s)

**Say:**

> SymbioMarket combines autonomous agents, Zama confidential economics, and Arc settlement — built on Circle’s nanopayments template. Next step is full x402 USDC flows on the same dashboard.

**Show:** optional tab on full `/dashboard` if Supabase is configured.

---

## Troubleshooting on camera

| Issue | Fix |
|-------|-----|
| Empty swarm | Start `swarm_api.py`; wait 10s |
| FHE worker pool error | Use **PowerShell**, not WSL `/mnt/c` |
| Relayer Bad JSON | Wait 30s; run `npm run sync:swarm` again |
| Arc poll stuck on `waiting...` | Ctrl+C; ensure `ARC_READ_RPC` in `.env`; refresh page (state may already be confirmed) |
| WSL `python` not found | Use `python3` |

---

## After upload

Paste your video URL into root `README.md` under **Demo**.
