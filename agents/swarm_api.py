import json
import random
import asyncio
from datetime import datetime

# ---------------------------
# SWARM MEMORY (LEARNING STATE)
# ---------------------------
swarm_memory = {
    "oracle_bias": 1.0,
    "risk_factor": 1.0,
    "learning_rate": 0.02
}

# ---------------------------
# AGENTS (IDENTITY LAYER)
# ---------------------------
AGENTS = ["Oracle", "Strategist", "Executor", "Evaluator"]

data = {
    "cycles": [],
    "payments": [],
    "agents": {
        "Oracle": {"status": "active"},
        "Strategist": {"status": "active"},
        "Executor": {"status": "active"},
        "Evaluator": {"status": "active"}
    }
}

# ---------------------------
# MARKET ENGINE
# ---------------------------


def generate_market():
    price = 100 + random.uniform(-6, 6)
    volatility = random.uniform(0.01, 0.06)

    if volatility > 0.05:
        trend = "volatile"
    elif price > 101:
        trend = "bullish"
    elif price < 99:
        trend = "bearish"
    else:
        trend = "neutral"

    return {
        "price": round(price, 4),
        "volatility": round(volatility, 6),
        "trend": trend
    }

# ---------------------------
# ORACLE (SIGNAL GENERATOR)
# ---------------------------


def oracle_act(market):
    bias = swarm_memory["oracle_bias"]

    if market["trend"] == "bullish":
        signal = "buy"
    elif market["trend"] == "bearish":
        signal = "sell"
    elif market["trend"] == "volatile":
        signal = random.choice(["hold", "sell"])
    else:
        signal = random.choice(["buy", "hold"])

    confidence = max(0.55, min(0.99, bias * random.uniform(0.7, 1.0)))

    return {
        "signal": signal,
        "confidence": confidence
    }

# ---------------------------
# STRATEGIST (FILTER / DECISION LAYER)
# ---------------------------


def strategist_act(oracle_msg, market):
    risk = swarm_memory["risk_factor"]

    if market["volatility"] > 0.055:
        return {"decision": "hold", "bias": 0}

    if oracle_msg["confidence"] < 0.7 * risk:
        decision = "hold"
    else:
        decision = oracle_msg["signal"]

    bias = 1 if decision == "buy" else -1 if decision == "sell" else 0

    return {
        "decision": decision,
        "bias": bias
    }

# ---------------------------
# EXECUTOR (PNL ENGINE)
# ---------------------------


def executor_act(strategy_msg):
    bias = strategy_msg["bias"]
    pnl = bias * random.uniform(-1.0, 2.2)

    return pnl

# ---------------------------
# EVALUATOR (LEARNING LOOP)
# ---------------------------


def evaluator_act(pnl):
    lr = swarm_memory["learning_rate"]

    if pnl > 0:
        swarm_memory["oracle_bias"] *= (1 + lr)
        swarm_memory["risk_factor"] *= 0.99
    else:
        swarm_memory["oracle_bias"] *= (1 - lr)
        swarm_memory["risk_factor"] *= 1.01

    swarm_memory["oracle_bias"] = max(
        0.5, min(1.5, swarm_memory["oracle_bias"]))
    swarm_memory["risk_factor"] = max(
        0.7, min(1.5, swarm_memory["risk_factor"]))

    return {
        "oracle_bias": swarm_memory["oracle_bias"],
        "risk_factor": swarm_memory["risk_factor"]
    }

# ---------------------------
# MAIN SWARM LOOP
# ---------------------------


async def update_cycle(cycle_num):
    market = generate_market()

    oracle = oracle_act(market)
    strategist = strategist_act(oracle, market)
    pnl = executor_act(strategist)
    evaluation = evaluator_act(pnl)

    cycle = {
        "id": cycle_num,
        "time": datetime.now().strftime("%H:%M:%S"),
        "market": market,
        "oracle": oracle,
        "strategist": strategist,
        "executor": {
            "pnl": round(pnl, 6)
        },
        "evaluator": evaluation
    }

    # store cycles
    data["cycles"].insert(0, cycle)
    data["cycles"] = data["cycles"][:12]

    # payments (swarm economy)
    payment = {
        "from": random.choice(AGENTS),
        "to": random.choice(AGENTS),
        "amount": round(random.uniform(0.0005, 0.003), 6),
        "purpose": strategist["decision"],
        "time": datetime.now().strftime("%H:%M:%S")
    }

    data["payments"].insert(0, payment)
    data["payments"] = data["payments"][:12]

    # FINAL OUTPUT (dashboard contract)
    state = {
        "cycle": cycle_num,
        "market": market,
        "agents": data["agents"],
        "cycles": data["cycles"],
        "payments": data["payments"]
    }

    output_path = "/mnt/c/Users/dell/symbiomarket/dashboard/backend/swarm_data.json"

    with open(output_path, "w") as f:
        json.dump(state, f, indent=2)

    print(f"✅ Cycle {cycle_num} → swarm updated")


# ---------------------------
# RUN LOOP
# ---------------------------
async def main():
    print("🚀 Swarm Intelligence Engine Started")

    for i in range(999999):
        await update_cycle(i + 1)
        await asyncio.sleep(6)


if __name__ == "__main__":
    asyncio.run(main())
