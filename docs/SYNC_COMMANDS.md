# FHE + Arc sync — copy-paste commands

Run these in order. **Terminal 1–2** stay running; **Terminal 3** is one-shot per demo.

---

## Terminal 1 — Live swarm (WSL)

```bash
cd /mnt/c/Users/dell/cursor-symbio/Symbiomarket
source venv/bin/activate
pip install -r requirements.txt
python3 agents/swarm_api.py
```

Wait until you see `[ok] Cycle N -> swarm updated` every ~6 seconds.

---

## Terminal 2 — Dashboard (any shell)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\arc-nanopayments
npm install
npm run dev
```

Open: **http://localhost:3000/swarm** (neon UI from [symbiomarket-dashboard](https://github.com/JoshHellix/symbiomarket-dashboard), wired to live `swarm_data.json`)

---

## One-time env files (if not done yet)

### Repo root `Symbiomarket/.env` (create from `.env.example`)

```env
ARC_RPC=https://rpc.testnet.arc-node.thecanteenapp.com/v1/YOUR_SWARM_KEY
ARC_READ_RPC=https://rpc.testnet.arc.network
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
WALLET_ADDRESS=0xYOUR_WALLET_ADDRESS
FHE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
FHEVM_SEPOLIA_RPC_URL=https://sepolia.drpc.org
```

### `fhe-contracts/.env`

```env
FHE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
FHEVM_SEPOLIA_RPC_URL=https://sepolia.drpc.org
FHE_COUNTER_ADDRESS=0x8Fe90e590E58b19127B760D07F4e79655bb90DEf
```

(Use your deployed counter address if different.)

### `fhe-contracts` — install once (PowerShell)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm install
```

### Windows Python deps for Arc script (PowerShell, once)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python -m pip install python-dotenv web3
```

---

## Terminal 3 — ONE sync (PowerShell) — the demo step

**After swarm has run ~30 seconds** (so `swarm_data.json` has payments):

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

This single command:

1. Reads latest payment from `swarm_data.json`
2. Encrypts amount → increments **FHECounter** on Sepolia (~1–2 min)
3. Writes `fhe_sync_state.json`
4. Runs **Arc settlement** (`arc_settle_swarm.py`)

Then **refresh** http://localhost:3000/swarm — Confidential card + Arc badge update.

---

## If Arc settle fails but FHE succeeded

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python agents/arc_settle_swarm.py
```

Poll confirmation (use your tx hash from Arcscan):

```powershell
python agents/arc_poll_tx.py 0xYOUR_ARC_TX_HASH
```

---

## Quick checks

```powershell
# Swarm file exists?
Test-Path c:\Users\dell\cursor-symbio\Symbiomarket\swarm_data.json

# FHE state after sync?
Get-Content c:\Users\dell\cursor-symbio\Symbiomarket\fhe_sync_state.json | Select-Object -First 30
```

---

## Do NOT use in WSL for FHE

```bash
# ❌ Often fails: "Failed to initialize FHE worker pool"
cd /mnt/c/Users/dell/.../fhe-contracts && npm run sync:swarm
```

Use **Windows PowerShell** for `npm run sync:swarm`.
