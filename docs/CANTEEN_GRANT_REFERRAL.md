# Canteen → Circle grant referral (Discord form)

Paste into Canteen’s channel form. Use the **same email** as [circle.com/grants](https://circle.com/grants) Questbook.

---

## Your company name

```
Ikoro Joshua Klau (individual / sole proprietor)
```

## Your project name

```
SymbioMarket
```

## Your contact name / email

```
Ikoro Joshua Klau / [your Questbook email]
```

## What makes you high-signal? Why should we refer you?

```
SymbioMarket is a shipped Arc-hackathon build, not a slide deck: a live four-agent swarm (Oracle → Strategist → Executor → Evaluator) streaming real cycles to a Next.js dashboard, built on Circle’s arc-nanopayments fork (x402, Gateway, USDC paths).

We integrated three hard pieces end-to-end: (1) Circle Nanopayments template in-repo, (2) Zama FHE confidential amounts on Sepolia (deployed FHECounter 0x8Fe90e590E58b19127B760D07F4e79655bb90DEf + sync:swarm pipeline), (3) public Arc testnet settlement pulses with Arcscan-confirmed txs tied to swarm cycles.

Open source: https://github.com/JoshHellix/Symbiomarket — Circle grant + deck submitted. Thread: https://x.com/SymbioMarket/status/2060441414391959869

Founder: Ikoro Joshua Klau (Nigeria). Reference implementation for agent economy + confidential bookkeeping + Arc settlement on programmable USDC rails.
```

## What stage are you at?

```
MVP on testnet — live and reproducible from the repo. Not mainnet production; not revenue-generating yet.

Working today: Python swarm → /swarm dashboard, FHE sync on Sepolia, Arc testnet settlement with confirmed txs. Next: public deployed /swarm, full x402 USDC on Arc testnet, automated settle-per-cycle, mainnet readiness plan.
```

## Which Circle / Arc products are you using?

```
Arc testnet — settlement script (agents/arc_settle_swarm.py), Arcscan-verified txs (Canteen RPC for send; public RPC for receipts).

Circle Nanopayments / x402 — arc-nanopayments fork; premium routes; buyer/seller flow (x402.ts, agent.mts).

Circle Gateway — balance + withdraw APIs and dashboard UI (app/api/gateway/).

USDC — Arc testnet USDC in x402 config; milestone is live testnet USDC nanopayments.

Planned: deeper Gateway on testnet, Arc-native USDC per swarm payment; optional Wallets/CCTP later. Not using Stable FX or App Kits yet.
```
