# SymbioMarket — 3–4 minute video script (read aloud)

**Target length:** 3:30–4:00 at a calm pace  
**Tone:** Confident, simple — you built a live demo, not a slide deck.

---

## Before you hit Record

1. Terminal 1 (WSL): `python3 agents/swarm_api.py` — leave running  
2. Terminal 2: `cd arc-nanopayments && npm run dev`  
3. Browser: http://localhost:3000/swarm — cycle number ticking  
4. Optional: run `npm run sync:swarm` once **before** recording so FHE/Arc cards are filled; run **again on camera** (or speed up that clip in edit)

**Layout:** Browser large, terminal small (or switch tabs when you run sync).

---

## Timing map

| Time | Scene | On screen |
|------|--------|-----------|
| 0:00–0:35 | Hook + what it is | `/swarm` loading → full dashboard |
| 0:35–1:35 | Live agent economy | Cycle #, agent cards, topology, payment feed |
| 1:35–2:25 | Why FHE | Scroll to Confidential card (or explain before sync) |
| 2:25–3:15 | Sync demo | PowerShell: `npm run sync:swarm` → refresh → Sepolia link |
| 3:15–3:45 | Arc settlement | Arc `confirmed` + open Arcscan |
| 3:45–4:00 | Close | Back to dashboard or your face |

---

## Full narration (read this)

### 0:00 — Opening (≈35 sec)

> Hi — this is **SymbioMarket**: a live **multi-agent economy** built for **Arc** and **confidential finance** with **Zama FHE**.
>
> Instead of one trading bot, you get four agents working in a loop — **Oracle, Strategist, Executor, and Evaluator** — like a small autonomous firm. They run continuously, generate micro-payments between each other, and everything you see on this dashboard is fed in real time from our Python swarm, not fake random numbers.

*Show: neon dashboard, “Live swarm” / cycle counter going up.*

---

### 0:35 — Agent economy (≈60 sec)

> Here’s the **cycle counter** — every few seconds we complete another decision round.
>
> On the left, **active agents**: Oracle aggregates market-style signals, Strategist turns that into a decision, Executor records PnL for the cycle, and Evaluator feeds learning back into the loop. The **swarm topology** is the same pipeline, visualized as a graph.
>
> On the right, **cycle performance** is the executor PnL over recent cycles — green bars are positive cycles, red are negative.
>
> And this **nanopayment feed** is the economic activity between agents: who paid whom, how much, and why — things like strategy relay, oracle intel, execution confirm. This is the observable **agent economy** we want on programmable money rails.

*Point at: one payment row, one agent card, one bar in the chart.*

---

### 1:35 — The problem + confidential layer (≈50 sec)

> The tension for agent economies on-chain is: you want **auditability**, but you don’t want to leak **every payment amount** to competitors.
>
> So we split the story into two layers.
>
> **Layer one** — what you just saw — is transparent coordination: cycles, roles, and payment *structure*.
>
> **Layer two** — scroll down — is **confidential bookkeeping** on **Ethereum Sepolia** using **Zama fully homomorphic encryption**. When we sync a swarm payment, the amount is **encrypted** before it hits the contract. The chain stores ciphertext; the contract **adds homomorphically** to a running total. Only our wallet can decrypt that aggregate — so public explorers don’t get plaintext economics from chain data alone.

*Show: Confidential FHE card (even if from a previous sync).*

---

### 2:25 — Live sync (≈50 sec) — *cut or speed up if slow*

> I’ll sync the **latest** swarm payment now — one command ties the live feed to the FHE ledger and then to **Arc testnet**.

*Run (PowerShell):*

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

> This takes about one to two minutes because Zama’s relayer and Sepolia need to cooperate — in an edit you can speed this up.

*After refresh:*

> Here’s the **Sepolia transaction** — that’s the confidential ledger update. The decrypted total you see is only for the ledger owner; everyone else sees encrypted state on-chain.

*Click Etherscan link.*

---

### 3:15 — Arc public settlement (≈30 sec)

> The third piece is **public settlement on Arc testnet** — Circle’s chain for fast, low-cost, USDC-native infrastructure.
>
> After FHE, we broadcast a **settlement pulse** on Arc. Auditors get a real receipt on **Arcscan** — wallet, tx hash, success — tied to the same swarm cycle. So the pitch is: **confidential economics on Sepolia, public settlement anchor on Arc**.

*Show: Arc badge **confirmed**, open Arcscan tx.*

---

### 3:45 — Closing (≈15–20 sec)

> SymbioMarket is built on Circle’s **arc-nanopayments** template — the same stack that supports **x402** micro-USDC — plus our Python swarm and Zama FHE contracts. Next step is wiring full Gateway nanopayments into the same dashboard; the agent loop and confidential layer are already live.
>
> Thanks for watching — links to the repo and contract addresses are in the README.

*Optional: flash `/dashboard` Payments tab if you have Supabase later.*

---

## Short teleprompter (if you hate reading paragraphs)

1. **Intro:** Multi-agent economy on Arc + Zama — four agents, live dashboard, real Python swarm.  
2. **UI:** Cycle ticks → agents + topology → chart PnL → nanopayment feed (who / how much / why).  
3. **Problem:** Auditability vs leaking amounts — two layers.  
4. **FHE:** Encrypt amount on Sepolia, homomorphic sum, only we decrypt.  
5. **Sync:** `npm run sync:swarm` → Sepolia tx.  
6. **Arc:** Confirmed pulse on Arcscan — confidential + public settlement.  
7. **Outro:** Circle template, x402 next, repo in README.

---

## One-sentence version (title / thumbnail / grant form)

> SymbioMarket runs a live four-agent economic swarm, encrypts payment amounts into a Zama FHE ledger on Sepolia, and anchors public settlement on Arc testnet — confidential agent economics on programmable USDC rails.

---

## Editing tips

- **Jump-cut** the 1–2 min `sync:swarm` wait; keep your voice: “running sync now…” then cut to “done — refresh.”  
- **Zoom** cursor on cycle #, one payment, Sepolia link, Arcscan success.  
- **Music:** low synth / ambient; don’t cover your voice.  
- **Captions:** spell Zama, Sepolia, Arc, FHE once in the first 30 seconds.

---

## If something breaks on camera

| Issue | What to say |
|-------|-------------|
| Swarm empty | “Swarm boots in a few seconds — here we go” (wait for cycle 1) |
| Sync slow | “Relayer + Sepolia — normal for FHE” (cut in edit) |
| Arc already confirmed | “Settlement already confirmed from our last run — same pipeline” |

Commands backup: **`docs/SYNC_COMMANDS.md`**
