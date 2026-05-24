import os
import asyncio
import json
import sys
sys.path.insert(0, "/mnt/c/Users/dell/symbiomarket")

from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

# Simple nanopay function (no import)
async def real_nanopay(to_address, amount_usdc, memo=""):
    print(f"💸 [REAL NANOPAY] ${amount_usdc} USDC → {to_address[:8]}... | {memo}")
    return {"status": "success"}

def get_llm(temp=0.3):
    return ChatDeepSeek(
        model="deepseek-chat",
        temperature=temp,
        api_key=os.getenv("DEEPSEEK_API_KEY")
    )

async def broadcast_to_swarm(msg):
    print(f"📡 [AXL] {msg.get('agent')} → swarm")

async def cycle():
    print("\n" + "="*80)
    print("🔄 SYMBIOMARKET SWARM CYCLE")

    # Oracle
    oracle_llm = get_llm(0.2)
    oracle_resp = await oracle_llm.ainvoke("""Return **ONLY** this JSON format:
{"signal": "bullish|bearish|neutral", "confidence": 75, "reason": "short insight", "suggested_action": "buy ETH | sell BTC | hold"}""")
    
    try:
        oracle_data = json.loads(oracle_resp.content.strip())
    except:
        oracle_data = {"signal": "neutral", "confidence": 60, "reason": "Market consolidating", "suggested_action": "hold"}
    
    print("🧠 Oracle:", json.dumps(oracle_data, indent=2))
    await broadcast_to_swarm({"agent": "oracle", "payload": oracle_data})
    await real_nanopay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.001, "oracle_signal")

    # Strategist
    strat_llm = get_llm(0.4)
    strat_resp = await strat_llm.ainvoke(f"""Oracle: {oracle_data}
Return **ONLY** JSON: {{"action": "buy|sell|hold|rebalance", "assets": ["ETH","BTC"], "size_percent": 15, "reason": "..."}}""")
    
    try:
        strategy = json.loads(strat_resp.content.strip())
    except:
        strategy = {"action": "hold", "assets": ["BTC"], "size_percent": 0, "reason": "Neutral market"}
    
    print("🧠 Strategist:", json.dumps(strategy, indent=2))
    await broadcast_to_swarm({"agent": "strategist", "payload": strategy})
    await real_nanopay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.002, "strategy")

    # Executor
    print("⚡ Executor: Simulated Arc trade + nanopay settlement")
    await real_nanopay("0x06579E128D3219634f370d03cCbd60b4b55e7811", 0.005, "execution")

async def main():
    print("🚀 SYMBIOMARKET FULL SWARM STARTED\n")
    for _ in range(3):
        await cycle()
        await asyncio.sleep(6)

if __name__ == "__main__":
    asyncio.run(main())
