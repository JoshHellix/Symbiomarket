# Circle Developer Grants — SymbioMarket application drafts

Copy sections into [Questbook](https://circle.questbook.app/proposal_form/?grantId=6992785dfb7e884efacadb1e&chainId=10).  
Replace `[BRACKETS]` with your real details.

Official criteria: [circle.com/grant](https://www.circle.com/grant)

---

## Applicant Details (you fill in)

| Field | Your value |
|-------|------------|
| First / last name | **Ikoro Joshua Klau** |
| Email | `[Your grant email — same as Questbook]` |
| Company legal entity | **Ikoro Joshua Klau** (individual / sole proprietor) |
| DBA / project name | **SymbioMarket** |
| Founder names, roles, bios | See template below |
| Project website | `https://github.com/JoshHellix/Symbiomarket` (add deployed `/swarm` when live) |
| X handle | **@SymbioMarket** |
| Founders location | Ikoro Joshua Klau, Founder/Developer, `[City]`, Nigeria |
| Business location | **Nigeria** |
| Incorporated? | **No** |

**Founder template (edit):**

> **Ikoro Joshua Klau**, Founder & Lead Developer (Nigeria) — Built SymbioMarket for the Arc hackathon: multi-agent swarm, Circle nanopayments fork, Zama FHE confidential ledger, and Arc testnet settlement. Background: [your real background — software, fintech, AI, etc.].

---

## Project Abstract

### Project Name (≤80 chars)

**SymbioMarket**

### One-liner (≤200 chars)

Live multi-agent economy on Arc with Circle nanopayments, homomorphic confidential bookkeeping (Zama FHE), and public Arc testnet settlement for agent-to-agent micro-payments.

### What problem are you solving and why is it important?

Autonomous AI agents are starting to pay each other, buy API access, and coordinate capital — but today’s stacks force a bad tradeoff: either publish every payment amount on-chain (leaking strategy and competitive structure) or stay off-chain (losing auditability for settlement and compliance).

As agentic commerce grows, platforms need **programmable USDC rails** with **sub-cent settlement** and **observable economic activity** without exposing sensitive agent economics. Circle’s Arc and Nanopayments are built for this future; builders still lack a **reference implementation** that combines a live agent swarm, real Circle payment infrastructure, and a credible confidentiality layer.

### What is your solution?

**SymbioMarket** is a real-time four-agent economic system (Oracle → Strategist → Executor → Evaluator) that:

1. Runs continuously in Python and streams structured cycles and micro-payments to a neon operations dashboard.
2. Integrates **Circle’s arc-nanopayments** stack (x402, Gateway, USDC) as the seller-side payment rail.
3. Encrypts swarm payment amounts into a **Zama FHE** ledger on Sepolia (homomorphic aggregate — amounts not visible on-chain in plaintext).
4. Anchors a **public settlement pulse on Arc testnet** after each confidential sync, provable on Arcscan.

One dashboard shows live agent coordination; two layers separate **transparent coordination** from **confidential amounts** and **public settlement proof**.

### Why hasn’t this problem been solved yet?

- **Technical:** FHE on-chain tooling (Zama) and Arc nanopayments are new; wiring them into one agent loop is non-trivial.
- **Product:** Most agent demos are simulated UI or single-chain bots — not end-to-end Circle Gateway + swarm + confidentiality.
- **Regulatory / trust:** Teams avoid on-chain agent treasuries without clear settlement and audit hooks; Arc + public receipts address the audit side while FHE addresses leakage.

### Why are you and your team uniquely suited?

We already **shipped** the hackathon path: live `swarm_api.py`, restored [symbiomarket-dashboard](https://symbiomkt-dashboard.vercel.app/) UI wired to real data, deployed FHECounter on Sepolia, and confirmed Arc testnet transactions. The repo is open and demo-ready ([JoshHellix/Symbiomarket](https://github.com/JoshHellix/Symbiomarket)). We are extending a proven Circle template rather than theorizing integrations.

---

## Product Alignment Track

### Is your project currently live in production?

**No** (or **Partial** if Questbook allows) — **live on testnet / local demo** with production-grade code paths. Not Arc mainnet production yet.

### Are you live on Arc?

**Yes — Arc testnet.** Public settlement transactions confirmed on [Arcscan](https://testnet.arcscan.app). Mainnet deployment planned post-grant milestones.

### Which other chain(s) are you currently live on?

**Ethereum Sepolia** (Zama FHE confidential ledger contract). Optional: mention **Ethereum Sepolia** only for FHE; agent economics settlement anchor is **Arc testnet**.

### Which Circle products are currently integrated? (video must validate)

Select and show in video:

- **Circle Nanopayments / x402** — `arc-nanopayments/` from Circle’s template; paywalled premium routes; Gateway balance/withdraw UI.
- **Circle Gateway** — gateway balance and withdraw flows in dashboard (when Supabase + env configured).
- **USDC** — template designed for testnet USDC via x402 buyer/seller wallets.
- **Arc** — testnet RPC, settlement script `agents/arc_settle_swarm.py`, Arcscan-verified txs.

*Video:* Walk `arc-nanopayments/lib/x402.ts`, `app/api/gateway/`, `agent.mts`, then Arc settle script + Arcscan.

### Which Circle products do you plan to integrate?

- **Full x402 USDC nanopayment loop** — autonomous buyer agent paying seller endpoints on Arc with persisted dashboard events (Supabase path documented).
- **Gateway production withdrawal flow** on Arc as mainnet approaches.
- **Deeper Arc-native USDC transfer** (replace self-transfer “pulse” with USDC settlement matching swarm payment amounts).
- Optional: **Circle Wallets / CCTP** if milestones expand treasury movement across chains.

---

## Milestones and Timelines

Propose **3 milestones** (USDC per milestone is negotiated with Circle — describe deliverables clearly).

### Milestone 1 — Production demo & Circle integration proof (Weeks 1–4)

**Title:** Live public demo + validated Nanopayments on Arc testnet

**Details:**

- Deploy `/swarm` dashboard (Vercel or similar) reading live swarm API.
- Record 5-min grant video: codebase walkthrough + live agent + Gateway/x402 + Arc settlement.
- Enable x402 testnet USDC: buyer agent → seller premium endpoints; payments visible in dashboard.
- Documentation: `docs/SYNC_COMMANDS.md`, architecture diagram, contract addresses.
- **Success criteria:** Public URL, ≥1 Arc testnet USDC-related tx via Circle stack, video link submitted.

### Milestone 2 — Agentic economy at scale (Weeks 5–8)

**Title:** Production-hardened swarm + Arc settlement per cycle

**Details:**

- Automate Arc settlement tied to each FHE sync (or every N swarm cycles).
- Persist swarm + payment state (Supabase or serverless API) for judges/users without local Python.
- Metrics on dashboard: volume, cycle PnL, payment count (already prototyped).
- Lod test: stable 24h swarm run with monitoring.
- **Success criteria:** 100+ documented agent payments + 10+ Arc settlement txs linked to cycles.

### Milestone 3 — Confidential agent treasury (Weeks 9–12)

**Title:** FHE agent economics + mainnet readiness plan

**Details:**

- Extend FHE contract or sync pipeline for additional encrypted fields (e.g. cumulative agent treasury).
- Publish “Arc mainnet migration” technical plan aligned with Circle BD feedback.
- Open-source grant playbook: “Agent swarm + Nanopayments + FHE” for other builders.
- **Success criteria:** Third-party can clone repo and reproduce demo in &lt;1 hour; written mainnet checklist approved by Circle technical review.

---

## Project Traction and Roadmap

### Current traction and success

- **Live agent swarm** — 4-agent loop writing `swarm_data.json` every ~6s; dashboard at `/swarm` with real-time feed (not mock RNG).
- **Arc testnet** — Confirmed settlement tx (e.g. `0xc17a1b25…` on [Arcscan](https://testnet.arcscan.app)).
- **Zama FHE** — `FHECounter` on Sepolia `0x8Fe90e590E58b19127B760D07F4e79655bb90DEf`; `npm run sync:swarm` pipeline operational.
- **Circle template** — Full `arc-nanopayments` fork with x402, Gateway, premium APIs.
- **Prior UI** — [symbiomkt-dashboard.vercel.app](https://symbiomkt-dashboard.vercel.app/) (hackathon); superseded by live-data `/swarm` in monorepo.
- **Metrics to cite when recording:** cycle count, session payment volume (USDC nominal in feed), Arc block in footer, win rate / PnL on chart.

*If asked for MAU/volume:* honest — **pre-production demo**; grant funds **production deployment and USDC tx volume on testnet**.

### Are you funded?

**No** (unless you have other funding — adjust honestly).

### Technical roadmap (high-level)

| Phase | Timeline | Work |
|-------|----------|------|
| Now | Week 0 | Grant video, Questbook submit, public repo polish |
| Q1 | Weeks 1–4 | Deployed demo, x402 USDC live on Arc testnet |
| Q2 | Weeks 5–8 | Persisted state, automated Arc settle, metrics |
| Q3 | Weeks 9–12 | FHE extensions, mainnet plan, builder docs |
| Post-grant | Arc mainnet | USDC settlement per agent payment; Gateway production |

**Circle integration timeline:** Nanopayments/x402 (M1) → Gateway withdraw + volume (M2) → Arc mainnet USDC (M3 planning).

### How will this grant support your roadmap?

Funding covers engineering time to move from **hackathon prototype** to **public production demo**: hosting, testnet USDC faucet ops, Supabase, video/production, and security review before mainnet. Milestone payments align deliverables with Circle’s goal of **agentic economic activity on Arc with real USDC infrastructure**.

---

## Deck and Demo

### Video (≤5 min) — structure for Circle requirements

Use [`docs/VIDEO_SCRIPT_3-4MIN.md`](VIDEO_SCRIPT_3-4MIN.md) and add **code walkthrough** sections:

1. **0:00–0:30** — Problem + SymbioMarket one-liner  
2. **0:30–1:30** — Live `/swarm` demo (agents, chart, payments)  
3. **1:30–2:30** — **Codebase:** `agents/swarm_api.py`, `arc-nanopayments/lib/x402.ts`, `app/api/gateway/`  
4. **2:30–3:30** — `npm run sync:swarm` → Sepolia Etherscan → FHE card  
5. **3:30–4:30** — Arc settlement + Arcscan; optional x402 payment if configured  
6. **4:30–5:00** — Milestones + ask  

**Link:** Upload unlisted YouTube / Drive → paste URL in form.

### Investor deck

If you don’t have a deck, use a **5-slide** outline:

1. Problem (agent payments + privacy)  
2. Solution (diagram: swarm → FHE → Arc)  
3. Demo screenshots + tx hashes  
4. Circle integrations (Nanopayments, Gateway, Arc)  
5. Milestones + team  

Upload PDF to Drive → paste link. **Ready-made PDF:** `docs/SymbioMarket_Grant_Deck.pdf` (regenerate: `python scripts/generate_grant_deck_pdf.py`). Markdown source: `docs/GRANT_DECK_5_SLIDES.md`.

---

## Conflict of Interest

**Select:** **No** — unless you work for Circle, have family at Circle, or advisory relationship (change if true).

**If they want text:**

> No actual, potential, or perceived conflict of interest. We are independent builders using Circle’s open-source nanopayments template and public Arc testnet; no employment or financial relationship with Circle.

---

## Post-hackathon (ongoing)

Weekly build + public post + Canteen RPC cadence: **`docs/POST_HACKATHON_PUBLIC_BUILD.md`**

---

## Quick checklist before submit

- [ ] Video shows **actual code** for Circle products  
- [ ] Video shows **working demo** (swarm + at least Arc; x402 if possible)  
- [ ] Milestones are **measurable**  
- [ ] Honest about **testnet vs mainnet**  
- [ ] Links work (repo, video, deck)
