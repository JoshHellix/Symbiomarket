#!/usr/bin/env python3
"""Generate SymbioMarket 5-slide grant deck PDF (landscape A4)."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "SymbioMarket_Grant_Deck.pdf"

# Brand-ish colors (oklch-inspired dark + neon green accent)
BG = (12, 18, 32)
ACCENT = (0, 220, 130)
TEXT = (230, 235, 245)
MUTED = (160, 170, 190)
WHITE = (255, 255, 255)


class GrantDeck(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="L", unit="mm", format="A4")
        self.set_auto_page_break(auto=False)
        self.set_margins(18, 16, 18)

    def _header(self, slide_num: int, title: str, subtitle: str = "") -> None:
        self.add_page()
        w, h = self.w, self.h
        self.set_fill_color(*BG)
        self.rect(0, 0, w, h, style="F")
        self.set_fill_color(*ACCENT)
        self.rect(0, 0, w, 3, style="F")
        self.set_text_color(*ACCENT)
        self.set_font("Helvetica", "B", 11)
        self.set_xy(18, 10)
        self.cell(0, 6, f"SYMBIOMARKET  |  SLIDE {slide_num}/5", ln=True)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 22)
        self.set_x(18)
        self.cell(0, 12, title, ln=True)
        if subtitle:
            self.set_text_color(*MUTED)
            self.set_font("Helvetica", "", 12)
            self.set_x(18)
            self.cell(0, 8, subtitle, ln=True)
        self.set_y(38)

    def _bullet(self, text: str, bold_prefix: str | None = None) -> None:
        self.set_x(22)
        self.set_text_color(*TEXT)
        self.set_font("Helvetica", "", 10.5)
        line_h = 5.5
        if bold_prefix:
            self.set_font("Helvetica", "B", 10.5)
            self.write(line_h, "-  " + bold_prefix)
            self.set_font("Helvetica", "", 10.5)
            self.write(line_h, text[len(bold_prefix) :] if text.startswith(bold_prefix) else text)
            self.ln(line_h + 1)
        else:
            self.multi_cell(self.w - 40, line_h, "-  " + text)

    def _small(self, text: str) -> None:
        self.set_text_color(*MUTED)
        self.set_font("Helvetica", "", 9)
        self.set_x(18)
        self.multi_cell(self.w - 36, 4.5, text)

    def _footer(self) -> None:
        self.set_y(self.h - 12)
        self.set_text_color(*MUTED)
        self.set_font("Helvetica", "", 8)
        self.set_x(18)
        self.cell(
            0,
            5,
            "github.com/JoshHellix/Symbiomarket  |  @SymbioMarket  |  Circle Developer Grants",
        )


def build() -> None:
    pdf = GrantDeck()

    # Slide 1
    pdf._header(1, "Problem", "Agent payments need privacy and auditability")
    pdf._bullet(
        "Autonomous agents pay each other, buy API access, and move micro-capital at high frequency.",
    )
    pdf._bullet(
        "Publishing every amount on-chain leaks strategy and competitive structure.",
    )
    pdf._bullet(
        "Staying fully off-chain removes proof for settlement, compliance, and ecosystem partners.",
    )
    pdf.ln(2)
    pdf._bullet("Programmable USDC and sub-cent settlement are built for agentic commerce.", bold_prefix="Why Circle / Arc: ")
    pdf._bullet(
        "Builders lack a reference stack: live agent economy + Circle rails + credible confidentiality.",
    )
    pdf.ln(3)
    pdf.set_text_color(*ACCENT)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_x(18)
    pdf.multi_cell(
        pdf.w - 36,
        6,
        "SymbioMarket - open coordination, encrypted amounts, public settlement proof.",
    )
    pdf._footer()

    # Slide 2
    pdf._header(2, "Solution", "Live four-agent economy -> FHE ledger -> Arc settlement")
    pdf._bullet("Oracle -> Strategist -> Executor -> Evaluator (cycle every ~6s)")
    pdf._bullet("Python swarm_api.py -> swarm_data.json -> Next.js /swarm dashboard")
    pdf.ln(1)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*WHITE)
    pdf.set_x(18)
    pdf.cell(0, 6, "Three layers", ln=True)
    rows = [
        ("Agent economy", "Dashboard", "-", "Who paid whom, purpose, cycle ID"),
        ("Confidential ledger", "Sepolia + Zama FHE", "Payment amounts", "Contract + tx hash"),
        ("Settlement pulse", "Arc testnet", "-", "Wallet, tx, Arcscan proof"),
    ]
    col_w = [42, 48, 42, 95]
    pdf.set_fill_color(25, 35, 55)
    pdf.set_text_color(*ACCENT)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_x(18)
    for i, h in enumerate(["Layer", "Where", "Hidden", "Public"]):
        pdf.cell(col_w[i], 7, h, border=0, fill=True)
    pdf.ln()
    pdf.set_text_color(*TEXT)
    pdf.set_font("Helvetica", "", 8.5)
    for row in rows:
        pdf.set_x(18)
        for i, cell in enumerate(row):
            pdf.cell(col_w[i], 6.5, cell[:38], border=0, fill=True)
        pdf.ln()
    pdf.ln(2)
    pdf._small(
        "Flow: Swarm -> sync:swarm -> Sepolia FHECounter -> Arc pulse -> fhe_sync_state.json -> UI"
    )
    pdf._footer()

    # Slide 3
    pdf._header(3, "Demo & on-chain proof", "Shipped on testnet - not mock UI")
    pdf._bullet("python3 agents/swarm_api.py - four agents, real cycles")
    pdf._bullet("arc-nanopayments: npm run dev -> localhost:3000/swarm")
    pdf._bullet("fhe-contracts: npm run sync:swarm - FHE sync + Arc pulse")
    pdf.ln(2)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_x(18)
    pdf.cell(0, 6, "Deployed contract (Sepolia)", ln=True)
    pdf.set_font("Courier", "", 9)
    pdf.set_text_color(*ACCENT)
    pdf.set_x(18)
    pdf.multi_cell(pdf.w - 36, 5, "FHECounter: 0x8Fe90e590E58b19127B760D07F4e79655bb90DEf")
    pdf.ln(1)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*WHITE)
    pdf.set_x(18)
    pdf.cell(0, 6, "Proof transactions", ln=True)
    pdf.set_font("Courier", "", 7.5)
    pdf.set_text_color(*MUTED)
    pdf.set_x(18)
    pdf.multi_cell(
        pdf.w - 36,
        4,
        "FHE: sepolia.etherscan.io/tx/0xe3c7899085b72092c4c33504d8de71cc5ee0a6cd855767641fe6fcec8744bce6",
    )
    pdf.set_x(18)
    pdf.multi_cell(
        pdf.w - 36,
        4,
        "Arc:  testnet.arcscan.app/tx/0x8e3076272c2bcb0b2e431627098f8fda471ebf8ab38730362c2555a9f20260a8",
    )
    pdf.ln(1)
    pdf._small(
        "Traction: pre-production demo; 759+ swarm cycles in development. "
        "Grant: public deploy + USDC volume on Arc testnet."
    )
    pdf._footer()

    # Slide 4
    pdf._header(4, "Circle integrations", "Built on Circle stack - extending, not greenfield")
    items = [
        ("Nanopayments / x402", "arc-nanopayments fork; premium APIs; buyer/seller flow"),
        ("Circle Gateway", "Balance + withdraw UI (app/api/gateway/)"),
        ("USDC", "Arc testnet USDC in x402 config; documented testnet flows"),
        ("Arc", "arc_settle_swarm.py - confirmed settlement txs on Arcscan"),
    ]
    for name, desc in items:
        pdf._bullet(f"{name}: {desc}")
    pdf.ln(2)
    pdf._small(
        "Grant video paths: swarm_api.py, lib/x402.ts, gateway APIs, sync-swarm-payment.ts"
    )
    pdf.ln(1)
    pdf._bullet("Planned: full x402 USDC on Arc; Gateway withdraw; USDC settlement per payment")
    pdf._footer()

    # Slide 5
    pdf._header(5, "Milestones & team", "12-week grant plan")
    milestones = [
        ("M1 (wk 1-4)", "Public demo + Nanopayments", "Deployed /swarm; video; Arc USDC tx via Circle stack"),
        ("M2 (wk 5-8)", "Hardened swarm + Arc/cycle", "100+ payments; 10+ Arc settlements linked"),
        ("M3 (wk 9-12)", "FHE treasury + mainnet plan", "Extended FHE; builder playbook; repro <1 hr"),
    ]
    for m, title, crit in milestones:
        pdf.set_x(18)
        pdf.set_text_color(*ACCENT)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(28, 6, m, ln=0)
        pdf.set_text_color(*WHITE)
        pdf.cell(80, 6, title, ln=0)
        pdf.set_text_color(*MUTED)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(0, 6, crit, ln=True)
    pdf.ln(4)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_x(18)
    pdf.cell(0, 7, "Ikoro Joshua Klau - Founder & Lead Developer", ln=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*TEXT)
    pdf.set_x(18)
    pdf.multi_cell(
        pdf.w - 36,
        5.5,
        "Built SymbioMarket for Arc hackathon: multi-agent swarm, Circle nanopayments, "
        "Zama FHE ledger, Arc testnet settlement. Nigeria | solo | not otherwise funded | open source.",
    )
    pdf.ln(2)
    pdf.set_text_color(*ACCENT)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_x(18)
    pdf.cell(0, 8, "Confidential agent economics on programmable USDC rails.", ln=True)
    pdf._footer()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
