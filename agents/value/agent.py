import time
from common.axl_client import AXLClient
from common.utils import logger

class ValueAgent:
    def __init__(self):
        self.client = AXLClient("value", 8084)
        logger.info("✅ Value Agent ready — Balanced high-odds logic")

    def build_accumulator(self, payload: dict):
        legs = payload.get("analyzed", [])
        params = payload.get("params", {})
        
        requested_legs = params.get("legs", 4)
        min_odds_target = params.get("min_odds", 20)
        risk_level = params.get("risk_level", "medium")

        logger.info(f"🎯 [Value] Target: {requested_legs} legs | Min odds: {min_odds_target} | Risk: {risk_level} | Available legs: {len(legs)}")

        if not legs:
            logger.warning("⚠️ [Value] No legs received from Form — using minimal fallback")
            # Emergency fallback: take whatever exists with lower bar
            selected = legs[:requested_legs]
        else:
            # Sort by confidence
            sorted_legs = sorted(legs, key=lambda x: x.get("confidence", 0), reverse=True)

            selected = []
            used_types = {}

            for leg in sorted_legs:
                bet_type = leg.get("recommended", "")
                confidence = leg.get("confidence", 55)

                # Relaxed but still quality-focused gates
                min_conf = 65 if min_odds_target >= 100 else 60
                if confidence < min_conf:
                    continue

                # Diversity
                if used_types.get(bet_type, 0) >= 2:
                    continue
                if bet_type == "Draw" and used_types.get("Draw", 0) >= 1:
                    continue

                selected.append(leg)
                used_types[bet_type] = used_types.get(bet_type, 0) + 1

                if len(selected) >= max(requested_legs, 4):
                    break

            # If still too few, take the best available (don't return 0)
            if len(selected) < 3 and legs:
                logger.warning(f"⚠️ Only {len(selected)} strong legs — taking best available")
                selected = sorted_legs[:max(requested_legs, 4)]

        # Calculate total odds
        total_odds = 1.0
        for leg in selected:
            odd = leg.get("real_odd") or leg.get("estimated_odd") or 1.85
            total_odds *= odd

        actual_legs = len(selected)
        logger.info(f"💰 Built {actual_legs}-leg accumulator | Total ~{round(total_odds, 2)}x")

        self.client.send(
            to_agent="critic",
            msg_type="proposed_accumulator",
            payload={
                "legs": selected,
                "total_odds": round(total_odds, 2),
                "params": params
            },
            cot_summary=f"Value built {actual_legs}-leg accumulator"
        )

    def run(self):
        while True:
            msg = self.client.receive()
            if msg and msg.get("type") == "analyzed_fixtures":
                self.build_accumulator(msg.get("payload", {}))
            time.sleep(0.35)

if __name__ == "__main__":
    ValueAgent().run()
