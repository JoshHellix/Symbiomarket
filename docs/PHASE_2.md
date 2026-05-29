# Phase 2 — Confidential swarm + Arc ✅

**Status:** Demo-ready. FHE sync + Arc settlement + dashboard card all working.

## What was added

1. **Richer swarm payments** — `tx_id`, varied `purpose` labels, `fhe_status: pending`
2. **`npm run sync:swarm`** — encrypts latest payment → FHE ledger on Sepolia → writes `fhe_sync_state.json` → runs Arc settle
3. **Dashboard** — “Confidential agent economy (Zama FHE)” on `/swarm` and Agent swarm tab
4. **Phase 2b** — `agents/arc_settle_swarm.py`, `agents/arc_poll_tx.py`, `ARC_READ_RPC` for receipt polling

## Your workflow (3 terminals)

| Terminal | Command | Purpose |
|----------|---------|---------|
| 1 | `python3 agents/swarm_api.py` (WSL) | Live swarm |
| 2 | `npm run dev` in `arc-nanopayments` | Dashboard → `/swarm` |
| 3 | `npm run sync:swarm` in `fhe-contracts` (PowerShell) | FHE + Arc pipeline |

## Sync command (PowerShell)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

Refresh the dashboard — violet **Confidential** card + Arc badge `confirmed` when settlement completes.

## Environment

**Repo root `.env` (gitignored):**

```env
ARC_RPC=https://rpc.testnet.arc.network
ARC_READ_RPC=https://rpc.testnet.arc.network
PRIVATE_KEY=...
WALLET_ADDRESS=0x...
```

Use your Canteen/swarm URL for `ARC_RPC` if you prefer; keep **`ARC_READ_RPC`** on the public Arc RPC so receipts and `arc_poll_tx.py` work.

**`fhe-contracts/.env`:** `FHE_PRIVATE_KEY`, `FHEVM_SEPOLIA_RPC_URL`, `FHE_COUNTER_ADDRESS`

## If sync fails with `Relayer didn't response correctly. Bad JSON`

Transient Zama relayer issue:

1. Wait 30 seconds, run `npm run sync:swarm` again (retries built in).
2. `npm run increment:sepolia` — proves relayer + contract.
3. Disable VPN if it persists.

## Arc only (after FHE already synced)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python agents/arc_settle_swarm.py
```

Poll a known tx hash (if Canteen RPC hid the receipt):

```powershell
python agents/arc_poll_tx.py 0xYOUR_ARC_TX_HASH
```

## Grant / video

- One-pager: **`docs/GRANT_ONE_PAGER.md`**
- Recording checklist: **`docs/DEMO_SCRIPT.md`**

## Next (optional)

- Circle **x402** real USDC — `arc-nanopayments/.env.local` + Supabase (see `arc-nanopayments/README.md`)
- Deploy `/swarm` + persist JSON for judges without local clone
