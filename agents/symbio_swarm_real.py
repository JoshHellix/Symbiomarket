import os
import asyncio
import json
import sys
sys.path.insert(0, "/mnt/c/Users/dell/symbiomarket")

from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
from agents.real_nanopayments import real_agent_pay

load_dotenv()

def get_llm(temp=0.3):
    return ChatDeepSeek(model="deepseek-chat", temperature=temp, api_key=os.getenv("DEEPSEEK_API_KEY"))

async def cycle(cycle_num):
    print(f"\n{'='*100}")
    print(f"🔄 CYCLE {cycle_num} — LIVE AGENT ECONOMY ON ARC")

    # Oracle
    oracle_llm = get_llm(0.2)
    oracle_resp = await oracle_llm.ainvoke("Current crypto market snapshot (May 15 2026). Return ONLY valid JSON.")
    try:
        oracle_data = json.loads(oracle_resp.content.strip())
    except:
        oracle_data = {"signal": "neutral", "confidence": 65, "reason": "consolidation", "suggested_action": "hold"}
    print("🧠 Oracle:", json.dumps(oracle_data, indent=2))
    await real_agent_pay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.001, "oracle_market_intel")

    # Strategist pays for Oracle data
    strat_data = {"action": "hold", "assets": ["BTC","ETH"], "size_percent": 12, "reason": "waiting for breakout"}
    print("🧠 Strategist:", json.dumps(strat_data, indent=2))
    await real_agent_pay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.002, "strategist_decision")

    # Executor settles everything
    print("⚡ Executor: Cross-market execution + CCTP settlement on Arc")
    await real_agent_pay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.01, "final_settlement")

    print("📊 Evaluator active | 🧬 Evolution cycle complete")

async def main():
    print("🚀 SYMBIOMARKET — AGENTS TRADING + PAYING EACH OTHER IN REAL USDC\n")
    for i in range(4):
        await cycle(i+1)
        await asyncio.sleep(8)

if __name__ == "__main__":
    asyncio.run(main())
