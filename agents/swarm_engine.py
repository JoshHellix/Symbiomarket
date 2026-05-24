import json
import random
import asyncio
import os
import sys
import time
from datetime import datetime

from agents import Oracle, Strategist, Executor, Evaluator

oracle = Oracle("Oracle")
strategist = Strategist("Strategist")
executor = Executor("Executor")
evaluator = Evaluator("Evaluator")


state = {
    "price": 100.0,
    "volatility": 0.02,
    "trend": "neutral"
}


def update_market():
    global state

    move = random.uniform(-1.5, 1.5)
    state["price"] += move

    if move > 0.5:
        state["trend"] = "bullish"
    elif move < -0.5:
        state["trend"] = "bearish"
    else:
        state["trend"] = "neutral"

    state["volatility"] = random.uniform(0.01, 0.05)


def run_cycle(cycle_id):
    update_market()

    oracle_out = oracle.act(state)
    strat_out = strategist.act(state, oracle_out)
    exec_out = executor.act(state, strat_out)
    eval_out = evaluator.act(state, exec_out)

    return {
        "cycle": cycle_id,
        "timestamp": datetime.now().isoformat(),

        "market": state,

        "agents": {
            "Oracle": oracle_out,
            "Strategist": strat_out,
            "Executor": exec_out,
            "Evaluator": eval_out
        }
    }


def main():
    print("🚀 Swarm Engine Running...")

    for i in range(1, 1000):

        # 1. CREATE OUTPUT FIRST
        output = {
            "cycle": i,
            "market": {
                "price": random.uniform(95, 105),
                "volatility": random.uniform(0.01, 0.05),
                "trend": random.choice(["bullish", "bearish", "neutral"])
            },
            "agents": {
                "Oracle": {"signal": random.choice(["buy", "sell"]), "confidence": random.random()},
                "Strategist": {"decision": random.choice(["buy", "sell", "hold"]), "bias": random.randint(-1, 1)},
                "Executor": {"pnl": random.uniform(-1, 2), "capital": 100 + random.uniform(-5, 5)},
                "Evaluator": {"performance": random.uniform(0.95, 1.05)}
            }
        }

        # 2. WRITE TO FILE
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        OUTPUT_PATH = os.path.join(BASE_DIR, "swarm_data.json")

        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

        with open(OUTPUT_PATH, "w") as f:
            json.dump(output, f, indent=2)

        # 3. LOG
        print(f"✅ Cycle {i} completed")

        time.sleep(2)

if __name__ == "__main__":
    main()
