# Post-hackathon public build plan (SymbioMarket)

**Founder:** Ikoro Joshua Klau (Nigeria)  
**Public identity:** GitHub [JoshHellix/Symbiomarket](https://github.com/JoshHellix/Symbiomarket) · X [@SymbioMarket](https://x.com/SymbioMarket)  
**Goal:** Pretend the hackathon never stopped — visible commits, **Canteen/Arc RPC** activity, grant-ready milestones.

**Time budget:** ~4–6 hours/week total (solo). Adjust days; keep the **rhythm**, not the exact weekday.

**Start date:** Week 1 begins **Monday** (weekend = rest; optional Week 0 checklist only).

---

## Arc House ([community.arc.io](https://community.arc.io/home)) — why join

Arc House is Circle/Arc’s **official community hub** (not just Discord): events, replays, discussions, and the **Architects** recognition program ([intro blog](https://www.arc.network/blog/introducing-arc-house-and-the-architects-program)).

**How SymbioMarket benefits:**

| Opportunity | Why it matters for you |
|-------------|-------------------------|
| **Same narrative as Agora** | Agentic commerce, nanopayments, USDC on Arc — you already fit the [Agora hackathon](https://agora.thecanteenapp.com/) story |
| **Visibility** | Member Spotlight / content (Tier 2+) for builders shipping in public — your X + GitHub + Arc txs are the raw material |
| **Events** | [Arc Discord Office Hours](https://community.arc.io/home) (Tues 5:00 PM GMT); replays like *Agentic Demo Day* (AI + nanopayments on Arc) — learn pitch patterns, network |
| **Commerce Stack Challenge** | On Arc House home: **Apr 14 – Jul 13** — stablecoin commerce; SymbioMarket is a live reference (swarm + x402 + settlement) |
| **Architects points** | Hackathon participation, attending events, community content count toward tiers ([contribution opportunities](https://community.arc.io/public/resources/architects-contribution-opportunities), [tiers & benefits](https://community.arc.io/public/resources/architects-tiers-and-benefits)) |
| **Grants pipeline** | Complements Canteen referral + Circle Questbook — Arc team sees you in **two** places: Canteen Discord + Arc House |

**Your positioning (one sentence for Arc House profile / posts):**

> SymbioMarket — live four-agent economy on Arc: transparent coordination, Zama FHE amounts on Sepolia, settlement on Arc testnet, built on Circle Nanopayments.

**Arc House weekly add-on (~30 min, optional):**

| When | Action |
|------|--------|
| **Week 0** | [Join Community](https://community.arc.io/home) · sign in · complete profile · link GitHub + X @SymbioMarket |
| **Tue** (if free) | Attend or watch replay of **Arc Discord Office Hours** (5:00 PM GMT) |
| **After Fri X post** | Cross-post shortest version in Arc House **Discussions** (build log / tx proof) — same link as X |
| **Monthly** | Watch one **Content** replay (e.g. Agentic Demo Day); note 1 idea for SymbioMarket |

Do **not** spam Arc House; **one** discussion post per week max, same substance as your public build log.

---

## Week 0 — One-time setup (do before Week 1)

| # | Task | Done |
|---|------|------|
| 1 | Confirm Agora submission used **JoshHellix** GitHub | ☐ |
| 2 | `.env`: `ARC_RPC` = Canteen v0.7.1 URL from Discord; `ARC_READ_RPC=https://rpc.testnet.arc.network` | ☐ |
| 3 | Test: `python agents/arc_settle_swarm.py` → `confirmed` in `fhe_sync_state.json` | ☐ |
| 4 | Pin Arc CLI / toolkit link from Canteen Discord (install once) | ☐ |
| 5 | README: add “Live demo” + last Arc tx + FHE contract (one commit, public) | ☐ |
| 6 | Join [Arc House](https://community.arc.io/home) · profile + GitHub + @SymbioMarket | ☐ |

**Canteen RPC (send):**

```env
ARC_RPC=https://rpc.testnet.arc-node.thecanteenapp.com/v1/YOUR_SWARM_KEY
ARC_READ_RPC=https://rpc.testnet.arc.network
```

---

## Weekly rhythm (repeat every week)

### Overview

| Day | Focus | ~Time | Output |
|-----|--------|-------|--------|
| **Mon** | Build + commit | 90 min | 1+ GitHub commit on `main` |
| **Wed** | **On-chain ritual** (RPC + CLI) | 45 min | ≥1 Arc tx via Canteen RPC + proof link |
| **Fri** | **Public ship** | 30 min | 1 X post + optional Discord |
| **Sun** (optional) | Recap / plan | 15 min | Next week’s 1-line goal in Discord or notes |

**Minimum bar:** If you only have 3 hours that week → do **Wed (on-chain)** + **Fri (public post)** + one small **Mon commit**.

---

## Monday — Build & commit (technical)

**When (Nigeria WAT):** e.g. 8:00–9:30 PM or your best deep-work block.

**Do:**

1. Pull latest `main`.
2. Pick **one** small scope from [4-week sprint](#4-week-sprint) below.
3. Run local demo before commit:
   - WSL: `python3 agents/swarm_api.py` (background)
   - `cd arc-nanopayments && npm run dev` → `/swarm`
4. Commit with a **public-facing message** (judges read these):

   ```
   feat(arc): <what changed> — SymbioMarket public build week N
   ```

5. Push to **JoshHellix/Symbiomarket** (same day).

**Do not:** large refactors, private branches, silent weekends with zero commits.

---

## Wednesday — On-chain ritual (Canteen RPC + “CLI”)

**When:** Mid-week, same time slot each week (habit).

**Arc / Canteen RPC (required every Wed):**

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\fhe-contracts
npm run sync:swarm
```

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket
python agents/arc_settle_swarm.py
```

If receipt stuck:

```powershell
python agents/arc_poll_tx.py
```

**Verify:** `fhe_sync_state.json` → `arc.status: confirmed` and fresh `tx_hash`.

**CLI (use every Wed — pick what applies):**

| Tool | Command | Purpose |
|------|---------|---------|
| Arc/Circle CLI | From Canteen Discord install docs | Whatever they recommend for v0.7.1 (wallet, deploy, faucet) |
| Nanopayments | `cd arc-nanopayments && npm run agent` | x402 buyer agent (when env ready) |
| Wallets | `npm run generate-wallets` | Once, then fund buyer via Circle faucet |
| Swarm | `python3 agents/swarm_api.py` | Live cycles before demo/sync |

**Log for posts:** Copy Arcscan URL from `fhe_sync_state.json` → `arc.explorer_tx`.

**Discord (optional Wed):** One line in the builder channel (not DM):

> Week N · SymbioMarket · Arc settle via Canteen RPC · [Arcscan link] · commit: [short SHA or GitHub link]

---

## Friday — Public ship (X + assets)

**When:** Morning or lunch — good for reach.

**Post exactly one of these (rotate):**

### Template A — Tx proof (use after Wed ritual)

```
SymbioMarket — week [N] on @arc testnet

✓ 4-agent swarm live
✓ FHE sync (Sepolia)
✓ Arc settlement — [Arcscan link]

Building in public → github.com/JoshHellix/Symbiomarket
```

### Template B — Ship note (use after Mon deploy/feature)

```
Shipped on SymbioMarket (week [N]):

• [one bullet: e.g. deployed /swarm to Vercel]
• [one bullet: e.g. auto Arc settle after FHE sync]

Repo: github.com/JoshHellix/Symbiomarket
@circle @arc — agent economy + confidential amounts
```

### Template C — Thread reply (every 2 weeks)

Reply to your pinned thread with:

```
Update [N]: [one sentence]. Latest Arc tx: [link]. Still building — hackathon didn’t stop.
```

**Media:** 1 screenshot of `/swarm` or 20–40s screen recording every **other** Friday.

**Tags:** @arc @circle @zama only on milestone posts (not every Friday).

---

## Sunday (optional) — 15 min recap

- Write **one sentence** next week goal in `docs/POST_HACKATHON_PUBLIC_BUILD.md` (commit) or Discord.
- Check Questbook / grant email; no action unless they reply.

---

## 4-week sprint (what to build each week)

| Week | Mon build target | Wed on-chain | Fri public headline |
|------|------------------|--------------|---------------------|
| **1** | README: demo links, contract, last tx; fix anything broken on `main` | FHE sync + Arc settle on **Canteen RPC** | “Week 1: public repo + confirmed Arc tx” |
| **2** | Deploy `/swarm` to Vercel + Redis + swarm push — [`docs/VERCEL_DEPLOY.md`](VERCEL_DEPLOY.md) | 2× settle if stable (2 cycles) | Screenshot + live URL |
| **3** | Auto-call `arc_settle_swarm` after `sync:swarm` (or documented one-liner script) | Settle tied to cycle id in UI | “Automated Arc pulse per cycle” |
| **4** | x402: `generate-wallets` + one real testnet USDC payment (`docs/X402_NEXT.md`) | USDC-related Arc/Circle tx | “First real nanopayment on Arc stack” |

After week 4, repeat weeks 2–4 pattern: **deploy improvements → on-chain proof → public post**.

---

## Monthly targets (8–12 weeks)

| Target | Signal for Canteen / Circle |
|--------|-----------------------------|
| Public demo URL | Judges click without cloning |
| 10+ Arc txs | Arcscan history via Canteen RPC |
| 100+ swarm cycles logged | README or dashboard metric |
| 1 grant video refresh | Loom ≤5 min with code walkthrough |
| x402 USDC once | Circle product checkbox in video |

---

## What to post where (cheat sheet)

| Channel | Frequency | Content |
|---------|-----------|---------|
| **X @SymbioMarket** | 1×/week (Fri) | Tx link OR ship note OR biweekly thread reply |
| **Discord (Canteen builder channel)** | 1×/week (Wed or Fri) | Arcscan + GitHub commit link; questions only here |
| **Arc House Discussions** | 1×/week (after Fri X) | Same build log + links (optional, ~5 min) |
| **Arc House Events** | 1×/month or Tue office hours | Attend live or watch replay |
| **GitHub commits** | 1–3×/week (Mon + fixes) | Same handle as Agora |
| **Loom / video** | 1×/month | 3–5 min demo per `docs/VIDEO_SCRIPT_3-4MIN.md` |

**Never:** grant spam in DMs; fake “mainnet live” claims; posting without a commit or tx for 2+ weeks straight.

---

## Session checklist (print mentally)

**Every Wed:**

- [ ] `ARC_RPC` is Canteen URL (not only public RPC)
- [ ] `npm run sync:swarm` (PowerShell)
- [ ] `python agents/arc_settle_swarm.py`
- [ ] Arcscan link saved
- [ ] Optional Discord one-liner

**Every Fri:**

- [ ] X post (template A or B)
- [ ] Link repo or deployed URL

**Every Mon:**

- [ ] One scoped task from sprint table
- [ ] Commit + push `main`

---

## Copy-paste: Week 1 kickoff post (post this to start the plan)

**X (Fri):**

```
Starting the “hackathon never stopped” build log for SymbioMarket.

Week 1: public commits on github.com/JoshHellix/Symbiomarket, Arc settlement on Canteen RPC (v0.7.1), FHE on Sepolia.

Ikoro Joshua Klau · Nigeria · @arc @circle
```

**Discord:**

```
Hi — Ikoro (SymbioMarket). Following the post-event build guidance: same GitHub as Agora (JoshHellix/Symbiomarket), using Canteen RPC for Arc settles. Week 1 goal: README + public demo link + weekly Arc txs. Grant referral already submitted. Will post Arcscan links here weekly, not DMs.
```

---

## Related docs

- Commands: `docs/SYNC_COMMANDS.md`
- x402: `docs/X402_NEXT.md`
- Demo: `docs/DEMO_SCRIPT.md`
- Canteen form (done): `docs/CANTEEN_GRANT_REFERRAL.md`
- Applicant info: `docs/APPLICANT_PROFILE.md`

**Week log (fill in as you go):**

| Week | Mon commit | Wed Arc tx | Fri X post? | Notes |
|------|------------|------------|-------------|-------|
| 1 | *(delayed)* | 2026-06-08 catch-up | post today | 9-day gap; fresh Arc `0x53dea2…` + FHE `0xb0df60…` |
| 2 | | | | Deploy `/swarm` target |
| 3 | | | | |
| 4 | | | | |
