# SymbioMarket + Zama FHE — step-by-step roadmap

You are following **Phase 0 → Phase 1 (Zama) → Phase 2 (Arc + grant)**. No Solidity is required until **Phase 1b**; Phase 0 is all Python + TypeScript.

---

## Phase 0 — One dashboard (done in repo)

**Goal:** The Next.js app reads the same `swarm_data.json` the Python swarm writes.

### Step 0.1 — Python environment

1. Open a terminal at the repo root: `Symbiomarket/` (folder that contains `agents/` and `requirements.txt`).

**WSL / Linux / macOS** (use `python3`, forward slashes):

```bash
cd /mnt/c/Users/dell/cursor-symbio/Symbiomarket   # adjust if your path differs
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Windows PowerShell** (use `python`, backslashes optional):

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Do **not** mix Windows paths (`c:\...`) or `.\venv\Scripts\activate` inside WSL bash.

### Step 0.2 — Run the swarm

From the **repo root** (with venv activated):

```bash
python3 agents/swarm_api.py
```

Or without activating: `./venv/bin/python agents/swarm_api.py`

You should see `Cycle N → swarm updated` every ~6 seconds. A file **`swarm_data.json`** appears next to `agents/` (it is gitignored).

### Step 0.3 — Run the dashboard

In a **second** terminal:

```bash
cd arc-nanopayments
npm install
npm run dev
```

**Easiest (no Supabase):** open **http://localhost:3000/swarm** — no login, no database.

**Full dashboard:** sign in at `/` with `admin@example.com` / `123456`, then **Agent swarm** tab. Payments need Supabase in `.env.local` (see `arc-nanopayments/README.md`).

You should see cycles and simulated inter-agent payments updating every few seconds while `swarm_api.py` runs.

### Step 0.4 — If the swarm tab is empty

- Confirm `swarm_data.json` exists at `Symbiomarket/swarm_data.json` (not inside `arc-nanopayments/`).
- The API route reads `../swarm_data.json` relative to `arc-nanopayments/` (local dev). If you deploy to Vercel later, you will need a different persistence layer (e.g. Supabase) — we will add that when you are ready.

---

## Phase 1 — Zama FHE (Solidity starts here, gently)

**Goal:** One confidential numeric field (e.g. encrypted payment amount or encrypted “confidence bucket”) on a Zama-supported testnet, called from a small TypeScript script.

### Step 1.0 — FHE smoke test (no Solidity yet)

From `arc-nanopayments/`:

```bash
cp .env.example .env.local
npm install
npm run fhe
```

If you see an “OK” message and it prints an encrypted handle + input proof, you’re ready for Solidity.

**Run from Windows PowerShell** (WSL `/mnt/c` often fails with “Failed to initialize FHE worker pool”).

### Step 1.0b — Deploy FHECounter (Solidity, copy-paste)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
copy .env.example .env
# Edit .env → set FHE_PRIVATE_KEY (wallet with Sepolia ETH)
npm install
npm run compile
npm run deploy:sepolia
```

See `fhe-contracts/README.md` for details.

### Step 1.1 — Read Zama’s “getting started”

- Docs: [Zama Protocol documentation](https://docs.zama.ai/protocol)
- Examples: follow one **minimal** encrypt → contract → decrypt example.

You do not need to understand TFHE math. You need the **shape** of the workflow.

### Step 1.2 — Solidity (copy-paste + small edits)

Solidity is the language of **Ethereum-style contracts**. Your first file will look like “a class with rules,” not like Python.

- Install **Foundry** or **Hardhat** (we can pick one together when you start Phase 1; Foundry is popular for quick tests).
- You will mostly **edit numbers and names** in a tutorial contract first.

### Step 1.3 — TypeScript client

- Use **`@zama-fhe/sdk`** with **viem** (you already use viem in `arc-nanopayments`).
- Flow: build encrypted input → send transaction → later decrypt allowed outputs.

---

## Phase 2 — Tie FHE to Arc + Circle ✅ (demo-ready)

**Goal:** Public settlement on Arc + **private** agent bookkeeping via Zama FHE.

| Step | Status | Doc |
|------|--------|-----|
| Swarm → dashboard live feed | ✅ | Phase 0 above |
| FHE sync (`npm run sync:swarm`) | ✅ | `docs/PHASE_2.md` |
| Arc settlement pulse | ✅ | `agents/arc_settle_swarm.py` |
| Grant one-pager + demo script | ✅ | `docs/GRANT_ONE_PAGER.md`, `docs/DEMO_SCRIPT.md` |
| Loom / YouTube demo | 🔲 you | `docs/DEMO_SCRIPT.md` |
| Real Circle x402 USDC | 🔲 optional | `arc-nanopayments/README.md` |

**Quick sync (PowerShell, swarm + UI already running):**

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

Then refresh http://localhost:3000/swarm

---

## Files touched in Phase 0

| File | Role |
|------|------|
| `agents/repo_paths.py` | Stable repo paths (no more `/mnt/c/...`) |
| `agents/swarm_api.py` | Writes `swarm_data.json` at repo root |
| `arc-nanopayments/app/api/swarm/state/route.ts` | Serves JSON to the dashboard |
| `arc-nanopayments/hooks/use-swarm-state.ts` | Polls the API |
| `arc-nanopayments/app/dashboard/page.tsx` | **Agent swarm** tab |
| `requirements.txt` | Python dependencies |

**Next for you:** record a short demo (`docs/DEMO_SCRIPT.md`) and paste the link in root `README.md`. Optional: real x402 USDC per `arc-nanopayments/README.md`.
