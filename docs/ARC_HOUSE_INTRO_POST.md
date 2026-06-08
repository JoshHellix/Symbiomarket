# Arc House — introduction post (copy-paste)

**Where:** [Arc House](https://community.arc.io/home) → Publish a Post / community forum  
**Cadence:** Up to 1× per 24 hrs (10 points in Architects program)  
**Author:** Ikoro Joshua Klau · @SymbioMarket · [JoshHellix/Symbiomarket](https://github.com/JoshHellix/Symbiomarket)

---

## Suggested title

```
Introducing SymbioMarket — live agent economy on Arc (Agora build, still shipping)
```

---

## Post body (copy from line below through end of section)

Hi Arc House — I’m **Ikoro Joshua Klau**, building **SymbioMarket** from Nigeria. I submitted to the **Agora Agents Hackathon** (Canteen × Circle) and I’m keeping the momentum going here: public commits, Arc testnet activity, and Circle nanopayments in the same repo.

### What it is

**SymbioMarket** is a **live four-agent economic loop** — not a static demo UI:

- **Oracle** → **Strategist** → **Executor** → **Evaluator**  
- Python swarm writes real cycles every ~6s → dashboard at `/swarm`  
- **Transparent coordination** in the UI (who paid whom, why, cycle ID)  
- **Confidential amounts** via **Zama FHE** on Ethereum Sepolia (`FHECounter` deployed)  
- **Public settlement pulse** on **Arc testnet** after each FHE sync (Arcscan-verifiable)

The idea: agent economies need **both** privacy (don’t leak every payment amount on-chain) **and** auditability (prove settlement happened on Arc/USDC rails).

### What’s already built (open source)

- Repo: https://github.com/JoshHellix/Symbiomarket  
- Circle **arc-nanopayments** fork (x402, Gateway, USDC paths)  
- `agents/swarm_api.py` + `agents/arc_settle_swarm.py`  
- `fhe-contracts` — `npm run sync:swarm` pipeline  
- Sepolia FHE contract: `0x8Fe90e590E58b19127B760D07F4e79655bb90DEf`  
- Example Arc settlement: https://testnet.arcscan.app/tx/0x8e3076272c2bcb0b2e431627098f8fda471ebf8ab38730362c2555a9f20260a8  

Stage today: **MVP on testnet** — reproducible locally; pushing toward deployed `/swarm`, more Arc txs via **Canteen RPC**, and first full **x402 USDC** loop on Arc testnet.

### Why I’m here

Following the post-hackathon guidance: same GitHub handle as Agora, build in public, use Arc infrastructure regularly. I’d love feedback from other **agentic commerce / nanopayment** builders — especially anyone wiring **Gateway + x402** end-to-end.

I’ll post short weekly updates here (commits + Arc txs) as SymbioMarket evolves.

**X:** @SymbioMarket · **thread:** https://x.com/SymbioMarket/status/2060441414391959869  

Thanks for having me in Arc House — excited to learn from what others are shipping on Arc.

— Ikoro

---

## Shorter version (if character limit)

**Title:** `SymbioMarket — 4-agent swarm + FHE + Arc settlement`

**Body:**

Hi — Ikoro Joshua Klau (@SymbioMarket). Building **SymbioMarket** for Agora: live Oracle→Strategist→Executor→Evaluator swarm, Circle **nanopayments** fork, **Zama FHE** amounts on Sepolia, **Arc testnet** settlement pulses.

Open source: https://github.com/JoshHellix/Symbiomarket  
MVP on testnet; shipping in public weekly (Arc RPC + commits).

Would appreciate feedback from agentic payment builders on Arc. Weekly updates to follow.

— Ikoro
