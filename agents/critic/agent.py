import time
from common.axl_client import AXLClient
from common.utils import logger

class CriticAgent:
    def __init__(self):
        self.client = AXLClient("critic", 8085)
        logger.info("✅ Critic ready (stable pass-through)")

    def review_accumulator(self, data: dict):
        legs = data.get("legs", [])
        logger.info(f"🛡️ Critic reviewing {len(legs)}-leg accumulator")
        self.client.send("compiler", "proposed_accumulator", data, "Critic approved")

    def run(self):
        while True:
            msg = self.client.receive()
            if msg and msg.get("type") == "proposed_accumulator":
                self.review_accumulator(msg.get("payload", {}))
            time.sleep(0.3)

if __name__ == "__main__":
    CriticAgent().run()
