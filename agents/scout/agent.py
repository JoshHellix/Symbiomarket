import time
from common.axl_client import AXLClient
from common.data_fetchers import DataFetcher
from common.utils import logger

class ScoutAgent:
    def __init__(self):
        self.client = AXLClient("scout", 8082)
        self.fetcher = DataFetcher()
        logger.info("✅ Scout Agent ready (sport-aware)")

    def find_fixtures(self, payload: dict):
        params = payload.get("params", {})
        legs = params.get("legs", 4)
        min_odds = params.get("min_odds")
        sport = params.get("sport", "football")
        days_ahead = params.get("days_ahead", 3)

        logger.info(f"🔍 [Scout] Processing {legs}-leg | sport={sport} | min_odds={min_odds} | days={days_ahead}")

        effective_sport = sport if sport != "any" else "football"
        fixtures = self.fetcher.get_upcoming_fixtures(
            sport=effective_sport,
            max_results=25,
            days_ahead=days_ahead
        )

        self.client.send("form", "fixtures_found", {
            "fixtures": fixtures,
            "params": params
        }, f"Scout found {len(fixtures)} fixtures")

    def run(self):
        while True:
            msg = self.client.receive()
            if msg and msg.get("type") == "refined_query":
                self.find_fixtures(msg.get("payload", {}))
            time.sleep(0.4)

if __name__ == "__main__":
    ScoutAgent().run()
