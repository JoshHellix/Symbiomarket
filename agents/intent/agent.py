import time
from common.axl_client import AXLClient
from common.llm import LLMClient
from common.utils import logger

class IntentAgent:
    def __init__(self):
        self.client = AXLClient("intent", 8080)
        self.llm = LLMClient()
        logger.info("✅ Intent Agent ready (improved high-odds + multi-sport parsing)")

    def process_query(self, query: str):
        prompt = f"""
        Parse this betting request into JSON. Be precise.
        Query: "{query}"

        Return ONLY valid JSON with these keys:
        - legs: int (default 4)
        - min_odds: int or null
        - max_odds: int or null
        - sport: string ("football", "any", "basketball", etc.)
        - risk_level: string ("low", "medium", "high")
        - days_ahead: int (0=today, 3=next 3 days, etc.)
        - time_window: string

        High odds like 100-200 means min_odds around 100.
        "all sports" or "any sport" → sport: "any"
        """

        try:
            response = self.llm.generate(prompt, temperature=0.0)
            import json
            params = json.loads(response)
            logger.info(f"✅ Parsed params: {params}")
        except:
            params = {"legs": 4, "min_odds": None, "sport": "football", "risk_level": "medium", "days_ahead": 3}
            logger.warning("⚠️ Parsing failed, using defaults")

        self.client.send("scout", "refined_query", {
            "query": query,
            "params": params
        }, "Intent parsed query")

    def run(self):
        while True:
            msg = self.client.receive()
            if msg and msg.get("type") == "user_query":
                self.process_query(msg["payload"]["query"])
            time.sleep(0.4)

if __name__ == "__main__":
    IntentAgent().run()
