# SymbioMarket — Agentic Economic Swarm on Arc

## Overview

SymbioMarket is a real-time multi-agent economic system that simulates autonomous market participants interacting through continuous decision cycles, generating observable economic activity streams inspired by Arc’s settlement layer.

Instead of a single trading bot, SymbioMarket behaves like a **living agent economy** — where AI agents continuously reason, act, and evaluate market conditions.

---

## Live System

The system runs continuously and produces:

- Market state evolution
- Agent decision flows
- Trade execution events
- A real-time nanopayment activity feed

This creates a persistent, observable economic loop.

---

## Agent Architecture

The system consists of four coordinated agents:

- **Oracle** → interprets market signals  
- **Strategist** → decides actions  
- **Executor** → performs simulated or optional onchain execution  
- **Evaluator** → assesses outcomes  

Each cycle represents a full decision pipeline.

---

## Nanopayment Feed

A core feature is the **Nanopayment Feed** — a live stream of micro-transactions representing agent interactions.

These are not user payments, but **economic signals**, including:

- strategy propagation  
- execution confirmations  
- agent coordination flows  

This makes internal system activity transparent and traceable.

---

## Confidential + Arc stack (built)

| Layer | What |
|-------|------|
| **Swarm** | Python agents → `swarm_data.json` |
| **FHE** | Zama `FHECounter` on Sepolia — `npm run sync:swarm` |
| **Arc** | Public settlement pulse on Arc testnet (Canteen/Agora RPC) |
| **UI** | http://localhost:3000/swarm (no login) |

**On-chain proof (testnet):**

| Item | Link |
|------|------|
| FHE contract (Sepolia) | [`0x8Fe90e590E58b19127B760D07F4e79655bb90DEf`](https://sepolia.etherscan.io/address/0x8Fe90e590E58b19127B760D07F4e79655bb90DEf) |
| Latest FHE sync tx | [`0xb0df60…207d`](https://sepolia.etherscan.io/tx/0xb0df6050a24f4a4e079728634063a9cee7d1a75cb737720b4dc5a248cc97207d) |
| Latest Arc settlement | [`0x53dea2…e261`](https://testnet.arcscan.app/tx/0x53dea2c0bf37869878c6760d0851a6e4837297b0a9e20168af63eefcf2b4e261) |

**Arc RPC:** Send via Canteen/Agora URL in `.env` (`ARC_RPC`); read receipts via `ARC_READ_RPC`. Testnet tracks [arc-node v0.7.1+](https://github.com/circlefin/arc-node/tags) hard fork.

**Community:** [@SymbioMarket](https://x.com/SymbioMarket) · [Arc House intro](https://community.arc.io/home) · **Agora** (Canteen × Circle) submission — building in public per [`docs/POST_HACKATHON_PUBLIC_BUILD.md`](docs/POST_HACKATHON_PUBLIC_BUILD.md)

**Grant / demo docs:** [`docs/GRANT_ONE_PAGER.md`](docs/GRANT_ONE_PAGER.md) · [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) · [`docs/SYNC_COMMANDS.md`](docs/SYNC_COMMANDS.md) · [`docs/X402_NEXT.md`](docs/X402_NEXT.md)

## Arc Alignment

SymbioMarket is designed for Arc-style environments:

- high-frequency execution  
- low-cost settlement  
- agent-native financial coordination  

Phase 2b adds **live Arc testnet settlement** after each FHE sync (`agents/arc_settle_swarm.py`).

---

## Why This Matters

Markets are evolving toward autonomous participation.

SymbioMarket demonstrates:

> A shift from tools → to autonomous economic actors

Where agents continuously:

- observe  
- decide  
- execute  
- evaluate  

forming a persistent economic system.

---

## Tech Stack

- Python (swarm engine)
- Next.js / Circle arc-nanopayments (dashboard, x402 template)
- Zama FHE (`fhe-contracts`, Sepolia)
- Web3 (Arc testnet settlement)

---

## Run locally (minimal)

```bash
# Terminal 1 (WSL) — repo root
python3 agents/swarm_api.py

# Terminal 2 — arc-nanopayments
npm run dev
# → http://localhost:3000/swarm

# Terminal 3 (PowerShell) — after a few swarm cycles
cd fhe-contracts && npm run sync:swarm
```

Copy `.env.example` → `.env` at repo root. Use **Canteen `ARC_RPC`** + public **`ARC_READ_RPC`** (see `.env.example`). FHE keys: `fhe-contracts/.env.example`.

---

## Demo

👉 Record using [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md), then paste your Loom / YouTube link here.

---

## Live App (Optional)

👉 (Insert deployed link if you have one)

---

## Future Work

- Loom demo + deployed `/swarm` for judges  
- Full Circle x402 USDC on Arc (Supabase + `.env.local`)  
- USDC transfer instead of settlement pulse self-tx  
- More FHE fields (strategy score, treasury)  

---

## Summary

SymbioMarket is an experimental agent economy that models continuous decision-making, execution, and economic interaction — aligned with Arc’s vision of programmable financial systems.