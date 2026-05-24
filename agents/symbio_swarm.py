import os
import asyncio
import json
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

def get_llm(temperature=0.3):
    return ChatDeepSeek(
        model="deepseek-chat",
        temperature=temperature,
        api_key=os.getenv("DEEPSEEK_API_KEY")
    )

async def broadcast_to_swarm(message):
    print(f"📡 [AXL] {message.get('agent', 'unknown')} → swarm")

async def send_nanopay(from_a, to_a, amount=0.001):
    print(f"💸 [NANOPAY] {from_a} → {to_a} | ${amount} USDC")

async def oracle_agent():
    llm = get_llm(0.2)
    prompt = """You are the Market Oracle Agent in SymbioMarket.
Current date: May 15, 2026.
You have real-time knowledge of crypto markets.

Return **ONLY** valid JSON. No explanation, no extra text.
{
  "signal": "bullish|bearish|neutral",
  "confidence": 75,
  "reason": "1 short sentence with current market insight",
  "suggested_action": "buy ETH | sell BTC | hold | rebalance portfolio"
}"""

    response = await llm.ainvoke(prompt)
    content = response.content.strip()
    try:
        return json.loads(content)
    except:
        return {"signal": "neutral", "confidence": 50, "reason": "Failed to parse", "suggested_action": "hold"}

async def strategist_agent(oracle_data):
    llm = get_llm(0.4)
    prompt = f"""You are the Strategist Agent.
Oracle input: {oracle_data}

Return **ONLY** valid JSON:
{{
  "action": "buy|sell|hold|rebalance",
  "assets": ["ETH", "BTC"],
  "size_percent": 12,
  "reason": "short strategic reasoning"
}}"""

    response = await llm.ainvoke(prompt)
    content = response.content.strip()
    try:
        return json.loads(content)
    except:
        return {"action": "hold", "assets": [], "size_percent": 0, "reason": "fallback"}

async def executor_agent(strategy):
    print("⚡ Executing on Arc testnet (simulated)...")
    return {
        "status": "success",
        "tx_hash": "0x" + os.urandom(16).hex(),
        "assets_traded": strategy.get("assets", []),
        "amount_usdc": strategy.get("size_percent", 0) * 10,
        "nanopay_fee": 0.0008
    }

async def cycle():
    print("\n" + "="*70)
    print("🔄 SYMBIOMARKET SWARM CYCLE")
    
    oracle = await oracle_agent()
    print("🧠 Oracle:", json.dumps(oracle, indent=2))
    await broadcast_to_swarm({"agent": "oracle", "payload": oracle})
    await send_nanopay("oracle", "strategist")

    strategy = await strategist_agent(oracle)
    print("🧠 Strategist:", json.dumps(strategy, indent=2))
    await broadcast_to_swarm({"agent": "strategist", "payload": strategy})
    await send_nanopay("strategist", "executor")

    execution = await executor_agent(strategy)
    print("⚡ Executor:", json.dumps(execution, indent=2))
    await send_nanopay("executor", "pool", 0.005)

async def main():
    print("🚀 FULL SELF-EVOLVING SYMBIOMARKET SWARM STARTED\n")
    for i in range(3):
        await cycle()
        await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(main())
