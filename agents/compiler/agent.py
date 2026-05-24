import time
from common.axl_client import AXLClient
from common.utils import logger

class CompilerAgent:
    def __init__(self):
        self.client = AXLClient("compiler", 8081)
        logger.info("✅ Compiler ready (stable printing)")

    def compile_final_output(self, data: dict):
        legs = data.get("legs", [])
        total_odds = data.get("total_odds", 0)
        params = data.get("params", {})

        print("\n" + "="*80)
        print("🚀 AXL BET SWARM — FINAL ACCUMULATOR")
        print("="*80)

        print("\n📋 SELECTED LEGS & REASONING:")
        for i, leg in enumerate(legs, 1):
            print(f"\n{i}. {leg.get('home')} vs {leg.get('away')}")
            print(f"   🏆 League: {leg.get('league')}")
            print(f"   ⏰ Kickoff: {leg.get('kickoff')[:16]}")
            print(f"   📊 Form: {leg.get('form_summary')}")
            print(f"   📈 Key Stats: {leg.get('key_stats')}")
            print(f"   🎯 Recommended: {leg.get('recommended')} (Confidence: {leg.get('confidence', 0)}%)\n")

        print("-" * 60)
        print("✅ YOUR ACCUMULATOR BET SLIP")
        print("-" * 60)
        for leg in legs:
            print(f"• {leg.get('home')} vs {leg.get('away')}  →  {leg.get('recommended')}")

        print(f"\n📊 Total Odds: ~{total_odds}x")
        print(f"🎯 Avg Confidence: {sum(leg.get('confidence',0) for leg in legs)//len(legs) if legs else 0}%")
        print(f"⚠️  Risk Level: {params.get('risk_level','medium').upper()}")
        print(f"📌 Legs: {len(legs)} / {params.get('legs',4)} requested")
        print("\nThis is for entertainment purposes only. Gamble responsibly.")
        print("="*80)

    def run(self):
        while True:
            msg = self.client.receive()
            if msg and msg.get("type") == "proposed_accumulator":
                logger.info("🎉 Compiler received final data — printing output")
                self.compile_final_output(msg.get("payload", {}))
            time.sleep(0.3)

if __name__ == "__main__":
    CompilerAgent().run()
